import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { FileUploadService } from 'src/shared/file-upload.service';
import { MailerService } from 'src/mailer/mailer.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private fileUploadService: FileUploadService,
    private mailerService: MailerService,
  ) {}

  async getDashboardCounts() {
    const [signupRequests, flats, societies, nocRequests] = await Promise.all([
      this.prisma.signupRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.flat.count(),
      this.prisma.society.count(),
      this.prisma.nOCRequest.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      signupRequests,
      flats,
      societies,
      nocRequests,
    };
  }

  async signup(body: SignupDto, files: Express.Multer.File[]) {
    const { email, password, name, phone, role, societyId, flatNumber } = body;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminAssignment = await this.prisma.adminAssignment.findFirst({
      where: {
        societyId,
        user: { role: 'SOCIETY_ADMIN' },
      },
      include: { user: true },
    });

    if (!adminAssignment) {
      throw new UnauthorizedException('No admin assigned to this society');
    }

    const documentMetadata = await Promise.all(
      files.map(async (file) => ({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: await this.fileUploadService.upload(file),
      })),
    );

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone,
          role,
          status: 'PENDING',
        },
      });

      await tx.signupRequest.create({
        data: {
          userId: user.id,
          societyId,
          flatNumber: String(flatNumber),
          role,
          documents: documentMetadata,
          status: 'PENDING',
        },
      });

      const flatUpdateData =
        role === 'FLAT_OWNER'
          ? { ownerId: user.id }
          : role === 'TENANT'
            ? { tenantId: user.id }
            : {};

      await tx.flat.updateMany({
        where: {
          flatNumber: String(flatNumber),
          societyId,
          status: 'VACANT',
        },
        data: flatUpdateData,
      });

      return user;
    });

    // Only after all DB work is successful, send email
    await this.mailerService.notifyAdminOfSignup(
      adminAssignment.user.email,
      adminAssignment.user.name,
      {
        name: result.name,
        email: result.email,
        phone: result.phone || 'N/A',
        role: result.role,
      },
    );

    return { message: 'Signup request submitted', userId: result.id };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);

    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: user.id,
      role: user.role,
    });

    return { access_token: token };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      expiresIn: '10m',
    });

    const resetLink = `${process.env.SOCIETY_FRONTEND_URL}/reset-password?token=${token}`;
    await this.mailerService.sendForgotPasswordEmail(user.email, resetLink);
    return { message: 'Password reset link sent to your email.' };
  }

  async resetPassword(token: string, newPassword: string) {
    let payload: { sub: number; email?: string };
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: 'Password reset successful' };
  }
}

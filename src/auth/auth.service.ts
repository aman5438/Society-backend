import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { FileUploadService } from 'src/shared/file-upload.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private fileUploadService: FileUploadService,
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

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role,
        status: 'PENDING',
      },
    });

    if (!user) {
      throw new UnauthorizedException('User creation failed');
    }

    const adminAssignment = await this.prisma.adminAssignment.findFirst({
      where: {
        societyId: societyId,
        user: {
          role: 'SOCIETY_ADMIN',
        },
      },
      include: {
        user: true,
      },
    });

    if (!adminAssignment) {
      throw new UnauthorizedException('No admin assigned to this society');
    }

    const documentMetadata = await Promise.all(
      files.map(async (file) => ({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: await this.fileUploadService.upload(file), // ✅ now allowed
      })),
    );

    await this.prisma.signupRequest.create({
      data: {
        userId: user.id,
        societyId,
        flatNumber: String(flatNumber),
        role,
        documents: documentMetadata,
        status: 'PENDING',
        adminId: adminAssignment.userId, // Assign the admin who will approve this request
      },
    });

    const flatUpdateData =
      role === 'FLAT_OWNER'
        ? { ownerId: user.id }
        : role === 'TENANT'
          ? { tenantId: user.id }
          : {};

    await this.prisma.flat.updateMany({
      where: {
        flatNumber: String(flatNumber),
        societyId: societyId,
        status: 'VACANT',
      },
      data: flatUpdateData,
    });

    return { message: 'Signup request submitted', userId: user.id };
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

    console.log(`Password reset link: ${resetLink}`);

    return { message: 'Password reset link sent to your email.', resetLink };
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

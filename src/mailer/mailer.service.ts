import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendTemplate(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, any>,
  ) {
    if (!templateName || !context) {
      throw new Error('Template name and context are required');
    }

    const devPath = path.resolve(
      process.cwd(),
      'src',
      'mailer',
      'templates',
      `${templateName}.hbs`,
    );
    const prodPath = path.resolve(
      __dirname,
      '..',
      'mailer',
      'templates',
      `${templateName}.hbs`,
    );
    const templatePath = fs.existsSync(devPath) ? devPath : prodPath;

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found at: ${templatePath}`);
    }

    const source = fs.readFileSync(templatePath, 'utf8');
    const compiled = handlebars.compile(source);
    const html = compiled(context);

    const info = await this.transporter.sendMail({
      from: `"Society App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent (HTML):', info.messageId);
    console.log('Email sent (to):', to);
  }

  async notifyAdminOfSignup(
    adminEmail: string,
    adminName: string,
    user: {
      name: string;
      email: string;
      phone: string;
      role: string;
    },
  ) {
    await this.sendTemplate(
      adminEmail,
      'New Signup Request Awaiting Approval',
      'admin-notification',
      {
        adminName,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        userRole: user.role,
        adminPortalUrl: `${process.env.SOCIETY_FRONTEND_URL}/login`,
      },
    );
    console.log('Email sent (HTML):', adminEmail);
  }

  async sendForgotPasswordEmail(to: string, resetLink: string) {
    await this.sendTemplate(to, 'Reset Your Password', 'forgot-password', {
      resetLink,
    });
  }
}

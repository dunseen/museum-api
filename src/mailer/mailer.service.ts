import { Injectable, Logger } from '@nestjs/common';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly layoutPath: string;
  private readonly logoDataUri: string;
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('mail.host', { infer: true }),
      port: configService.get('mail.port', { infer: true }),
      ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
      secure: configService.get('mail.secure', { infer: true }),
      requireTLS: configService.get('mail.requireTLS', { infer: true }),
      service: configService.get('mail.service', { infer: true }),
      auth: {
        user: configService.get('mail.user', { infer: true }),
        pass: configService.get('mail.password', { infer: true }),
      },
    });

    const workingDir = this.configService.getOrThrow('app.workingDirectory', {
      infer: true,
    });
    this.layoutPath = path.join(
      workingDir,
      'src',
      'mail',
      'mail-templates',
      'layout.hbs',
    );
    const logoPath = path.join(workingDir, 'assets', 'ufra-logo.png');
    this.logoDataUri =
      'data:image/png;base64,' +
      fsSync.readFileSync(logoPath, { encoding: 'base64' });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const [template, layout] = await Promise.all([
        fs.readFile(templatePath, 'utf-8'),
        fs.readFile(this.layoutPath, 'utf-8'),
      ]);
      const body = Handlebars.compile(template, { strict: true })(context);
      html = Handlebars.compile(layout, { strict: true })({
        ...context,
        body,
        logo: this.logoDataUri,
        lang: (context as Record<string, string>).lang ?? 'pt-BR',
      });
    }

    const defaultEmail = this.configService.get('mail.defaultEmail', {
      infer: true,
    });

    const defaultName = this.configService.get('mail.defaultName', {
      infer: true,
    });

    this.logger.debug(
      `Sending email to: ${mailOptions.to}, subject: ${mailOptions.subject}`,
    );

    const info = await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from ?? `"${defaultName}" <${defaultEmail}>`,
      html: mailOptions.html ?? html,
    });

    this.logger.debug(`Email sent: ${info.messageId}`);
  }
}

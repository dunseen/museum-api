import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerModule } from '../mailer/mailer.module';
import { AuthMailListener } from './auth-mail.listener';

@Module({
  imports: [ConfigModule, MailerModule],
  providers: [MailService, AuthMailListener],
  exports: [MailService],
})
export class MailModule {}

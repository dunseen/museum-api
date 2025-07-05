import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { UserRegisteredEvent } from '../auth/events/user-registered.event';
import { ForgotPasswordEvent } from '../auth/events/forgot-password.event';
import { ConfirmNewEmailEvent } from '../auth/events/confirm-new-email.event';

@Injectable()
export class AuthMailListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('auth.user-registered')
  async handleUserRegistered(event: UserRegisteredEvent) {
    await this.mailService.userSignUp({
      to: event.email,
      data: { hash: event.hash },
    });
  }

  @OnEvent('auth.forgot-password')
  async handleForgotPassword(event: ForgotPasswordEvent) {
    await this.mailService.forgotPassword({
      to: event.email,
      data: { hash: event.hash, tokenExpires: event.tokenExpires },
    });
  }

  @OnEvent('auth.confirm-new-email')
  async handleConfirmNewEmail(event: ConfirmNewEmailEvent) {
    await this.mailService.confirmNewEmail({
      to: event.email,
      data: { hash: event.hash },
    });
  }
}

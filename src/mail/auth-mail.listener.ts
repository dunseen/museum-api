import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { UserRegisteredEvent } from '../auth/events/user-registered.event';
import { ForgotPasswordEvent } from '../auth/events/forgot-password.event';
import { ConfirmNewEmailEvent } from '../auth/events/confirm-new-email.event';
import { AuthEvents } from '../auth/events/auth-events.enum';

@Injectable()
export class AuthMailListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(AuthEvents.userRegistered)
  async handleUserRegistered(event: UserRegisteredEvent) {
    await this.mailService.userSignUp({
      to: event.email,
      data: { hash: event.hash },
    });
  }

  @OnEvent(AuthEvents.forgotPassword)
  async handleForgotPassword(event: ForgotPasswordEvent) {
    await this.mailService.forgotPassword({
      to: event.email,
      data: { hash: event.hash, tokenExpires: event.tokenExpires },
    });
  }

  @OnEvent(AuthEvents.confirmNewEmail)
  async handleConfirmNewEmail(event: ConfirmNewEmailEvent) {
    await this.mailService.confirmNewEmail({
      to: event.email,
      data: { hash: event.hash },
    });
  }
}

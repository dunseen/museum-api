export class ForgotPasswordEvent {
  constructor(
    public readonly email: string,
    public readonly hash: string,
    public readonly tokenExpires: number,
  ) {}
}

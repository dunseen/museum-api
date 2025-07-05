export class ConfirmNewEmailEvent {
  constructor(
    public readonly email: string,
    public readonly hash: string,
  ) {}
}

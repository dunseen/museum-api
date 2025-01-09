import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadType } from './types/jwt-payload.type';

export const JwtPayload = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = data ? request.user?.[data] : request.user;

    return user as JwtPayloadType;
  },
);

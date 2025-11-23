import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  private readonly enableLogging: boolean;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.enableLogging = this.configService.getOrThrow(
      'app.enableRequestLogging',
      {
        infer: true,
      },
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!this.enableLogging) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const userId = request.user?.id || 'Unknown';
    const now = Date.now();

    this.logger.debug(`→ ${method} ${url} | User: ${userId}`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - now;
        this.logger.log(
          `← ${method} ${url} ${response.statusCode} | ${duration}ms`,
        );
      }),
      catchError((err) => {
        const duration = Date.now() - now;
        this.logger.error(
          `✖ ${method} ${url} ${err.status || 500} | ${duration}ms | Error: ${err.message}`,
        );
        throw err;
      }),
    );
  }
}

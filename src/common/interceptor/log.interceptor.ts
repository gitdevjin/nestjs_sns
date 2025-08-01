import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    /**
     * [REQ] {request path} {time}
     *
     * [RES] {request path} {Response Time}
     */

    const req = context.switchToHttp().getRequest();

    const path = req.originalUrl;

    const now = new Date();

    console.log(`[REQ] ${path} ${now.toLocaleString('ca')}`);

    return next.handle().pipe(
      tap((observable) =>
        console.log(
          `[RES] ${new Date().toLocaleString('ca')} ${new Date().getMilliseconds() - now.getMilliseconds()}`
        )
      )
      // map((observable) => {
      //   return {
      //     message: 'reponse is modified',
      //     response: observable,
      //   };
      // })
    );
  }
}

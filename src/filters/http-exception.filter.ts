/* eslint-disable import/prefer-default-export */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { HttpExceptionResponse } from '@interfaces/exception-response.interface';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse: HttpExceptionResponse =
      exception.getResponse() as HttpExceptionResponse;

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      type: 'HttpException',
    };

    if (exceptionResponse.messages) {
      Reflect.set(responseBody, 'messages', exceptionResponse.messages);
    }

    if (exceptionResponse.messages) {
      Reflect.set(responseBody, 'message', exceptionResponse.message);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}

/* eslint-disable import/prefer-default-export */
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { ValidationExceptionResponse } from '@interfaces/exception-response.interface';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(BadRequestException)
export class ValidationExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx: HttpArgumentsHost = host.switchToHttp();

    const exceptionResponse: ValidationExceptionResponse = exception.getResponse() as ValidationExceptionResponse;

    const status = exceptionResponse.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      type: 'ValidationException',
    };

    if (exceptionResponse.messages) {
      Reflect.set(responseBody, 'messages', exceptionResponse.messages);
    }

    if (exceptionResponse.message) {
      Reflect.set(responseBody, 'message', exceptionResponse.message);
    }

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      exceptionResponse.statusCode,
    );
  }
}

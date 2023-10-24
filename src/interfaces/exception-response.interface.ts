export interface HttpExceptionResponse {
  readonly statusCode: number;

  readonly error: string;

  readonly message: unknown;

  readonly messages: unknown[];
}

export interface ValidationExceptionResponse extends HttpExceptionResponse {}

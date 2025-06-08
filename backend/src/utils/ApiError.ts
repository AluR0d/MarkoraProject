export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 400, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'UNKNOWN_ERROR';
    this.name = 'ApiError';
  }
}

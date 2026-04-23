export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    stack = "",
  ) {
    super(message);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(400, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(500, message);
  }
}

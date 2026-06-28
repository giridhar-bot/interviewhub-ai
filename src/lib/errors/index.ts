// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Error Classes
// Typed errors with consistent API responses
// ══════════════════════════════════════════════════════════════

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation error", details?: unknown) {
    super(message, 422, "VALIDATION_ERROR", details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, "BUSINESS_RULE_ERROR", details);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(
      message || `${service} service unavailable`,
      502,
      "EXTERNAL_SERVICE_ERROR",
      { service }
    );
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429, "RATE_LIMIT_ERROR");
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

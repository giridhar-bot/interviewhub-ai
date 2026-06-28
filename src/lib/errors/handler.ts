// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Error Handler
// Catches AppError and returns consistent API responses
// ══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { AppError, isAppError } from "./index";
import { logger } from "@/lib/logger";

export function handleApiError(error: unknown) {
  if (isAppError(error)) {
    if (error.statusCode >= 500) {
      logger.error(error.message, { code: error.code, details: error.details });
    }
    return NextResponse.json(
      {
        success: false,
        code: error.code,
        message: error.message,
        details: error.details,
        requestId: crypto.randomUUID(),
      },
      { status: error.statusCode }
    );
  }

  // Unknown error
  const message = error instanceof Error ? error.message : "Internal server error";
  logger.error("Unhandled error", { error: message });

  return NextResponse.json(
    {
      success: false,
      code: "INTERNAL_ERROR",
      message: "Internal server error",
      requestId: crypto.randomUUID(),
    },
    { status: 500 }
  );
}

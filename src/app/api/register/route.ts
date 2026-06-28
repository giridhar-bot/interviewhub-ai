import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { createUser, getUserByEmail } from "@/services/user.service";
import { rateLimitRegister } from "@/lib/rate-limit";
import { getClientIP } from "@/lib/security";
import { auditLog } from "@/services/audit.service";

export async function POST(request: Request) {
  try {
    // Rate limit
    const ip = await getClientIP();
    const { success: allowed } = await rateLimitRegister(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await getUserByEmail(parsed.data.email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const user = await createUser(parsed.data);

    // Audit log
    await auditLog.create(user.id, "user", user.id, { event: "registration", email: parsed.data.email });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

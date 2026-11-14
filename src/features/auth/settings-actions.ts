"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-guard";
import { userRepository } from "@/repositories/user.repository";
import { auditLog } from "@/services/audit.service";
import { logger } from "@/lib/logger";

const settingsSchema = z.object({
  displayName: z.string().trim().min(2).max(100),
  bio: z.string().trim().max(1000),
  timezone: z
    .string()
    .min(1)
    .max(100)
    .refine((value) => {
      try {
        new Intl.DateTimeFormat("en", { timeZone: value });
        return true;
      } catch {
        return false;
      }
    }, "Please enter a valid timezone, such as Asia/Kolkata."),
});

export async function saveSettings(
  _state: { error: string; message: string },
  formData: FormData
): Promise<{ error: string; message: string }> {
  const user = await requireAuth();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message, message: "" };
  try {
    await userRepository.updateSettings(user.id, parsed.data);
    await auditLog.update(user.id, "user", user.id, undefined, { event: "settings_updated" });
  } catch (error) {
    logger.error("Account settings update failed", error);
    return { error: "Unable to save settings. Please try again.", message: "" };
  }
  revalidatePath("/settings");
  revalidatePath("/profile");
  return { error: "", message: "Changes saved." };
}

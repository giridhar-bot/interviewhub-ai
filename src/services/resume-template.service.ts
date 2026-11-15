import { z } from "zod";
import { resumeTemplateRepository } from "@/repositories/resume-template.repository";
import { logger } from "@/lib/logger";

const catalogSchema = z
  .array(
    z.object({
      name: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      category: z.enum(["Modern", "Traditional", "Minimal", "Creative"]),
      description: z.string().min(1),
      sections: z.array(z.string().min(1)).min(1),
    })
  )
  .max(50);

export async function getResumeTemplateCatalog() {
  const catalog = await resumeTemplateRepository.findCatalog();
  if (!catalog) return [];
  const parsed = catalogSchema.safeParse(catalog.value);
  if (!parsed.success) {
    logger.error("Invalid resume template catalog", {
      issues: parsed.error.issues.map((issue) => issue.message),
    });
    throw new Error("Resume template catalog is invalid.");
  }
  return parsed.data;
}

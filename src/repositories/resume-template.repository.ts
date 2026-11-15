import { prisma } from "@/lib/prisma";

export const resumeTemplateRepository = {
  findCatalog() {
    return prisma.systemSetting.findUnique({
      where: { key: "resume_template_catalog" },
      select: { value: true },
    });
  },
};

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function handleSlugChange(
  entityType: string,
  entityId: string,
  oldSlug: string,
  newSlug: string
): Promise<void> {
  if (oldSlug === newSlug) return;

  await Promise.all([
    // Record in slug history
    prisma.slugHistory.create({
      data: { oldSlug, newSlug, entityType, entityId },
    }),
    // Create redirect
    prisma.redirect.upsert({
      where: { fromPath: `/${entityType}/${oldSlug}` },
      update: { toPath: `/${entityType}/${newSlug}`, active: true },
      create: {
        fromPath: `/${entityType}/${oldSlug}`,
        toPath: `/${entityType}/${newSlug}`,
        statusCode: 301,
        active: true,
      },
    }),
  ]);
}

export async function getRedirectTarget(path: string): Promise<string | null> {
  const redirect = await prisma.redirect.findUnique({
    where: { fromPath: path, active: true },
    select: { toPath: true },
  });
  return redirect?.toPath || null;
}

export async function saveMetaData(
  entityType: string,
  entityId: string,
  data: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonical?: string;
    noIndex?: boolean;
  }
): Promise<void> {
  await prisma.metaData.upsert({
    where: { entityType_entityId: { entityType, entityId } },
    update: data,
    create: { entityType, entityId, ...data },
  });
}

export async function getMetaData(
  entityType: string,
  entityId: string
) {
  return prisma.metaData.findUnique({
    where: { entityType_entityId: { entityType, entityId } },
  });
}

export async function saveSchemaMarkup(
  entityType: string,
  entityId: string,
  type: string,
  data: Prisma.InputJsonValue
): Promise<void> {
  await prisma.schemaMarkup.upsert({
    where: { entityType_entityId: { entityType, entityId } },
    update: { type, data },
    create: { entityType, entityId, type, data },
  });
}

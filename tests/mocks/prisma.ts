// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Prisma Mock
// Install @types/jest or vitest to use typed mocks
// ══════════════════════════════════════════════════════════════

/* eslint-disable @typescript-eslint/no-empty-function */
const noop = () => {};

export const prismaMock = {
  user: {
    findUnique: noop,
    findMany: noop,
    create: noop,
    update: noop,
    delete: noop,
    count: noop,
  },
  article: {
    findUnique: noop,
    findMany: noop,
    create: noop,
    update: noop,
    count: noop,
  },
  company: {
    findUnique: noop,
    findMany: noop,
    count: noop,
  },
};

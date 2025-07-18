import { z } from 'zod';

export const queryEnums = {
  sortBy: ['createdAt', 'updatedAt'],
  orderBy: ['asc', 'desc'],
} as const;

export const queryGeneric = z.object({
  page: z.coerce.number().int().positive().min(1).default(1),
  limit: z.coerce.number().int().positive().min(1).max(100).default(10),
  sortBy: z.enum(queryEnums.sortBy).default('createdAt'),
  orderBy: z
    .enum(queryEnums.orderBy)
    .default('desc')
    .transform(value => (value === 'asc' ? 1 : -1)),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

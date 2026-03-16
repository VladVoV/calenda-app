import { z } from 'zod';

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color')
  .optional();

const dateKey = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD');

export const createTaskSchema = z.object({
  text: z.string().trim().min(1, 'Text is required').max(500),
  color: hexColor,
  dateKey,
  order: z.number().int().min(0).optional(),
});

export const updateTaskSchema = z
  .object({
    text: z.string().trim().min(1).max(500),
    color: hexColor,
    order: z.number().int().min(0),
    dateKey,
  })
  .partial()
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const reorderSchema = z.object({
  tasks: z.array(
    z.object({
      _id: z.string().length(24, 'Must be a valid MongoDB ObjectId'),
      order: z.number().int().min(0),
      dateKey,
    })
  ).min(1),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type ReorderDto = z.infer<typeof reorderSchema>;

import { Request } from 'express';
import { z, ZodError } from 'zod';

export const zParse = async <T extends z.ZodTypeAny>(
  schema: T,
  req: Request
): Promise<z.infer<T>> => {
  try {
    const result = await schema.parseAsync({
      body: req.body,
      query: req.query as any,
      params: req.params as any,
    });
    return result;
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }
    throw new Error('Validation failed');
  }
};

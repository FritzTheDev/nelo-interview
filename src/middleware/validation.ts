// middleware/validation.ts
// This file is where our zod-powered validation middleware will live.

import type { ZodTypeAny } from "zod";

export function validationMiddleware<T extends ZodTypeAny>(schema: T) {
  return (req: any, _res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

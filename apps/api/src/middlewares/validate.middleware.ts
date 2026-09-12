import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

interface RequestValidators {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validate(validators: RequestValidators) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        req.query = (await validators.query.parseAsync(req.query)) as typeof req.query;
      }
      if (validators.params) {
        req.params = (await validators.params.parseAsync(
          req.params
        )) as typeof req.params;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

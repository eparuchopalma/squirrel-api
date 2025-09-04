import { Request, Response, NextFunction } from 'express';
import Fund from '../models/fundModel';
import Record from '../models/recordModel';

export function bodyValidator(req: Request, res: Response, next: NextFunction) {
  if (JSON.stringify(req.body)?.includes("<script>")) return res.sendStatus(400);
  else next();
};

type SchemaValidator<T> = {
  [K in keyof T]: (value: any) => boolean;
};

export function validateSchema(schema: Partial<SchemaValidator<Fund | Record>>, requestKey: keyof Request = 'body') {

  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const invalidKey = Object.keys(body)
      .find(key => !(key in schema));

    if (invalidKey) return res
      .status(400)
      .json({ message: `Invalid key: "${invalidKey}"` });

    const invalidValue = Object.entries(schema)
      .find(([key, isInvalid]) => isInvalid(body[key]));

    if (invalidValue) return res
      .status(400)
      .json({ message: `Invalid value for: "${invalidValue[0]}"` });

    next();
  }
};
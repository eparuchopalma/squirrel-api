import { Request, Response, NextFunction } from 'express';
import { SchemaValidator } from '../types';
import Fund from '../models/fundModel';
import Record from '../models/recordModel';

export function bodyValidator(req: Request, res: Response, next: NextFunction) {
  if (JSON.stringify(req.body)?.includes("<script>")) return res.sendStatus(400);
  else next();
};

export function validateSchema(schemaValidator: SchemaValidator<Fund | Record>) {

  return (req: Request, res: Response, next: NextFunction) => {
    const payloadKeys = Object.keys(schemaValidator) as ('body' | 'params' | 'query')[];

    for (const payloadKey of payloadKeys) {
      const schema = schemaValidator[payloadKey] as SchemaValidator<Fund | Record>;
      const payload = req[payloadKey] || {};
      const invalidKey = Object.keys(payload)
        .find(key => !(key in schema));

      if (invalidKey)  return res
        .status(400)
        .json({ message: `Invalid key: "${invalidKey}"`});

      const [invalidValue] = Object.entries(schema).find(([key, value]) => {
        const validatorFn = value as (val: any) => boolean;
        const validValue = validatorFn(payload[key]);
        return !validValue;
      }) || [undefined];

      if (invalidValue) return res
        .status(400)
        .json({ message: `"${invalidValue}" Cannot be "${payload[invalidValue]}"` });
    }
    next()
  }
};
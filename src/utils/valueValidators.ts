import { isUUID as UUIDValidator } from "validator";

export const isPresent = (val: any) => val !== null && val !== undefined;

export const isString = (val: any) => typeof val === 'string' && val.length <= 250;

export const isNumber = (val: any) => !isNaN(val);

export const isDate = (val: any) => !isNaN(new Date(val).getTime());

export const isUser = (val: any) => [
  (v: any) => typeof v === 'string',
  (v: any) => v.length > 20,
  (v: any) => v.includes('|')
].every(validator => validator(val));

export const isUUID = (val: any) => [
  isString,
  (v: any) => v.length === 36,
  UUIDValidator
].every(validator => validator(val));
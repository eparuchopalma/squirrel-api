import Record from '../models/recordModel';
import { SchemaValidator } from '../types';
import { isUUID, isDate, isString, isNumber, isPresent, isUser } from './valueValidators';

const create: SchemaValidator<Record> = {
  body: {
    amount: (value: any) => isPresent(value) && isNumber(value),
    correlated_fund_id: (value: any) => !isPresent(value) || isUUID(value),
    date: (value: any) => isPresent(value) && isDate(new Date(value)),
    fund_id: (value: any) => isPresent(value) && isUUID(value),
    note: (v: any) => !isPresent(v) || isString(v),
    tag: (v: any) => !isPresent(v) || isString(v),
    type: (value: any) => isPresent(value) && isNumber(value),
    user_id: (value: any) => isPresent(value) && isUser(value),
  }
};

const destroy: SchemaValidator<Record> = {
  body: {
    user_id: (value: any) => isPresent(value) && isUser(value)
  },
  params: {
    id: (value: any) => isPresent(value) && isUUID(value)
  }
};

const read: SchemaValidator<Record & { fromDate: string , toDate: string }> = {
  body: {
    user_id: (value: any) => isPresent(value) && isUser(value)
  },
  params: {
    fromDate: (value: any) => !isPresent(value) || isDate(value),
    toDate: (value: any) => !isPresent(value) || isDate(value),
    fund_id: (value: any) => !isPresent(value) || isUUID(value),
    note: (v: any) => !isPresent(v) || isString(v),
    tag: (v: any) => !isPresent(v) || isString(v),
    type: (value: any) => !isPresent(value) || isNumber(value),
  }
};

const update: SchemaValidator<Record> = {
  body: {
    amount: (value: any) => !isPresent(value) || isNumber(value),
    correlated_fund_id: (value: any) => !isPresent(value) || isUUID(value),
    date: (value: any) => !isPresent(value) || isDate(value),
    fund_id: (value: any) => !isPresent(value) || isUUID(value),
    note: (v: any) => !isPresent(v) || isString(v),
    tag: (v: any) => !isPresent(v) || isString(v),
    type: (value: any) => !isPresent(value) || isNumber(value),
    user_id: (value: any) => !isPresent(value) || isUser(value),
  },
  params: {
    id: (value: any) => isPresent(value) && isUUID(value)
  }
};

export default { create, destroy, read, update };
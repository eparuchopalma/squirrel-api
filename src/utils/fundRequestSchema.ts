import Fund from '../models/fundModel';
import { SchemaValidator } from '../types';
import { isUUID, isString, isPresent, isUser } from './valueValidators';

const create: SchemaValidator<Fund> = {
  body: {
    name: (v: any) => isPresent(v) && isString(v) && v.length <= 50 && v.length > 0,
    user_id: (value: any) => isPresent(value) && isUser(value),
  }
};

const destroy: SchemaValidator<Fund> = {
  body: {
    user_id: (value: any) => isPresent(value) && isUser(value),
  },
  params: {
    id: (value: any) => isPresent(value) && isUUID(value)
  }
};

const read: SchemaValidator<Fund> = {
  body: {
    user_id: (value: any) => isPresent(value) && isUser(value),
  }
};

const update: SchemaValidator<Fund> = {
  body: {
    name: (v: any) => isPresent(v) && isString(v) && v.length <= 50 && v.length > 0,
    user_id: (value: any) => isPresent(value) && isUser(value),
  },
  params: {
    id: (value: any) => isPresent(value) && isUUID(value)
  }
};

export default { create, destroy, read, update };
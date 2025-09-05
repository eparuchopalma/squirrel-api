import { isUUID } from 'validator';
import { SchemaValidator } from '../types';
import Fund from '../models/fundModel';

const create: SchemaValidator<Fund> = {
  body: {
    name: (value: any) => [
      typeof value === 'string',
      value.length > 0,
      value.length <= 50
    ].some(isValid => !isValid),
    user_id: (value: any) => [
      typeof value === 'string',
      value.length > 20,
      value.includes('|')
    ].some(isValid => !isValid)
  }
};

const destroy: SchemaValidator<Fund> = {
  body: {
    user_id: (value: any) => [
      typeof value === 'string',
      value.length > 20,
      value.includes('|')
    ].some(isValid => !isValid)
  },
  params: {
    id: (value: any) => [
      typeof value === 'string',
      value.length === 36,
      isUUID(value)
    ].some(isValid => !isValid)
  }
};

const read: SchemaValidator<Fund> = {
  body: {
    user_id: (value: any) => [
      typeof value === 'string',
      value.length > 20,
      value.includes('|')
    ].some(isValid => !isValid)
  }
};

const update: SchemaValidator<Fund> = {
  body: {
    name: (value: any) => [
      typeof value === 'string',
      value.length > 0,
      value.length <= 50
    ].some(isValid => !isValid),
    user_id: (value: any) => [
      typeof value === 'string',
      value.length > 20,
      value.includes('|')
    ].some(isValid => !isValid)
  },
  params: {
    id: (value: any) => [
      typeof value === 'string',
      value.length === 36,
      isUUID(value)
    ].some(isValid => !isValid)
  }
};

export default { create, destroy, read, update };
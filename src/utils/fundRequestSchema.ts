import { isUUID } from 'validator';

export const createFundSchema = {
  name: (value: any) => [
    typeof value === 'string',
    value.length > 0,
    value.length <= 50
  ].some(match => !match),
  user_id: (value: any) => isUUID(value)
};

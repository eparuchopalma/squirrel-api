export type SchemaValidator<M> = {
  [k in 'body' | 'params' | 'query']?: {
    [A in keyof Partial<M>]: (value: any) => boolean
  };
};
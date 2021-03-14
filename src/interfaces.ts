import {
  AND_OP,
  EQ_OP,
  GT_OP,
  GTE_OP,
  LT_OP,
  LTE_OP,
  NEQ_OP,
  NOT_OP,
  OR_OP,
  REF_OP,
  REGEX_OP,
  LIKE_OP,
  IN_OP,
  CONTAINS_OP,
} from "./operators";

type StringOrNumberOrBoolean<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean: (string | number | boolean);
type StringOrNumberOrBooleanOr<T, OR> = T extends string ? string | OR : T extends number | OR ? number : T extends boolean ? boolean | OR : (string | number | boolean | OR);

export type ValidQueryModelSignature<T, R extends keyof T = keyof T> = { [key in R]: string | boolean | number | string[] | boolean[] | number[] };

export type Ref<T extends ValidQueryModelSignature<T>, K extends keyof T = keyof T> = {
  readonly [REF_OP]: K;
}

export type IPropertyValueQueryType<Type, T extends ValidQueryModelSignature<T>, K extends keyof T = keyof T> = {
  readonly [key in K]?: Type | Ref<T>;
}

export type IPropertyValueQuery<T extends ValidQueryModelSignature<T>, K extends keyof T = keyof T> = {
  readonly [key in K]?: StringOrNumberOrBooleanOr<T[key], Ref<T>>;
}

export interface ICondition<T extends ValidQueryModelSignature<T>, K extends keyof T = keyof T> {
  readonly [EQ_OP]?: ICondition<T> | IPropertyValueQuery<T>;
  readonly [NEQ_OP]?: ICondition<T> | IPropertyValueQuery<T>;
  readonly [GT_OP]?: ICondition<T> | IPropertyValueQuery<T>;
  readonly [GTE_OP]?: ICondition<T> | IPropertyValueQuery<T>;
  readonly [LT_OP]?: ICondition<T> | IPropertyValueQuery<T>;
  readonly [LTE_OP]?: ICondition<T> | IPropertyValueQuery<T>;

  readonly [REGEX_OP]?: IPropertyValueQueryType<RegExp, T>;
  readonly [LIKE_OP]?: IPropertyValueQueryType<string, T>;
  readonly [CONTAINS_OP]?: IPropertyValueQueryType<string, T>;
  readonly [IN_OP]?: { readonly [key in K]?: (readonly StringOrNumberOrBoolean<T[key]>[]) | Ref<T>; };

  readonly [AND_OP]?: readonly (ICondition<T> | IPropertyValueQuery<T>)[];
  readonly [OR_OP]?: readonly (ICondition<T> | IPropertyValueQuery<T>)[];

  readonly [NOT_OP]?: ICondition<T> | IPropertyValueQuery<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ISimpleQuery<T extends ValidQueryModelSignature<T> = any> = ICondition<T> | IPropertyValueQuery<T>;

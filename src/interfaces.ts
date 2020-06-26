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
} from "./operators";

export interface IPropertyValueQuery {
  [property: string]: string | boolean | number | {[REF_OP]: string};
}

export interface ICondition {
  [EQ_OP]?: ICondition | IPropertyValueQuery;
  [NEQ_OP]?: ICondition | IPropertyValueQuery;
  [GT_OP]?: ICondition | IPropertyValueQuery;
  [GTE_OP]?: ICondition | IPropertyValueQuery;
  [GTE_OP]?: ICondition | IPropertyValueQuery;
  [LT_OP]?: ICondition | IPropertyValueQuery;
  [LTE_OP]?: ICondition | IPropertyValueQuery;

  [REGEX_OP]?: {[property: string]: RegExp | {[REF_OP]: string} };
  [LIKE_OP]?: {[property: string]: string | {[REF_OP]: string} };
  [IN_OP]?: {[property: string]: string[] | number[] | {[REF_OP]: string} | ({[REF_OP]: string})[] };

  [AND_OP]?: (ICondition | IPropertyValueQuery)[];
  [OR_OP]?: (ICondition | IPropertyValueQuery)[];

  [NOT_OP]?: ICondition | IPropertyValueQuery;
}

export type ISimpleQuery = ICondition | IPropertyValueQuery;

import {ReferenceResolver, ReferenceResolverFactory, ValidQueryModelSignature} from "./interfaces";

export const REF_OP = '$ref';
export const AND_OP = '$and';
export const OR_OP = '$or';
export const NOT_OP = '$not';
export const EQ_OP = '$eq';
export const NEQ_OP = '$neq';
export const GT_OP = '$gt';
export const GTE_OP = '$gte';
export const LT_OP = '$lt';
export const LTE_OP = '$lte';
export const REGEX_OP = '$regex';
export const IN_OP = '$in';
export const LIKE_OP = '$like';
export const CONTAINS_OP = '$contains';

export function standardResolverFor<T extends ValidQueryModelSignature<T>>(obj: T): ReferenceResolver<T> {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (ref) => {
    if (ref.startsWith('$')) {
      throw new Error(`Unknown operator ${ref}`);
    }

    return obj[ref];
  }
}

// eslint-disable-next-line
const typeCheck: ReferenceResolverFactory<any> = standardResolverFor;

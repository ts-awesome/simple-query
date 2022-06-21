import {ISimpleQuery, ReferenceResolver, ReferenceResolverFactory, ValidQueryModelSignature} from "./interfaces";
import {
  AND_OP,
  CONTAINS_OP,
  EQ_OP,
  GT_OP,
  GTE_OP,
  IN_OP,
  LIKE_OP,
  LT_OP,
  LTE_OP,
  NEQ_OP,
  NOT_OP,
  OR_OP,
  REF_OP,
  REGEX_OP,
  standardResolverFor,
} from "./operators";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function evaluate<T extends ValidQueryModelSignature<T> = any>(query: ISimpleQuery<T>, resolver: ReferenceResolver<T>): boolean {
  return checkCondition<T>(query, resolver);
}

export function match<T extends ValidQueryModelSignature<T>>(candidate: T, condition: ISimpleQuery<T>, resolverFactory: ReferenceResolverFactory<T> = standardResolverFor): boolean {
  return evaluate(condition, resolverFactory(candidate))
}

export function filter<T extends ValidQueryModelSignature<T>>(source: Iterable<T>, condition: ISimpleQuery<T>, resolverFactory?: ReferenceResolverFactory<T>): readonly T[] {
  const result: T[] = [];
  for(const item of source) {
    if (match(item, condition, resolverFactory)) {
      result.push(item);
    }
  }
  return result;
}

function like2regex(s): RegExp {
  s = s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/%/g, '(.+)');
  return new RegExp('^' + s + '$');
}

const ops = {
  [EQ_OP](a, b): boolean { return a === b},
  [NEQ_OP](a, b): boolean { return a !== b},
  [GT_OP](a, b): boolean { return a > b},
  [GTE_OP](a, b): boolean { return a >= b},
  [LT_OP](a, b): boolean { return a < b},
  [LTE_OP](a, b): boolean { return a <= b},
  [IN_OP](a, b): boolean { return Array.isArray(b) && (Array.isArray(a) ? a.some(v => b.indexOf(v) >= 0) : b.indexOf(a) >= 0)},
  [CONTAINS_OP](a, b): boolean { return Array.isArray(a) && a.indexOf(b) >= 0 },
  [REGEX_OP](a, b): boolean { return b instanceof RegExp && b.test(a)},
  [LIKE_OP](a, b): boolean { return b && like2regex(b).test(a); },
};

function hasOwnProperty(x: unknown, key: string): boolean {
  return typeof x === 'object' && x != null && Object.prototype.hasOwnProperty.call(x, key);
}

function checkCondition<T extends ValidQueryModelSignature<T>>(condition: ISimpleQuery<T>, resolver: ReferenceResolver<T>, op: 'every'|'some'|string = 'every'): boolean {
  if (op && op !== 'every' && op !== 'some' && !ops[op]) { //assert
    throw new Error(`Unknown operation ${op}`);
  }

  if (Array.isArray(condition)) {
    return condition[op](condition => checkCondition(condition, resolver));
  }

  if (typeof condition !== 'object') {
    throw new Error(`Unexpected condition object ${JSON.stringify(condition)}`);
  }

  const fn: 'every'|'some' = op === 'some' ? 'some' : "every";
  return Object.entries(condition)[fn](
    ([key, condition]) => {
      switch (key) {
        case AND_OP:
          return checkCondition(condition, resolver, 'every');

        case OR_OP:
          return checkCondition(condition, resolver, 'some');

        case NOT_OP:
          return !checkCondition(condition, resolver);

        case EQ_OP:
        case NEQ_OP:
        case GT_OP:
        case GTE_OP:
        case LT_OP:
        case LTE_OP:
        case IN_OP:
        case CONTAINS_OP:
        case LIKE_OP:
        case REGEX_OP:
          return checkCondition(condition, resolver, key);

        default:
          if (typeof condition === 'object' && hasOwnProperty(condition, REF_OP)) {
            condition = resolver(condition[REF_OP]);
          }

          if (key.startsWith('$')) {
            return resolver(key, condition);
          }

          if (ops[op]) {
            return ops[op](resolver(key), condition);
          }

          switch (typeof condition) {
            case 'number':
            case 'string':
            case 'boolean':
              return resolver(key) === condition;

            default:
              if (condition == null) {
                return resolver(key) == null;
              }

              if (Array.isArray(condition)) {
                const value = resolver(key);
                if (!Array.isArray(value)) {
                  return condition.indexOf(value) >= 0;
                }

                return value.some(v => condition.indexOf(v) >= 0)
              }

              // noinspection SuspiciousTypeOfGuard
              if (condition instanceof RegExp) {
                return condition.test(resolver(key) as string);
              }

              throw new Error(`Unexpected condition for key ${key} = ${JSON.stringify(condition)} (typeof ${typeof condition})`);
          }
      }
    })
}

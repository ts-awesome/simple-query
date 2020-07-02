import {ISimpleQuery} from "./interfaces";
import {
  AND_OP,
  EQ_OP,
  GT_OP,
  GTE_OP, IN_OP,
  LIKE_OP,
  LT_OP,
  LTE_OP,
  NEQ_OP,
  NOT_OP,
  OR_OP,
  REF_OP,
  REGEX_OP
} from "./operators";

interface ReferenceResolver {
  (ref: string, value?: ISimpleQuery): number | string | boolean | number[] | string[] | null | undefined | RegExp;
}

export function evaluate(query: ISimpleQuery, resolver: ReferenceResolver): boolean {
  return checkCondition(query, resolver);
}

function like2regex(s): RegExp {
  s = s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/%/g, '(.+)');
  return new RegExp('^' + s + '$');
}

const ops = {
  [EQ_OP](a, b) { return a === b},
  [NEQ_OP](a, b) { return a !== b},
  [GT_OP](a, b) { return a > b},
  [GTE_OP](a, b) { return a >= b},
  [LT_OP](a, b) { return a < b},
  [LTE_OP](a, b) { return a <= b},
  [IN_OP](a, b) { return Array.isArray(b) && b.indexOf(a) >= 0},
  [REGEX_OP](a, b) { return b instanceof RegExp && b.test(a)},
  [LIKE_OP](a, b) { return b && like2regex(b).test(a); },
};

function checkCondition(condition: ISimpleQuery, resolver: ReferenceResolver, op: 'every'|'some'|string = 'every'): boolean {
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
  return Object.entries(condition)[fn]
    (([key, condition]) => {
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
        case LIKE_OP:
        case REGEX_OP:
          return checkCondition(condition, resolver, key);

        default:
          if (typeof condition === 'object' && condition?.hasOwnProperty(REF_OP)) {
            condition = resolver(condition[REF_OP]);
          }

          if (key.startsWith('$')) {
            return resolver(key, condition);
          }

          if (ops[op]) {
            return ops[op](resolver(key), condition);
          }

          switch (typeof condition) {
            case 'undefined':
            case 'null' as any:
              return resolver(key) == null;

            case 'number':
            case 'string':
            case 'boolean':
              return resolver(key) === condition;

            default:
              if (condition == null) {
                return resolver(key) == null;
              }

              if (Array.isArray(condition)) {
                return condition.indexOf(resolver(key)) >= 0;
              }

              if (condition instanceof RegExp) {
                return condition.test(resolver(key) as string);
              }

              throw new Error(`Unexpected condition for key ${key} = ${JSON.stringify(condition)} (typeof ${typeof condition})`);
          }
      }
    })
}

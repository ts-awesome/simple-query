import {IOrderBy, ReferenceResolver, ReferenceResolverFactory, ValidQueryModelSignature} from "./interfaces";
import {standardResolverFor} from "./operators";

export function sort<T extends ValidQueryModelSignature<T>>(source: Iterable<T>, by: string, resolverFactory?: ReferenceResolverFactory<T>): readonly T[];
export function sort<T extends ValidQueryModelSignature<T>>(source: Iterable<T>, by: readonly IOrderBy<T>[], resolverFactory?: ReferenceResolverFactory<T>): readonly T[];
export function sort<T extends ValidQueryModelSignature<T>>(source: Iterable<T>, by: readonly IOrderBy<T>[] | string, resolverFactory?: ReferenceResolverFactory<T>): readonly T[] {
  let results = [...source];
  for(const order of [...(typeof by === 'string' ? parseSort<T>(by) : (by ?? []))].reverse()) {
    results = results.sort(sortBy(order, resolverFactory));
  }

  return results;
}

function parseSort<T extends ValidQueryModelSignature<T>>(sort: string): readonly IOrderBy<T>[] {
  return sort
    .split(',')
    .map(x => x.trim())
    .filter(x => x)
    .map(x => ({
      [x.replace(/[+-]$/, '')]: x.endsWith('-') ? 'DESC' : 'ASC'
    } as never))
}

function sortBy<T extends ValidQueryModelSignature<T>>(by: IOrderBy<T>, resolverFactory: ReferenceResolverFactory<T> = standardResolverFor): ((a, b) => -1|0|1) {
  const [[key, direction = 'ASC'] = []] = Object.entries(by) ;
  if (!key) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => 0;
  }

  const cmp = direction === 'DESC' ? desc : asc;
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (a, b) => {
    const resolverA = resolverFactory(a);
    const resolverB = resolverFactory(b);
    const _a = resolverA(key);
    const _b = resolverB(key);
    return cmp(_a, _b);
  }
}

function asc<T = unknown>(a: T, b: T): -1|0|1 {
  return a < b ? -1 : a > b ? 1 : 0;
}

function desc<T = unknown>(a: T, b: T): -1|0|1 {
  return a < b ? 1 : a > b ? -1 : 0;
}

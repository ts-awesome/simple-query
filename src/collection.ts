import {ISimpleQuery, IOrderBy, ValidQueryModelSignature, ReferenceResolverFactory} from "./interfaces";
import {filter} from "./evaluator";
import {sort} from "./sorter";

export class Collection<T extends ValidQueryModelSignature<T>> implements Iterable<T> {
  private _where: ISimpleQuery<T>[] = [];
  private _orderBy: IOrderBy<T>[] | string = [];

  constructor(
    private source: Iterable<T>,
    private resolverFactory?: ReferenceResolverFactory<T>,
  ) {
  }

  public where(where: ISimpleQuery<T>): this {
    this._where.push(where);
    return this;
  }

  public orderBy(...by: readonly IOrderBy<T>[]): this;
  public orderBy(by: string): this;
  public orderBy(first: IOrderBy<T> | string, ...rest: IOrderBy<T>[]): this {
    this._orderBy = typeof first === 'string' ? first : [first, ...rest];
    return this;
  }

  [Symbol.iterator](): Iterator<T> {
    return this.valueOf()[Symbol.iterator]();
  }

  public valueOf(): readonly T[] {
    const condition = {
      $and: [...this._where]
    }
    const filtered = filter(this.source, condition, this.resolverFactory);
    return sort(filtered, this._orderBy as never, this.resolverFactory);
  }
}

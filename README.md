# @ts-awesome/simple-query

TypeScript friendly SimpleQuery evaluator. Heavily inspired by Mongo Query Language

## Base use

```ts
import {match} from "@ts-awesome/simple-query";

const query = {
  a: 5, // short cut for {$eq: {a: 5}
};

const candidate = {a: 5, b: 6};

const result = match(candidate, query);
```

Works with iterables as well

```ts
import {filter} from "@ts-awesome/simple-query";

const query = {
  a: 5, // short cut for {$eq: {a: 5}
};

const candidate = [{a: 5, b: 6}, {a: 2}, {a: 5, b: 1}];

const result = filter(candidate, query);
```

We have sorting too

```ts
import {sort} from "@ts-awesome/simple-query";

const candidate = [{a: 5, b: 6}, {a: 2}, {a: 5, b: 1}];

const orderedByA = sort(candidate, 'a');
const orderedByAdB = sort(candidate, 'a-,b+');
// ordering with typescript validation on keys
const orderedByAdB2 = sort(candidate, [{a: 'DESC'}, {b: 'DESC'}]);
```

### Collections

Wrap you Iterable into Collection and do queries and ordering. 
Result is calculated when collection is iterated or `valueOf` is invoked.

```ts
import {Collection} from "@ts-awesome/simple-query";

interface IModel {
  a: number;
  b?: string;
}

const data: Iterable<IModel>;
const collecton = new Collection(data);

const result = collecton
  .where({$gt: {a: 3}})
  .sort('a-, b');

for(const item of result) {
  console.log(item);
}
```

## Query language

### Binary operators

* `{$eq: {[left]: right}}` equivalent to `data[left] === right` 
* `{$neq: {[left]: right}}` equivalent to `data[left] !== right` 
* `{$gt: {[left]: right}}` equivalent to `data[left] > right` 
* `{$gte: {[left]: right}}` equivalent to `data[left] >= right` 
* `{$lt: {[left]: right}}` equivalent to `data[left] < right` 
* `{$lte: {[left]: right}}` equivalent to `data[left] <= right` 
* `{$lte: {[left]: right}}` equivalent to `data[left] <= right` 
* `{$regex: {[left]: right}}` equivalent to `right.test(data[left])` 
* `{$like: {[left]: right}}` checks if to `data[left]` matches like pattern in `right`, `%` is any characters
* `{$in: {[left]: right}}` equivalent to `right.indexOf(data[left]) >= 0`
* `{$contains: {[left]: right}}` equivalent to `data[left].indexOf(right) >= 0`

### Logical

* `{$not: {/*condition*/}}` equivalent to `!(/*condition*/)`
* `{$and: [{/*condition 1*/}, {/*condition 2*/}]` equivalent to `(/*condition 1*/) && (/*condition 2*/)`
* `{$or: [{/*condition 1*/}, {/*condition 2*/}]` equivalent to `(/*condition 1*/) || (/*condition 2*/)`

### Reference

In some cases you need to check again other prop value. 
`{$ref: 'prop'}` does exactly that.

Example: `{$neq: {a: {$ref: 'b'}}}`

## Advanced use

Functions like `evaluate`, `match`, `filter`, `sort` and `Collection` support 
optional `ReferenceResolverFactory`. By default `standardResolverFactory` is used

```ts
import {ISimpleQuery, ValidQueryModelSignature, ReferenceResolver} from "@ts-awesome/simple-query";

function standardResolverFor<T extends ValidQueryModelSignature<T>>(obj: T): ReferenceResolver<T> {
  return (ref, value?: ISimpleQuery) => {
    // operators must start with $, then second argument `value` is passed
    if (ref.startsWith('$')) {
      // here you can support custom operators
      throw new Error(`Unknown operator ${ref}`);
    }
    
    // here is simplest name resolution, but you can do all kinds of magic here 
    return obj[ref];
  }
}
```

Providing own `ReferenceResolverFactory` opens lots of new possibilities


# License
May be freely distributed under the [MIT license](https://opensource.org/licenses/MIT).

Copyright (c) 2022 Volodymyr Iatsyshyn and other contributors

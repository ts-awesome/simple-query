const { evaluate, REF_OP} = require('../dist');

describe('operators', () => {

  const d = {
    a: 1,
    b: '1',
    c: true,
    r: /^a$/i,
    l: '',
    na: [1, 2, 3],
    sa: ['1', '2', '3'],
  }
  const itemnums = {
    x: 1,
  };

  const resolver = (x) => x.startsWith('$itemnum.') ? itemnums[x.substring(9)] : d[x];

  it('simple equal', async () => {
    expect(evaluate({a: null}, resolver)).toBe(false);
    expect(evaluate({a: {[REF_OP]: 'a'}}, resolver)).toBe(true);
    expect(evaluate({a: {[REF_OP]: 'b'}}, resolver)).toBe(false);
    expect(evaluate({b: {[REF_OP]: 'b'}}, resolver)).toBe(true);
    expect(evaluate({b: {[REF_OP]: 'a'}}, resolver)).toBe(false);
    expect(evaluate({c: {[REF_OP]: 'c'}}, resolver)).toBe(true);
    expect(evaluate({c: {[REF_OP]: 'a'}}, resolver)).toBe(false);

    expect(evaluate({a: {[REF_OP]: '$itemnum.x'}}, resolver)).toBe(true);
    expect(evaluate({'$itemnum.x': {[REF_OP]: 'a'}}, resolver)).toBe(true);
  });

});

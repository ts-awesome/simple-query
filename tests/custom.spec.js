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
    '1': 1,
  };

  const resolver = (x, v) => {
    if (x === '$itemnum') {
      return Object.keys(itemnums).indexOf(v) >= 0;
    }

    return x.startsWith('$itemnum.') ? itemnums[x.substring(9)] : d[x];
  }

  it('custom op', async () => {
    expect(evaluate({$itemnum: 'x'}, resolver)).toBe(true);
    expect(evaluate({$itemnum: 'yx'}, resolver)).toBe(false);
    expect(evaluate({$itemnum: {[REF_OP]: 'a'}}, resolver)).toBe(false);
    expect(evaluate({$itemnum: {[REF_OP]: 'b'}}, resolver)).toBe(true);
  });

});

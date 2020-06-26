const { evaluate, LIKE_OP, REF_OP} = require('../dist');

describe('operators', () => {

  const d = {
    a: 1,
    b: '1',
    x: '1234',
    c: true,
    r: /^a$/i,
    l: '1%',
    na: [1,2,3],
    sa: ['1','2','3'],
  }
  const resolver = (x) => d[x];

  it('like', async () => {
    expect(evaluate({[LIKE_OP]: {b: '1'}}, resolver)).toBe(true);
    expect(evaluate({[LIKE_OP]: {b: '1%'}}, resolver)).toBe(false);
    expect(evaluate({[LIKE_OP]: {x: '1%'}}, resolver)).toBe(true);
    expect(evaluate({[LIKE_OP]: {x: '%4'}}, resolver)).toBe(true);
    expect(evaluate({[LIKE_OP]: {x: '1%4'}}, resolver)).toBe(true);
    expect(evaluate({[LIKE_OP]: {x: '%1%4'}}, resolver)).toBe(false);
    expect(evaluate({[LIKE_OP]: {x: '1%4%'}}, resolver)).toBe(false);
    expect(evaluate({[LIKE_OP]: {b: 'test%'}}, resolver)).toBe(false);
    expect(evaluate({[LIKE_OP]: {x: {[REF_OP]: 'l'}}}, resolver)).toBe(true);
  });
})

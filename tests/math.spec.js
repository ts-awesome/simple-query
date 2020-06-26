const { evaluate, GT_OP, GTE_OP, LT_OP, LTE_OP} = require('../dist');

describe('operators', () => {

  const d = {
    a: 1,
    b: '1',
    c: true,
    r: /^a$/i,
    l: '',
    na: [1,2,3],
    sa: ['1','2','3'],
  }
  const resolver = (x) => d[x];

  it('greater op', async () => {
    expect(evaluate({[GT_OP]: {a: 1}}, resolver)).toBe(false);
    expect(evaluate({[GT_OP]: {a: 0}}, resolver)).toBe(true);
    expect(evaluate({[GT_OP]: {b: '1'}}, resolver)).toBe(false);
    expect(evaluate({[GT_OP]: {b: ''}}, resolver)).toBe(true);
  });

  it('greater equal op', async () => {
    expect(evaluate({[GTE_OP]: {a: 2}}, resolver)).toBe(false);
    expect(evaluate({[GTE_OP]: {a: 1}}, resolver)).toBe(true);
    expect(evaluate({[GTE_OP]: {b: '11'}}, resolver)).toBe(false);
    expect(evaluate({[GTE_OP]: {b: '1'}}, resolver)).toBe(true);
  });

  it('less op', async () => {
    expect(evaluate({[LT_OP]: {a: 1}}, resolver)).toBe(false);
    expect(evaluate({[LT_OP]: {a: 2}}, resolver)).toBe(true);
    expect(evaluate({[LT_OP]: {b: '1'}}, resolver)).toBe(false);
    expect(evaluate({[LT_OP]: {b: '11'}}, resolver)).toBe(true);
  });

  it('less equal op', async () => {
    expect(evaluate({[LTE_OP]: {a: 0}}, resolver)).toBe(false);
    expect(evaluate({[LTE_OP]: {a: 1}}, resolver)).toBe(true);
    expect(evaluate({[LTE_OP]: {b: ''}}, resolver)).toBe(false);
    expect(evaluate({[LTE_OP]: {b: '1'}}, resolver)).toBe(true);
  });
})

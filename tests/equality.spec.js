const { evaluate, EQ_OP, NEQ_OP} = require('../dist');

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

  it('simple equal', async () => {
    expect(evaluate({a: 1}, resolver)).toBe(true);
    expect(evaluate({a: 2}, resolver)).toBe(false);
    expect(evaluate({b: '1'}, resolver)).toBe(true);
    expect(evaluate({b: '2'}, resolver)).toBe(false);
    expect(evaluate({c: true}, resolver)).toBe(true);
    expect(evaluate({c: false}, resolver)).toBe(false);
  });

  it('equal op', async () => {
    expect(evaluate({[EQ_OP]: {a: 1}}, resolver)).toBe(true);
    expect(evaluate({[EQ_OP]: {a: 2}}, resolver)).toBe(false);
    expect(evaluate({[EQ_OP]: {b: '1'}}, resolver)).toBe(true);
    expect(evaluate({[EQ_OP]: {b: '2'}}, resolver)).toBe(false);
    expect(evaluate({[EQ_OP]: {c: true}}, resolver)).toBe(true);
    expect(evaluate({[EQ_OP]: {c: false}}, resolver)).toBe(false);
  });

  it('not equal op', async () => {
    expect(evaluate({[NEQ_OP]: {a: 1}}, resolver)).toBe(false);
    expect(evaluate({[NEQ_OP]: {a: 2}}, resolver)).toBe(true);
    expect(evaluate({[NEQ_OP]: {a: '1'}}, resolver)).toBe(true);
    expect(evaluate({[NEQ_OP]: {b: '1'}}, resolver)).toBe(false);
    expect(evaluate({[NEQ_OP]: {b: '2'}}, resolver)).toBe(true);
    expect(evaluate({[NEQ_OP]: {c: true}}, resolver)).toBe(false);
    expect(evaluate({[NEQ_OP]: {c: false}}, resolver)).toBe(true);
  });
})

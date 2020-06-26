const { evaluate, REGEX_OP, REF_OP} = require('../dist');

describe('operators', () => {

  const d = {
    a: 1,
    b: '1',
    c: true,
    r: /^1$/i,
    l: '',
    na: [1,2,3],
    sa: ['1','2','3'],
  }
  const resolver = (x) => d[x];

  it('simple regexp', async () => {
    expect(evaluate({b: /^1$/i}, resolver)).toBe(true);
    expect(evaluate({b: /^test$/i}, resolver)).toBe(false);
    expect(evaluate({b: {[REF_OP]: 'r'}}, resolver)).toBe(true);
  });

  it('regexp op', async () => {
    expect(evaluate({[REGEX_OP]: {b: /^1$/i}}, resolver)).toBe(true);
    expect(evaluate({[REGEX_OP]: {b: /^test$/i}}, resolver)).toBe(false);
    expect(evaluate({[REGEX_OP]: {b: {[REF_OP]: 'r'}}}, resolver)).toBe(true);
  });
})

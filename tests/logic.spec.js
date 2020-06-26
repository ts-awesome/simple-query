const { evaluate, AND_OP, OR_OP, NOT_OP} = require('../dist');

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

  it('not op', async () => {
    expect(evaluate({[NOT_OP]: {a: 1}}, resolver)).toBe(false);
    expect(evaluate({[NOT_OP]: {a: 2}}, resolver)).toBe(true);
    expect(evaluate({[NOT_OP]: {b: '1'}}, resolver)).toBe(false);
    expect(evaluate({[NOT_OP]: {b: '2'}}, resolver)).toBe(true);
    expect(evaluate({[NOT_OP]: {c: true}}, resolver)).toBe(false);
    expect(evaluate({[NOT_OP]: {c: false}}, resolver)).toBe(true);
  });

  it('and op', async () => {
    expect(evaluate({[AND_OP]: [{a: 1}, {b: '1'}]}, resolver)).toBe(true);
    expect(evaluate({[AND_OP]: [{a: 1}, {b: '2'}]}, resolver)).toBe(false);
    expect(evaluate({[AND_OP]: [{b: '1'}, {a: 1}]}, resolver)).toBe(true);
    expect(evaluate({[AND_OP]: [{b: 'a'}, {a: 2}]}, resolver)).toBe(false);
    expect(evaluate({[AND_OP]: [{c: true}, {a: 1}]}, resolver)).toBe(true);
    expect(evaluate({[AND_OP]: [{c: true}, {a: 2}]}, resolver)).toBe(false);
  });

  it('or op', async () => {
    expect(evaluate({[OR_OP]: [{a: 2}, {b: '1'}]}, resolver)).toBe(true);
    expect(evaluate({[OR_OP]: [{a: 2}, {b: '2'}]}, resolver)).toBe(false);
    expect(evaluate({[OR_OP]: [{b: 'a'}, {a: 1}]}, resolver)).toBe(true);
    expect(evaluate({[OR_OP]: [{b: 'a'}, {a: 2}]}, resolver)).toBe(false);
    expect(evaluate({[OR_OP]: [{c: false}, {a: 1}]}, resolver)).toBe(true);
    expect(evaluate({[OR_OP]: [{c: false}, {a: 2}]}, resolver)).toBe(false);
  });

  it('recursive', async () => {
    expect(evaluate({
      [AND_OP]: [
        {
          [OR_OP]: [
            {a: 2},
            {b: '1'}
          ]
        },
        {
          [NOT_OP]: {a: 2}
        }
    ]}, resolver)).toBe(true);
  });
})

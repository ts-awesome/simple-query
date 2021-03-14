const { evaluate, IN_OP, REF_OP, CONTAINS_OP} = require('../dist');

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


  it('simple in', async () => {
    expect(evaluate({a: [1,2,3]}, resolver)).toBe(true);
    expect(evaluate({a: [2,3]}, resolver)).toBe(false);
    expect(evaluate({b: ['1', '2', '3']}, resolver)).toBe(true);
    expect(evaluate({b: ['2', '3']}, resolver)).toBe(false);
    expect(evaluate({a: {[REF_OP]: 'na'}}, resolver)).toBe(true);
    expect(evaluate({b: {[REF_OP]: 'sa'}}, resolver)).toBe(true);
    expect(evaluate({na: [1]}, resolver)).toBe(true);
    expect(evaluate({na: [10]}, resolver)).toBe(false);
  });

  it('op in', async () => {
    expect(evaluate({[IN_OP]: {a: [1,2,3]}}, resolver)).toBe(true);
    expect(evaluate({[IN_OP]: {a: [2,3]}}, resolver)).toBe(false);
    expect(evaluate({[IN_OP]: {b: ['1', '2', '3']}}, resolver)).toBe(true);
    expect(evaluate({[IN_OP]: {b: ['2', '3']}}, resolver)).toBe(false);
    expect(evaluate({[IN_OP]: {a: {[REF_OP]: 'na'}}}, resolver)).toBe(true);
    expect(evaluate({[IN_OP]: {b: {[REF_OP]: 'sa'}}}, resolver)).toBe(true);
    expect(evaluate({[IN_OP]: {na: [1]}}, resolver)).toBe(true);
    expect(evaluate({[IN_OP]: {na: [10]}}, resolver)).toBe(false);
  });

  it('op contains', async () => {
    expect(evaluate({[CONTAINS_OP]: {na: 1}}, resolver)).toBe(true);
    expect(evaluate({[CONTAINS_OP]: {na: 10}}, resolver)).toBe(false);
  });
})

const { match, AND_OP, NOT_OP, GT_OP} = require('../dist');

describe('match', () => {

  it('case a', () => {
    const expr = {
      [AND_OP]: [
        {
          [GT_OP]: {
            intro_discount_open: 0
          }
        },
        {
          [NOT_OP]: {
            intro_discount_total: null
          }
        },
      ]
    };

    const data = {
      intro_discount_open: 3,
      intro_discount_total: 34,
    }

    expect(match(data, expr)).toBe(true);
  });

  it('case b', () => {
    const expr = {
      [AND_OP]: [
        {
          [GT_OP]: {
            intro_discount_open: 10
          }
        },
      ]
    };

    const data = {
      intro_discount_open: 3,
      intro_discount_total: 34,
    }

    expect(match(data, expr)).toBe(false);
  });

});

const { filter, AND_OP, NOT_OP, GT_OP} = require('../dist');

describe('filter', () => {

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

    const data = [
      {
        intro_discount_open: 3,
        intro_discount_total: 34,
      }, {
        intro_discount_open: 10,
        intro_discount_total: null,
      }, {
        intro_discount_open: 0,
        intro_discount_total: 5,
      }
    ]

    expect(filter(data, expr)).toStrictEqual([
      {
        intro_discount_open: 3,
        intro_discount_total: 34,
      }
    ]);
  });

});

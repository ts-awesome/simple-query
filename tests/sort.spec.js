const { sort} = require('../dist');

describe('sort', () => {

  it('case a', () => {
    const expr = [
      {intro_discount_open: 'ASC'}
    ];

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
      }, {
        intro_discount_open: -5,
        intro_discount_total: 5,
      }
    ]

    expect(sort(data, expr).map(x => x.intro_discount_open)).toStrictEqual([-5, 0, 3, 10])
  });

  it('case b', () => {
    const expr = 'intro_discount_open,intro_discount_total-';

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
      }, {
        intro_discount_open: 0,
        intro_discount_total: 3,
      }, {
        intro_discount_open: -5,
        intro_discount_total: 5,
      }
    ]

    expect(sort(data, expr).map(x => [x.intro_discount_open, x.intro_discount_total])).toStrictEqual([[-5, 5], [0, 5], [0, 3], [3, 34], [10, null]])
  });

  it('case c', () => {
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
      }, {
        intro_discount_open: 0,
        intro_discount_total: 3,
      }, {
        intro_discount_open: -5,
        intro_discount_total: 5,
      }
    ]

    expect(sort(data, []).map(x => [x.intro_discount_open, x.intro_discount_total])).toStrictEqual([[3, 34], [10, null], [0, 5], [0, 3], [-5, 5]])
  });

});

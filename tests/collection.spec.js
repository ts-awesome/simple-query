const { Collection, NOT_OP, GT_OP} = require('../dist');

describe('collection', () => {

  it('where and orderBy', () => {
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
        intro_discount_open: 10,
        intro_discount_total: 15,
      }, {
        intro_discount_open: 10,
        intro_discount_total: 5,
      }
    ]

    const result = new Collection(data)
      .where({
        [GT_OP]: {
          intro_discount_open: 1
        }
      })
      .where({
        [NOT_OP]: {
          intro_discount_total: null
        }
      })
      .orderBy({intro_discount_open: 'DESC'}, {intro_discount_total: 'ASC'})
      .valueOf()

    expect(result.map(x => [x.intro_discount_open, x.intro_discount_total]))
      .toStrictEqual([[10, 5], [10, 15], [3, 34]])
  });

});

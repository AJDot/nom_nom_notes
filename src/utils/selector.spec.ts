import Selector from './selector'

describe('selector.ts', () => {
  it('starts with nothing currently selected', () => {
    const selector = new Selector([[1, 2, 3]])
    expect(selector.current).to.eq(null)
  })

  describe('with multiple collections', () => {
    it('can scan up and down across collections', () => {
      const selector = new Selector([[1, 2, 3], ['a', 'b', 'c']])
      const expected = [1, 2, 3, 'a', 'b', 'c', 1, 2, 3, 'a']
      expected.forEach(e => {
        selector.down()
        expect(selector.current).to.eq(e)
      })
      expected.reverse().forEach(e => {
        expect(selector.current).to.eq(e)
        selector.up()
      })
    })
  })
})

import { Block } from '../../../src/interfaces/blockInterfacesGeneral'
import Guid from '../../../src/utils/guid'

describe('Show Dynamic Recipe', () => {
  context('Not logged in', () => {
    it('shows the dynamic recipe with blocks in the correct order', () => {
      cy.createFry()
      const rowId = Guid.create()
      const column1Id = Guid.create()
      const column2Id = Guid.create()
      const h1Id = Guid.create()
      const text1Id = Guid.create()
      const text2Id = Guid.create()
      // block order only matters scoped to a parent
      const blocks: Block[] = [
        { id: h1Id, type: 'h1', content: { text: 'Description' } },
        { id: column1Id, type: 'column', parentId: rowId },
        { id: text2Id, type: 'text', content: { text: 'Ingredient 2' }, parentId: column2Id },
        { id: rowId, type: 'row' },
        { id: text1Id, type: 'text', content: { text: 'Ingredient 1' }, parentId: column1Id },
        { id: column2Id, type: 'column', parentId: rowId },
      ]
      cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
        dynamic_recipe: { name: 'Pasta', blocks },
      })
        .then(() => {
          cy.visit('/dynamic_recipes')
          cy.contains('a', 'Pasta').click()
        })
        .then(() => {
          const data = [
            { id: h1Id, text: 'Description' },
            { id: rowId, text: 'Ingredient 1Ingredient 2' },
            { id: column1Id, text: 'Ingredient 1' },
            { id: text1Id, text: 'Ingredient 1' },
            { id: column2Id, text: 'Ingredient 2' },
            { id: text2Id, text: 'Ingredient 2' },
          ]
          cy.get('[data-test-block]').should('have.length', 6)
            .each((block, i) => {
              // blocks are displayed in the correct order
              expect(block.data('id')).to.equal(data[i].id)
              // blocks contain the correct text AND are nested correctly (e.g. row contains both texts, each column contains its one text)
              expect(block.text()).to.equal(data[i].text)
            })
        })
    })
  })
})

import { Block } from '../../../../src/interfaces/blockInterfacesGeneral'
import Guid from '../../../../src/utils/guid'

describe('Delete Dynamic Recipe Block', () => {
  function assertBlocks(expected: { id?: string, text: string }[]) {
    cy.get('[data-test-block]').should('have.length', expected.length)
      .each((block, i) => {
        if (expected[i].id) expect(block.data('id')).to.equal(expected[i].id)
        expect(block.text()).to.equal(expected[i].text)
      })
  }

  beforeEach(function () {
    cy.createFry().as('fry')
  })

  context('Logged in', () => {
    beforeEach(() => {
      cy.forceSignIn()
    })

    it('allows me to delete a block with "backspace" or "delete"', function () {
      const rowId = Guid.create()
      const column1Id = Guid.create()
      const column2Id = Guid.create()
      const h1Id = Guid.create()
      const h2Id = Guid.create()
      const h3Id = Guid.create()
      const text1Id = Guid.create()
      const text2Id = Guid.create()
      const text3Id = Guid.create()
      const sidebarId = Guid.create()
      const imageId = Guid.create()
      const ingredientId = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: 'h1', content: { text: 'Heading 1' } },
        { id: h2Id, type: 'h2', content: { text: 'Heading 2' } },
        { id: h3Id, type: 'h3', content: { text: 'Heading 3' } },
        { id: rowId, type: 'row' },
        { id: column1Id, type: 'column', parentId: rowId },
        { id: text1Id, type: 'text', content: { text: 'Ingredient 1' }, parentId: column1Id },
        { id: column2Id, type: 'column', parentId: rowId },
        { id: text2Id, type: 'text', content: { text: 'Ingredient 2' }, parentId: column2Id },
        { id: text3Id, type: 'text', content: { text: 'Ingredient 3' } },
        { id: sidebarId, type: 'sidebar', content: { text: 'Sidebar', blockId: null } },
        { id: imageId, type: 'image', content: { attachmentId: null } },
        { id: ingredientId, type: 'ingredient', content: { quantity: '1 cup', name: 'Ingredient', text: null } },
      ]

      cy.intercept('PATCH', '/api/v1/dynamic_recipes/*').as('update')
      cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
        dynamic_recipe: { name: 'Pasta', ownerId: this.fry.attributes.clientId, blocks },
      }).its('body.data.0').as('dynamicRecipe')
        .then(function () {
          cy.visit(`/dynamic_recipes/${this.dynamicRecipe.attributes.clientId}/edit`)

          assertBlocks([
            { id: h1Id, text: 'Heading 1' },
            { id: h2Id, text: 'Heading 2' },
            { id: h3Id, text: 'Heading 3' },
            { id: rowId, text: 'Ingredient 1Ingredient 2' },
            { id: column1Id, text: 'Ingredient 1' },
            { id: text1Id, text: 'Ingredient 1' },
            { id: column2Id, text: 'Ingredient 2' },
            { id: text2Id, text: 'Ingredient 2' },
            { id: text3Id, text: 'Ingredient 3' },
            { id: sidebarId, text: 'Sidebar' },
            { id: imageId, text: '' },
            { id: ingredientId, text: '1 cupIngredient' },
            { text: '' }, // the "type anything... placeholder block"
          ])

          // delete Ingredient 2 text block
          cy.contains('Ingredient 2').then($el => {
            cy.wrap($el).clear()
            cy.wrap($el).should('exist')
            cy.wrap($el).type('{backspace}')
            cy.wrap($el).should('not.exist')
          })
          cy.contains('Remove Empty Column').click()
          assertBlocks([
            { id: h1Id, text: 'Heading 1' },
            { id: h2Id, text: 'Heading 2' },
            { id: h3Id, text: 'Heading 3' },
            { id: rowId, text: 'Ingredient 1' },
            { id: column1Id, text: 'Ingredient 1' },
            { id: text1Id, text: 'Ingredient 1' },
            { id: text3Id, text: 'Ingredient 3' },
            { id: sidebarId, text: 'Sidebar' },
            { id: imageId, text: '' },
            { id: ingredientId, text: '1 cupIngredient' },
            { text: '' }, // the "type anything... placeholder block"
          ])

          // delete image
          cy.get('[data-test-block="image"]').trigger('mouseenter')
          cy.get('[data-test-block="image"]').contains('delete').click()
          assertBlocks([
            { id: h1Id, text: 'Heading 1' },
            { id: h2Id, text: 'Heading 2' },
            { id: h3Id, text: 'Heading 3' },
            { id: rowId, text: 'Ingredient 1' },
            { id: column1Id, text: 'Ingredient 1' },
            { id: text1Id, text: 'Ingredient 1' },
            { id: text3Id, text: 'Ingredient 3' },
            { id: sidebarId, text: 'Sidebar' },
            { id: ingredientId, text: '1 cupIngredient' },
            { text: '' }, // the "type anything... placeholder block"
          ])

          // delete Ingredient 3 and Sidebar
          cy.contains('Ingredient 3').then($el => {
            cy.wrap($el).clear()
            cy.wrap($el).should('exist')
            cy.wrap($el).type('{del}')
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(60).then(() => {
              cy.contains('Sidebar').type('{del}{del}{del}{del}{del}{del}{del}{backspace}')
            })
            cy.wrap($el).should('not.exist')
          })
          assertBlocks([
            { id: h1Id, text: 'Heading 1' },
            { id: h2Id, text: 'Heading 2' },
            { id: h3Id, text: 'Heading 3' },
            { id: rowId, text: 'Ingredient 1' },
            { id: column1Id, text: 'Ingredient 1' },
            { id: text1Id, text: 'Ingredient 1' },
            { id: ingredientId, text: '1 cupIngredient' },
            { text: '' }, // the "type anything... placeholder block"
          ])

          // delete Heading 2 and 3
          cy.contains('Heading 2').then($el => {
            cy.wrap($el).clear()
            cy.wrap($el).should('exist')
            cy.wrap($el).type('{del}')
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(60).then(() => {
              cy.contains('Heading 3').type('{del}{del}{del}{del}{del}{del}{del}{del}{del}{del}')
            })
            cy.wrap($el).should('not.exist')
          })
          assertBlocks([
            { id: h1Id, text: 'Heading 1' },
            { id: rowId, text: 'Ingredient 1' },
            { id: column1Id, text: 'Ingredient 1' },
            { id: text1Id, text: 'Ingredient 1' },
            { id: ingredientId, text: '1 cupIngredient' },
            { text: '' }, // the "type anything... placeholder block"
          ])

          // delete Ingredient 1
          cy.contains('Ingredient 1').then($el => {
            cy.wrap($el).clear()
            cy.wrap($el).should('exist')
            cy.wrap($el).type('{backspace}')
            cy.wrap($el).should('not.exist')
          })
          cy.contains('Remove Empty Column').click()
          cy.contains('Remove Empty Row').click()
          assertBlocks([
            { id: h1Id, text: 'Heading 1' },
            { id: ingredientId, text: '1 cupIngredient' },
            { text: '' }, // the "type anything... placeholder block"
          ])

          // delete Ingredient
          cy.getContentEditable('1 cup').then($el => {
            cy.wrap($el).clear()
            cy.wrap($el).should('exist')
            cy.wrap($el).type('{downArrow}')
          })
          cy.getContentEditable('Ingredient').then($el => {
            cy.wrap($el).clear()
            cy.wrap($el).should('exist')
            cy.wrap($el).type('{backspace}')
            cy.wrap($el).should('not.exist')
          })
          assertBlocks([
            { id: h1Id, text: 'Heading 1' },
            { text: '' }, // the "type anything... placeholder block"
          ])
        })
      cy.wait('@update') // ensure last autosave is complete before ending test
    })
  })
})

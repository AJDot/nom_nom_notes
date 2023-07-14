import { Block } from '../../../../src/interfaces/blockInterfacesGeneral'
import Guid from '../../../../src/utils/guid'

describe('Delete All Shopping List Items', function() {
  beforeEach(function() {
    cy.createFry().as('fry')
      .then(function() {
        cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
          dynamic_recipe: {
            name: 'Space Soup',
            ownerId: this.fry.attributes.clientId,
            blocks: [
              { id: Guid.create(), type: 'ingredient', content: { quantity: '1', name: 'banana', text: 'softened' } },
              { id: Guid.create(), type: 'ingredient', content: { quantity: '1 cup', name: 'butter', text: 'softened' } },
            ] as Block[],
          },
        })
      }).its('body.data.0').as('dynamicRecipe')
    cy.forceSignIn()
  })

  it('delete all shopping list items', function() {
    cy.intercept('GET', '/api/v1/shopping_lists').as('createList')
    cy.intercept('PATCH', '/api/v1/shopping_lists/*').as('updateList')

    cy.visit(`/dynamic_recipes/${this.dynamicRecipe.attributes.clientId}`)
    cy.contains('Add to Shopping List').click()
    cy.get(`[id='shopping-list-checkbox-${this.dynamicRecipe.attributes.blocks[0].id}']`).click()
    cy.get(`[id='shopping-list-checkbox-${this.dynamicRecipe.attributes.blocks[1].id}']`).click()
    cy.contains('Confirm').click()
    cy.wait(['@createList', '@updateList']) // list is fetched/auto-created then updated
    cy.getFlash('Shopping list updated').should('exist')
    cy.contains('a', 'Shopping List').click()
    cy.contains('1 cup butter softened').should('exist')
    cy.contains('banana softened').should('exist')
    cy.contains('Delete All').should('not.exist')

    cy.contains('a', 'Edit').click()
    cy.contains('1 cup butter softened').should('exist')
    cy.contains('banana softened').should('exist')
    cy.contains('button', 'Delete All').click()
    cy.contains('1 banana softened').should('not.exist')
    cy.contains('1 cup butter softened').should('not.exist')
    cy.contains('There are no items in your shopping list.').should('exist')

    cy.contains('a', 'Back').click()
    cy.contains('There are no items in your shopping list.').should('exist')

    cy.reload()
    cy.contains('There are no items in your shopping list.').should('exist')
  })
})

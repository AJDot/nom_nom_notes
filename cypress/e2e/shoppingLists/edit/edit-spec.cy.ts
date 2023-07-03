import { Block } from '../../../../src/interfaces/blockInterfacesGeneral'
import Guid from '../../../../src/utils/guid'

describe('Edit Shopping List', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
      .then(function() {
        cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
          dynamic_recipes: [
            {
              name: 'Space Soup',
              ownerId: this.fry.attributes.clientId,
              blocks: [
                { id: Guid.create(), type: 'ingredient', content: { quantity: '1', name: 'banana', text: 'softened' } },
                { id: Guid.create(), type: 'ingredient', content: { quantity: '1 cup', name: 'butter', text: 'softened' } },
              ] as Block[],
            },
            {
              name: 'Space Stew',
              ownerId: this.fry.attributes.clientId,
              blocks: [
                { id: Guid.create(), type: 'ingredient', content: { quantity: '2 cups', name: 'butter', text: 'softened' } },
                { id: Guid.create(), type: 'ingredient', content: { quantity: '2', name: 'banana', text: 'softened' } },
              ] as Block[],
            },
          ],
        })
      }).its('body.data').as('dynamicRecipes')
    cy.forceSignIn()
  })

  it('can add ingredients to the shopping list', function() {
    const dynamicRecipeIds = this.dynamicRecipes.map(dr => dr.attributes.clientId)
    cy.intercept('GET', '/api/v1/shopping_lists').as('createList')
    cy.intercept('PATCH', '/api/v1/shopping_lists/*').as('updateList')

    // add 1 cup butter from first recipe
    cy.visit(`/dynamic_recipes/${dynamicRecipeIds[0]}`)
    cy.contains('Add to Shopping List').click()
    cy.get(`[id='shopping-list-checkbox-${this.dynamicRecipes[0].attributes.blocks[1].id}']`).click()
    cy.contains('Confirm').click()
    cy.wait(['@createList', '@updateList']) // list is fetched/auto-created then updated
    cy.getFlash('Shopping list updated').should('exist')
    cy.contains('a', 'Shopping List').click()
    cy.url().should('contain', '/shopping_list')
    cy.contains('h1', 'Shopping').should('exist')
    cy.contains('1 cup butter softened').should('exist')
    cy.contains('2 cup butter softened').should('not.exist')
    cy.contains('button', 'Condense').should('exist')
    cy.contains('a', 'Edit').should('exist')

    // add 2 cup butter from 2nd recipe
    cy.visit(`/dynamic_recipes/${dynamicRecipeIds[1]}`)
    cy.contains('Add to Shopping List').click()
    cy.get(`[id='shopping-list-checkbox-${this.dynamicRecipes[1].attributes.blocks[0].id}']`).click()
    cy.contains('Confirm').click()
    cy.getFlash('Shopping list updated').should('exist')
    cy.contains('a', 'Shopping List').click()
    cy.url().should('contain', '/shopping_list')
    cy.contains('h1', 'Shopping').should('exist')
    cy.contains('1 cup butter softened').should('exist')
    cy.contains('2 cups butter softened').should('exist')
    cy.contains('button', 'Condense').should('exist')
    cy.contains('a', 'Edit').should('exist')

    cy.reload()
      .then(() => {
        cy.contains('1 cup butter softened').should('exist')
        cy.contains('2 cups butter softened').should('exist')
      })
  })
})

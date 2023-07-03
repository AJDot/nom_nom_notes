import ShoppingList from '../../../../src/models/shoppingList'
import Guid from '../../../../src/utils/guid'

describe('Delete Shopping List Items', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
    cy.forceSignIn()
  })

  it('delete individual shopping list items', function() {
    cy.intercept('PATCH', '/api/v1/shopping_lists/*').as('updateShoppingList')

    cy.apiRequest('POST', '/testing/api/v1/shopping_lists', {
      shopping_list: {
        ownerId: this.fry.attributes.clientId,
        items: [
          { id: Guid.create(), quantity: '1', name: 'banana', description: 'softened' },
          { id: Guid.create(), quantity: '1 cup', name: 'butter', description: 'softened' },
          { id: Guid.create(), quantity: '2 cups', name: 'butter', description: 'softened' },
          { id: Guid.create(), quantity: '2 cup', name: 'coconut', description: 'softened' },
        ],
      } as ShoppingList,
    }).its('body.data.0').as('shoppingList')
      .then(function() {
        cy.visit('/shopping_lists')
        cy.contains('a', 'Edit').click()
        cy.get('[data-test^=shopping-list-item-delete').should('have.length', 4)
        cy.getTest(`shopping-list-item-delete-${this.shoppingList.attributes.items[2].id}`).click()
        cy.wait('@updateShoppingList')
        cy.get('[data-test^=shopping-list-item-delete').should('have.length', 3)
        cy.contains('1 banana softened').should('exist')
        cy.contains('1 cup butter softened').should('exist')
        cy.contains('2 cups butter softened').should('not.exist')
        cy.contains('2 cup coconut softened').should('exist')

        cy.contains('a', 'Back').click()
        cy.get('[data-test^=shopping-list-item-delete').should('not.exist')
        cy.contains('1 banana softened').should('exist')
        cy.contains('1 cup butter softened').should('exist')
        cy.contains('2 cups butter softened').should('not.exist')
        cy.contains('2 cup coconut softened').should('exist')

        cy.reload()
        cy.get('[data-test^=shopping-list-item-delete').should('not.exist')
        cy.contains('1 banana softened').should('exist')
        cy.contains('1 cup butter softened').should('exist')
        cy.contains('2 cups butter softened').should('not.exist')
        cy.contains('2 cup coconut softened').should('exist')
      })
  })

  it('delete multiple shopping list items', function() {
    cy.intercept('PATCH', '/api/v1/shopping_lists/*').as('updateShoppingList')

    cy.apiRequest('POST', '/testing/api/v1/shopping_lists', {
      shopping_list: {
        ownerId: this.fry.attributes.clientId,
        items: [
          { id: Guid.create(), quantity: '1', name: 'banana', description: 'softened' },
          { id: Guid.create(), quantity: '1 cup', name: 'butter', description: 'softened' },
          { id: Guid.create(), quantity: '2 cups', name: 'butter', description: 'softened' },
          { id: Guid.create(), quantity: '2 cup', name: 'coconut', description: 'softened' },
        ],
      } as ShoppingList,
    }).its('body.data.0').as('shoppingList')
      .then(function() {
        cy.visit('/shopping_lists')
        cy.contains('a', 'Edit').click()
        cy.get('[data-test^=shopping-list-item-checkbox').should('have.length', 4)
        cy.getTest(`shopping-list-item-checkbox-${this.shoppingList.attributes.items[0].id}`).click()
        cy.contains('button', 'Delete (1)').should('exist')
        cy.getTest(`shopping-list-item-checkbox-${this.shoppingList.attributes.items[2].id}`).click()
        cy.contains('button', 'Delete (2)').should('exist').click()

        cy.wait('@updateShoppingList')
        cy.get('[data-test^=shopping-list-item-checkbox').should('have.length', 2)
        cy.contains('1 banana softened').should('not.exist')
        cy.contains('1 cup butter softened').should('exist')
        cy.contains('2 cups butter softened').should('not.exist')
        cy.contains('2 cup coconut softened').should('exist')
        cy.contains('a', 'Back').click()

        cy.get('[data-test^=shopping-list-item-checkbox').should('not.exist')
        cy.contains('1 banana softened').should('not.exist')
        cy.contains('1 cup butter softened').should('exist')
        cy.contains('2 cups butter softened').should('not.exist')
        cy.contains('2 cup coconut softened').should('exist')

        cy.reload()
        cy.contains('1 banana softened').should('not.exist')
        cy.contains('1 cup butter softened').should('exist')
        cy.contains('2 cups butter softened').should('not.exist')
        cy.contains('2 cup coconut softened').should('exist')
      })
  })
})

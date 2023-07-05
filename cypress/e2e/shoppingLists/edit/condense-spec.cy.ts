import ShoppingList from '../../../../src/models/shoppingList'
import Guid from '../../../../src/utils/guid'

describe('Condense Shopping List', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
    cy.forceSignIn()
  })

  it('can combine items with same name and unit type', function() {
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
    })

    // add butter and banana from 1st recipe
    cy.visit('/shopping_lists')
    cy.url().should('contain', '/shopping_list')
    cy.contains('1 banana softened').should('exist')
    cy.contains('1 cup butter softened').should('exist')
    cy.contains('2 cups butter softened').should('exist')
    cy.contains('2 cup coconut softened').should('exist')

    // butters are combined
    // but all "descriptions" are removed upon condensation
    cy.contains('button', 'Condense').click()
    cy.contains('1 banana softened').should('not.exist')
    cy.contains('1 cup butter softened').should('not.exist')
    cy.contains('2 cups butter softened').should('not.exist')
    cy.contains('2 cup coconut softened').should('not.exist')
    cy.contains('3 cup butter softened').should('not.exist')
    cy.contains('1 banana').should('exist')
    cy.contains('3 cups butter').should('exist')
    cy.contains('2 cup coconut').should('exist')
  })

  it('can combines a single item into a "nice" fraction', function() {
    cy.apiRequest('POST', '/testing/api/v1/shopping_lists', {
      shopping_list: {
        ownerId: this.fry.attributes.clientId,
        items: [
          { id: Guid.create(), quantity: '0.37 cup', name: 'banana' },
        ],
      } as ShoppingList,
    })
    cy.visit('/shopping_lists')
    cy.contains('button', 'Condense').click()
    // 1/3 is the "nicest" fraction next to 0.37
    cy.contains('1/3 cup banana').should('exist')
    cy.contains('button', 'Expand').click()
    cy.contains('0.37 cup banana').should('exist')
  })

  it('can combine items into a "nice" fraction', function() {
    cy.apiRequest('POST', '/testing/api/v1/shopping_lists', {
      shopping_list: {
        ownerId: this.fry.attributes.clientId,
        items: [
          { id: Guid.create(), quantity: '0.37 cup', name: 'banana' },
          { id: Guid.create(), quantity: '2/3 cup', name: 'banana' },
          { id: Guid.create(), quantity: '1.5 cups', name: 'banana' },
        ],
      } as ShoppingList,
    })
    cy.visit('/shopping_lists')
    cy.contains('button', 'Condense').click()
    cy.contains('2 1/2 cups banana').should('exist')
    cy.contains('button', 'Expand').click()
    cy.contains('0.37 cup banana').should('exist')
    cy.contains('2/3 cup banana').should('exist')
    cy.contains('1.5 cups banana').should('exist')
  })

  it('can combine different units that have same base unit', function() {
    cy.apiRequest('POST', '/testing/api/v1/shopping_lists', {
      shopping_list: {
        ownerId: this.fry.attributes.clientId,
        items: [
          { id: Guid.create(), quantity: '1/3 cup', name: 'red onion' },
          { id: Guid.create(), quantity: '2.25 tsp', name: 'banana' },
          { id: Guid.create(), quantity: '2.75 tbsp', name: 'banana' },
          { id: Guid.create(), quantity: '2/3 cup', name: 'banana' },
          { id: Guid.create(), quantity: '1/3 cup', name: 'red onion' },
          { id: Guid.create(), quantity: '1 TBSP', name: 'butter' },
        ],
      } as ShoppingList,
    })
    cy.visit('/shopping_lists')
    cy.contains('button', 'Condense').click()
    cy.contains('2/3 cup red onion').should('exist')
    cy.contains('7/8 cup banana').should('exist')
    cy.contains('button', 'Expand').click()
    cy.contains('1/3 cup red onion').should('exist')
    cy.contains('2.25 tsp banana').should('exist')
    cy.contains('2.75 tbsp banana').should('exist')
    cy.contains('2/3 cup banana').should('exist')
  })

  it('combines using the largest unit', function() {
    // here cups are used instead of TBSP
    cy.apiRequest('POST', '/testing/api/v1/shopping_lists', {
      shopping_list: {
        ownerId: this.fry.attributes.clientId,
        items: [
          { id: Guid.create(), quantity: '1/3 cup', name: 'red onion' },
          { id: Guid.create(), quantity: '1/3 TBSP', name: 'banana' },
          { id: Guid.create(), quantity: '1 TBSP', name: 'red onion' },
          { id: Guid.create(), quantity: '1 cup', name: 'banana' },
        ],
      } as ShoppingList,
    })
    cy.visit('/shopping_lists')
    cy.contains('button', 'Condense').click()
    cy.contains('2/5 cup red onion').should('exist')
    cy.contains('1 cup banana').should('exist')
    cy.contains('button', 'Expand').click()
    cy.contains('1/3 cup red onion').should('exist')
    cy.contains('1/3 TBSP banana').should('exist')
    cy.contains('1 TBSP red onion').should('exist')
    cy.contains('1 cup banana').should('exist')
  })

  it('can combine mixed numbers', function() {
    cy.apiRequest('POST', '/testing/api/v1/shopping_lists', {
      shopping_list: {
        ownerId: this.fry.attributes.clientId,
        items: [
          { id: Guid.create(), quantity: '1 1/2 tsp', name: 'red onion' },
          { id: Guid.create(), quantity: '1/3 TBSP', name: 'red onion' },
          { id: Guid.create(), quantity: '1 TBSP', name: 'red onion' },
          { id: Guid.create(), quantity: '3.33 teaspoons', name: 'red onion' },
        ],
      } as ShoppingList,
    })
    cy.visit('/shopping_lists')
    cy.contains('button', 'Condense').click()
    cy.contains('3 tbsp red onion').should('exist')
    cy.contains('button', 'Expand').click()
    cy.contains('1 1/2 tsp red onion').should('exist')
    cy.contains('1/3 TBSP red onion').should('exist')
    cy.contains('1 TBSP red onion').should('exist')
    cy.contains('3.33 teaspoons red onion').should('exist')
  })
})

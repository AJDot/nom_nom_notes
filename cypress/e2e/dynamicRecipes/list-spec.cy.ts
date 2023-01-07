import Guid from '../../../src/utils/guid'

describe('Dynamic Recipes List', () => {
  context('Not logged in', () => {
    it('makes dynamic recipes collection request successfully', () => {
      cy.intercept('GET', '/api/v1/dynamic_recipes').as('getDynamicRecipes')
      cy.visit('/dynamic_recipes')
      cy.url().should('includes', '/dynamic_recipes')
      cy.get('header').should('contain', 'New Dynamic Recipe')

      cy.wait('@getDynamicRecipes').its('response.statusCode').should('be.oneOf', [200, 304])
    })

    it('shows dynamic recipe title', () => {
      // listed in alphabetical order
      // is link to view

      const pastaId = Guid.create()
      cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
        dynamic_recipe: { clientId: pastaId, name: 'Pasta' },
        dynamic_recipes: [
          { name: 'Noodle' },
          { name: 'Penne' }
        ]
      }).its('body').as('dynamicRecipes')
        .then(function () {
          cy.visit('/dynamic_recipes')
          // dynamic recipes are in alphabetical order by name
          cy.getDynamicRecipeCard(0).should('contain', 'Noodle')
          cy.getDynamicRecipeCard(1).should('contain', 'Pasta')
          cy.getDynamicRecipeCard(2).should('contain', 'Penne')
        })
    })
  })
})
describe('Recipes List', () => {
  context('Not logged in', () => {
    it('makes recipes collection request successfully', () => {
      cy.intercept('GET', '/api/v1/recipes').as('getRecipes')
      cy.visit('/')
      cy.url().should('include', '/recipes')
      cy.get('header').should('contain', 'New Recipe')

      cy.wait('@getRecipes').its('response.statusCode').should('be.oneOf', [200, 304])
    })

    it('shows recipe details', () => {
      cy.apiRequest('POST', '/testing/api/v1/recipes', {
        recipe: {
          name: 'Pasta',
        },
        recipes: [
          {
            name: 'Noodle',
          },
          {
            name: 'Penne',
          },
        ],
      }).its('body').as('currentRecipe')
        .then(function() {
          cy.visit('/')
          // recipes are in alphabetical order by name
          cy.get('.card-list > li:nth-child(1)').should('contain', 'Noodle')
          cy.get('.card-list > li:nth-child(2)').should('contain', 'Pasta')
          cy.get('.card-list > li:nth-child(3)').should('contain', 'Penne')
        })
    })
  })
})

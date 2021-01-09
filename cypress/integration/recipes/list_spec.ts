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
      cy.request('POST', Cypress.env('api_url') + '/testing/api/v1/recipes').its('body').as('currentRecipe')
        .then(function() {
          console.log(this.currentRecipe)
        })
      cy.visit('/')
      cy.get('header').should('contain', 'New Recipe')
    })
  })
})

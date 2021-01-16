describe('Create Recipe', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
  })

  context('Not logged in', () => {
    it('redirects to sign in first', function() {
      cy.visit('/')
      cy.contains('New Recipe').click()
      cy.url().should('contain', '/sign_in')
      cy.contains('Email').type(this.fry.attributes.email)
      cy.contains('Password').type('ah123456')
      cy.contains('input', 'Sign In').click()
      cy.url().should('contain', '/recipes/new')
      cy.contains('Create Recipe').should('exist')
    })
  })

  context('Logged in', () => {
    beforeEach(() => {
      cy.forceSignIn()
    })

    it.only('allows creating a recipe with minimal data', function() {
      cy.intercept('POST', '/api/v1/recipes').as('createRecipe')

      cy.apiRequest('POST', '/testing/api/v1/categories', {
        categories: [
          { name: 'Italian' },
          { name: 'American' },
          { name: 'Chinese' },
        ],
      }).its('body').as('categories')
      cy.visit('/recipes/new')

      cy.contains('label', 'Name').type('Space Soup')
      cy.contains('input', 'Create').click()

      cy.wait('@createRecipe')
        .then((data) => {
          cy.wrap(data).its('response.statusCode').should('eq', 201)
          cy.wrap(data).its('response.body.data').as('thing')
            .then(function(recipe) {
              cy.url().should('contain', `/recipes/${recipe.attributes.clientId}`)
            })
        })
      cy.getFlash('Space Soup was created successfully').should('exist')
    })
})

describe('Create Dynamic Recipe', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
  })

  context('Not logged in', () => {
    it('redirects to sign in first', function () {
      cy.visit('/dynamic_recipes')
      cy.contains('New Dynamic Recipe').click()
      cy.url().should('contain', '/sign_in')
      cy.contains('Email').type(this.fry.attributes.email)
      cy.contains('Password').type('ah123456')
      cy.contains('input', 'Sign In').click()
      cy.url().should('contain', '/dynamic_recipes/new')
      cy.contains('label', 'Name').should('exist')
    })
  })

  context('Logged in', () => {
    beforeEach(() => {
      cy.forceSignIn()
    })

    it('allows creating a dynamic recipe with minimal data', function () {
      cy.intercept('POST', '/api/v1/dynamic_recipes').as('createDynamicRecipe')
      cy.visit('/dynamic_recipes/new')

      cy.contains('label', 'Name').type('Space Soup')

      cy.wait('@createDynamicRecipe')
        .then((data) => {
          cy.wrap(data).its('response.statusCode').should('eq', 201)
          cy.wrap(data).its('response.body.data').as('dynamicRecipe')
            .then(function (dynamicRecipe) {
              cy.url().should('contain', `/dynamic_recipes/${dynamicRecipe.attributes.clientId}/edit`)
            })
        })
      cy.reload()
        .then(() => {
          cy.url().should('contain', `/dynamic_recipes/${this.dynamicRecipe.attributes.clientId}/edit`)
        })
    })
  })
})

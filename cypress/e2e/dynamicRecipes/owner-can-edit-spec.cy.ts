describe('Owner Can Edit Dynamic Recipe', () => {
  beforeEach(() => {
    cy.createUser({ email: 'philip.fry@planet-express.com', password: 'ah123456', username: 'orangejoe' })
    cy.createUser({ email: 'turanga.leela@planet-express.com', password: 'ah123456', username: 'purplejoe' })
    cy.forceSignIn({ email: 'philip.fry@planet-express.com', password: 'ah123456' })
  })

  it('only allows recipe owner to edit the recipe', function () {
    cy.intercept('POST', '/api/v1/dynamic_recipes').as('createDynamicRecipe')

    cy.visit('/dynamic_recipes/new')
    cy.getByLabel('Name').type('Fried Eggs')
    cy.wait('@createDynamicRecipe')
      .then(() => {
        cy.intercept('PATCH', '/api/v1/dynamic_recipes/*').as('updateDynamicRecipe')
        cy.getContentEditable("Type anything...").type('PASTA/h1{enter}')
      })
    cy.wait('@updateDynamicRecipe')
      .then(function () {
        cy.contains('Back').click()
        cy.contains('a', 'Edit').should('exist')
        cy.apiRequest('GET', '/testing/api/v1/dynamic_recipes').its('body.data.0').as('dynamicRecipe')
          .then(function () {
            cy.url().should('match', new RegExp(`dynamic_recipes/${this.dynamicRecipe.attributes.clientId}$`))
            cy.forceSignIn({ email: 'turanga.leela@planet-express.com', password: 'ah123456' })
            cy.reload()
            cy.contains('a', 'List').should('exist')
            cy.contains('a', 'Edit').should('not.exist')
            cy.visit(`/dynamic_recipes/${this.dynamicRecipe.attributes.clientId}/edit`)
            cy.url().should('match', new RegExp(`dynamic_recipes/${this.dynamicRecipe.attributes.clientId}$`))
            cy.getFlash('Unable to edit dynamic recipe. Action is forbidden.')
          })
      })
  })
})
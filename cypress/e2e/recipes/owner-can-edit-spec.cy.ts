import { RegexUtils } from './../../../src/utils/regexUtils'
describe('Owner Can Edit Recipe', () => {
  beforeEach(() => {
    cy.createUser({ email: 'philip.fry@planet-express.com', password: 'ah123456', username: 'orangejoe' })
    cy.createUser({ email: 'turanga.leela@planet-express.com', password: 'ah123456', username: 'purplejoe' })
    cy.forceSignIn({ email: 'philip.fry@planet-express.com', password: 'ah123456' })
  })

  it('only allows recipe owner to edit the recipe', function () {
    cy.visit('/recipes/new')
    cy.getByLabel('Name').type('Fried Eggs')
    cy.contains('input', 'Create').click()
    cy.contains('Fried Eggs was created successfully').should('exist')
    cy.apiRequest('GET', '/testing/api/v1/recipes').its('body.data.0').as('recipe')
      .then(function () {
        cy.url().should('match', new RegExp(`recipes/${this.recipe.attributes.clientId}$`))
        cy.contains('a', 'Edit Recipe').should('exist')

        cy.forceSignIn({ email: 'turanga.leela@planet-express.com', password: 'ah123456' })
        cy.reload()
        cy.contains('a', 'Edit Recipe').should('not.exist')
        cy.apiRequest('GET', '/testing/api/v1/recipes').its('body.data.0').as('recipe')
        cy.visit(`/recipes/${this.recipe.attributes.clientId}/edit`)
        cy.url().should('match', new RegExp(`recipes/${this.recipe.attributes.clientId}$`))
        cy.getFlash('Unable to edit recipe. Action is forbidden.')
      })
  })
})

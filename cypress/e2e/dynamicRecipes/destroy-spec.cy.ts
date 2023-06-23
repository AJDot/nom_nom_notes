describe('Delete Dynamic Recipe Block', function () {
  beforeEach(function () {
    cy.createFry().as('fry')
      .then(function () {
        cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
          dynamic_recipe: {
            name: 'Space Soup',
            ownerId: this.fry.attributes.clientId,
          },
        }).its('body.data.0').as('dynamicRecipe')
      })
    cy.forceSignIn()
  })

  it('allows me to destroy a dynamic recipe', function () {
    // catch recipe not found error when going to edit page after destruction
    cy.on('uncaught:exception', (err, _runnable) => {
      expect(err.message).to.include('Dynamic Recipe not found')

      // return false to prevent the error from
      // failing this test
      return false
    })

    const dynamicRecipeId = this.dynamicRecipe.attributes.clientId
    cy.visit(`/dynamic_recipes/${dynamicRecipeId}/edit`)
    cy.contains('Delete').click()
    cy.getModal().should('exist')
      .within(function () {
        cy.contains('Delete Dynamic Recipe').should('exist')
        // can cancel destroying
        cy.contains('Cancel').should('exist').click()
        cy.url().should('contain', `/dynamic_recipes/${dynamicRecipeId}/edit`)
      })

    cy.contains('Delete').click()
    cy.getModal().should('exist')
      .within(function () {
        cy.contains('Delete Dynamic Recipe').click()
      })
    cy.assertUrl('/dynamic_recipes')
    cy.getFlash('Space Soup was deleted successfully').should('exist')
    cy.visit(`/dynamic_recipes/${dynamicRecipeId}/edit`)
    cy.assertUrl('/dynamic_recipes')
    cy.getFlash('Dynamic Recipe not found').should('exist')
  })
})

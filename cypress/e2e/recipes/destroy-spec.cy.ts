describe('Destroy recipe', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
      .then(function () {
        cy.apiRequest('POST', '/testing/api/v1/recipes', {
          recipe: {
            name: 'Space Soup',
            ownerId: this.fry.attributes.clientId,
          },
        }).its('body.data.0').as('recipe')

      })
    cy.forceSignIn()
  })

  it('allows destroying a recipe', function () {
    // catch recipe not found error when going to edit page after destruction
    cy.on('uncaught:exception', (err, runnable) => {
      expect(err.message).to.include('Recipe not found')

      // return false to prevent the error from
      // failing this test
      return false
    })


    const recipeId = this.recipe.attributes.clientId
    cy.visit(`/recipes/${recipeId}/edit`)
    cy.contains('Delete Recipe').click()
    cy.getModal().should('exist')
      .within(() => {
        cy.contains('Delete Recipe').should('exist')
        // can cancel destroying
        cy.contains('Cancel').should('exist').click()
        cy.url().should('contain', `/recipes/${recipeId}/edit`)
      })

    cy.contains('Delete Recipe').click()
    cy.getModal().should('exist')
      .within(() => {
        cy.contains('Delete Recipe').click()
      })
    cy.assertUrl('/recipes')
    cy.getFlash('Space Soup was deleted successfully').should('exist')
    cy.visit(`/recipes/${recipeId}/edit`)
    cy.assertUrl('/recipes')
    cy.getFlash('The specified recipe was not found.').should('exist')
  })
})

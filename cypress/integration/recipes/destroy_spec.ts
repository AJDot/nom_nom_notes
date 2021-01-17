describe('Destroy recipe', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
    cy.apiRequest('POST', '/testing/api/v1/recipes', {
      recipe: {
        name: 'Space Soup',
      },
    }).its('body.data.0').as('recipe')
    cy.forceSignIn()
  })

  it('allows destroying a recipe', function() {
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
    cy.getFlash('Recipe not found').should('exist')
  })
})

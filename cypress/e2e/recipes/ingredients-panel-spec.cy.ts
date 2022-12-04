describe('Ingredients Panel', () => {
  it('opens/closes when the ingredients bar is clicked, "x" is clicked, or outside of panel is clicked', () => {
    cy.viewport(420, 600)
    cy.apiRequest('POST', '/testing/api/v1/recipes', {
      recipe: {
        name: 'Space Soup',
        stepsAttributes: [
          { description: 'Grab a chicken.' },
          { description: 'Put all ingredients on it.' },
        ],
        ingredientsAttributes: [
          { description: '1 cup applesauce' },
          { description: '2 tsp banana pudding' },
        ],
      },
    }).its('body.data.0').as('recipe')
      .then(function() {
        const recipeId = this.recipe.attributes.clientId
        cy.visit(`/recipes/${recipeId}`)
        cy.getTest('side-panel').should('not.exist')
        cy.getTest('ingredients-panel-toggle').click()
        cy.getTest('side-panel')
          .should('exist')
          .and('include.text', '1 cup applesauce')
          .and('include.text', '2 tsp banana pudding')
        cy.getTest('side-panel').find('h1').should('have.text', 'Ingredients')
        // "X" button closes the side panel
        cy.getTest('side-panel').findTest('close').click()
        cy.getTest('side-panel').should('not.exist')
        // clicking mask closes the side panel
        cy.getTest('ingredients-panel-toggle').click()
        cy.getTest('side-panel').should('exist')
        cy.getTest('side-panel-mask').click()
        cy.getTest('side-panel').should('not.exist')
      })
  })
})

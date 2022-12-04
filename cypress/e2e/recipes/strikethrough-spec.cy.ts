describe('Strike through recipe ingredients and steps', () => {
  beforeEach(() => {
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
  })

  it('allows user to cross off ingredients and steps', function() {
    cy.visit(`/recipes/${this.recipe.attributes.clientId}`)

    function testStrikeThrough(text: string) {
      cy.contains(text)
        .click().should('have.css', 'text-decoration-line', 'line-through')
        .click().should('have.css', 'text-decoration-line', 'none')
    }

    [
      '1 cup applesauce',
      'Put all ingredients on it.',
      'Grab a chicken.',
      '2 tsp banana pudding',
    ].forEach(testStrikeThrough)
  })

  it('ingredients strike through is synced between main recipe ingredients and those shown in side panel', function() {
    cy.visit(`/recipes/${this.recipe.attributes.clientId}`)
    cy.getTest('side-panel').should('not.exist')
    cy.contains('1 cup applesauce')
      .should('have.css', 'text-decoration-line', 'none')
      .click()
      .should('have.css', 'text-decoration-line', 'line-through')

    // open ingredients side panel
    cy.getTest('ingredients-panel-toggle').click()
    // line-through is present on ingredient in panel
    cy.getTest('side-panel').contains('1 cup applesauce')
      .should('have.css', 'text-decoration-line', 'line-through')
      .click()
      .should('have.css', 'text-decoration-line', 'none')
    // close ingredients side panel
    cy.getTest('side-panel').findTest('close').click()
    // line-through was removed on ingredient in main recipe
    cy.contains('1 cup applesauce')
      .should('have.css', 'text-decoration-line', 'none')
  })
})
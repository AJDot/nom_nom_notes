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
})
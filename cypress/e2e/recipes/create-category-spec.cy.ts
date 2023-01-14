describe('Create Categories', function () {
  beforeEach(function () {
    cy.viewport(420, 600)
    cy.createFry().as('fry')
      .then(function () {
        cy.forceSignIn()
        cy.apiRequest('POST', '/testing/api/v1/categories', {
          categories: [{ name: 'Italian' }, { name: 'American' }],
        }).its('body.data').as('categories')
          .then(function (categories) {
            cy.apiRequest('POST', '/testing/api/v1/recipes', {
              recipe: {
                name: 'Space Soup',
                ownerId: this.fry.attributes.clientId,
                recipeCategoriesAttributes: [
                  { category_id: categories.find(x => x.attributes.name === 'Italian').attributes.clientId },
                ],
              },
            })
          }).its('body.data.0').as('recipe')
      })
  })

  it('allows creating categories on the fly', function () {
    const recipeId = this.recipe.attributes.clientId
    cy.intercept('PATCH', `/api/v1/recipes/${recipeId}`).as('updateRecipe')
    cy.visit(`/recipes/${recipeId}/edit`)
    // Add existing category
    cy.getByLabel('Categories').type('Ame')
    cy.contains('American').should('exist')
    cy.getByLabel('Categories').type('{enter}')

    // Add new category
    cy.getByLabel('Categories').clear().type('Chinese')
    cy.getDropdownItem('+ Create category Chinese').click()

    // Can't add category if already exists
    cy.getByLabel('Categories').clear().type('Chinese')
    cy.getTest('dropdown-item')
      .should('have.length', 1)
      .trim()
      .should('equal', 'No results found.')

    cy.contains('input', 'Update Recipe').click()

    const checkData = function () {
      cy.contains('Italian').should('exist')
      cy.contains('American').should('exist')
      cy.contains('Chinese').should('exist')
    }

    cy.wait('@updateRecipe')
      .then((data) => {
        cy.wrap(data).its('response.statusCode').should('eq', 200)
          .then(function () {
            // on show page
            cy.url()
              .should('contain', `/recipes/${recipeId}`)
              .and('not.contain', 'edit')

            checkData()
            // check data has truly persisted
            cy.reload().then(checkData)
          })
      })
  })
})

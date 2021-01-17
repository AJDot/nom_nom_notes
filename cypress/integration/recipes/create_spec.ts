describe('Create Recipe', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
  })

  context('Not logged in', () => {
    it('redirects to sign in first', function() {
      cy.visit('/')
      cy.contains('New Recipe').click()
      cy.url().should('contain', '/sign_in')
      cy.contains('Email').type(this.fry.attributes.email)
      cy.contains('Password').type('ah123456')
      cy.contains('input', 'Sign In').click()
      cy.url().should('contain', '/recipes/new')
      cy.contains('Create Recipe').should('exist')
    })
  })

  context('Logged in', () => {
    beforeEach(() => {
      cy.forceSignIn()
    })

    it('allows creating a recipe with minimal data', function() {
      cy.intercept('POST', '/api/v1/recipes').as('createRecipe')
      cy.visit('/recipes/new')

      cy.contains('label', 'Name').type('Space Soup')
      cy.contains('input', 'Create').click()

      cy.wait('@createRecipe')
        .then((data) => {
          cy.wrap(data).its('response.statusCode').should('eq', 201)
          cy.wrap(data).its('response.body.data').as('thing')
            .then(function(recipe) {
              cy.url().should('contain', `/recipes/${recipe.attributes.clientId}`)
            })
        })
      cy.getFlash('Space Soup was created successfully').should('exist')
    })

    it('validates recipe data', () => {
      cy.intercept('POST', '/api/v1/recipes').as('createRecipe')
      cy.visit('/recipes/new')
      cy.contains('input', 'Create').click()
      cy.wait('@createRecipe')
        .then(data => {
          cy.wrap(data).its('response.statusCode').should('eq', 422)
          // Name must be between 1 and 100 characters
          cy.getFlash('Name must be between 1 and 100 characters').should('exist')
        })

      cy.contains('label', 'Name').type('Space Soup')
      cy.contains('input', 'Create').click()
      cy.wait('@createRecipe')
        .then((data) => {
          cy.wrap(data).its('response.statusCode').should('eq', 201)
          cy.wrap(data).its('response.body.data').as('thing')
            .then(function(recipe) {
              cy.url().should('contain', `/recipes/${recipe.attributes.clientId}`)
            })
        })
    })

    it.only('allows recipe creation with all data', () => {
      cy.apiRequest('POST', '/testing/api/v1/categories', {
        categories: [
          { name: 'Italian' },
          { name: 'American' },
          { name: 'Chinese' },
        ],
      }).its('body').as('categories')

      cy.intercept('POST', '/api/v1/recipes').as('createRecipe')
      cy.visit('/recipes/new')

      cy.contains('label', 'Name').type('Space Soup')
      cy.contains('label', 'Description').type('Some alien gunk in a pot.')

      // Create ingredients
      cy.contains('Add Ingredient').click()
      cy.getTest('ingredient-0').find('input').type('1 cup applesauce')
      cy.contains('Add Ingredient').click()
      cy.getTest('ingredient-1').find('input').type('2 tsp banana pudding')

      // Add categories
      cy.contains('label', 'Categories').type('It')
      cy.getDropdownItem('Italian').click()
      cy.getByLabel('Categories').clear().type('Ch')
      cy.getDropdownItem('Chinese').click()

      // Create steps
      cy.contains('Add Step').click()
      cy.getTest('step-0').find('textarea').type('Grab a chicken.')
      cy.contains('Add Step').click()
      cy.getTest('step-1').find('textarea').type('Put all ingredients on it.')

      // Add Note
      cy.contains('label', 'Notes').type('Or ignore everything I said.')

      cy.contains('input', 'Create').click()

      const checkData = () => {
        [
          'Space Soup',
          'Some alien gunk in a pot.',
          '1 cup applesauce',
          '2 tsp banana pudding',
          'Italian',
          'Chinese',
          'Grab a chicken.',
          'Put all ingredients on it.',
          'Or ignore everything I said.',
        ].forEach(text => {
          cy.contains(text).should('exist')
        })
      }

      cy.wait('@createRecipe')
        .then((data) => {
          cy.wrap(data).its('response.statusCode').should('eq', 201)
          cy.wrap(data).its('response.body.data').as('thing')
            .then(function(recipe) {
              cy.url().should('contain', `/recipes/${recipe.attributes.clientId}`)
              checkData()
            })
        })
      cy.reload().then(() => checkData())
    })
  })
})

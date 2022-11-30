import { AssertInputOptionTypes, AssertTextOptionTypes } from '../../support/test_typings'

describe('Edit Recipe', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
    cy.apiRequest('POST', '/testing/api/v1/categories', {
      categories: [
        { name: 'Italian' },
        { name: 'American' },
        { name: 'Chinese' },
      ],
    }).its('body.data').as('categories')
      .then(categories => {
        cy.apiRequest('POST', '/testing/api/v1/recipes', {
          recipe: {
            name: 'Space Soup',
            description: 'Some alien gunk in a pot.',
            cook_time: (60 * 60) + 2 * (60), // 1 hours and 2 minutes
            recipeCategoriesAttributes: [
              { category_id: categories.find(x => x.attributes.name === 'Italian').attributes.clientId },
              { category_id: categories.find(x => x.attributes.name === 'Chinese').attributes.clientId },
            ],
            stepsAttributes: [
              { description: 'Grab a chicken.' },
              { description: 'Put all ingredients on it.' },
            ],
            ingredientsAttributes: [
              { description: '1 cup applesauce' },
              { description: '2 tsp banana pudding' },
            ],
            note: 'Or ignore everything I said.',
          },
        })
      }).its('body.data.0').as('recipe')
  })

  context('Not logged in', function() {
    it('redirects to sign in first', function() {
      cy.visit(`/recipes/${this.recipe.attributes.clientId}/edit`)
      cy.url().should('contain', '/sign_in')
      cy.contains('Email').type(this.fry.attributes.email)
      cy.contains('Password').type('ah123456')
      cy.contains('input', 'Sign In').click()
      cy.url().should('contain', `/recipes/${this.recipe.attributes.clientId}/edit`)
      cy.contains('Space Soup').should('exist')
      cy.contains('input', 'Update Recipe').should('exist')

      const checkInputs = () => {
        const options: AssertInputOptionTypes[] = [
          {
            by: 'locator',
            method: 'getTest',
            locator: 'ingredient-0',
            value: '1 cup applesauce',
            tag: 'input',
          },
          {
            by: 'locator',
            method: 'getTest',
            locator: 'ingredient-1',
            value: '2 tsp banana pudding',
            tag: 'input',
          },
          {
            by: 'locator',
            method: 'getTest',
            locator: 'step-0',
            value: 'Grab a chicken.',
            tag: 'textarea',
          },
          {
            by: 'locator',
            method: 'getTest',
            locator: 'step-1',
            value: 'Put all ingredients on it.',
            tag: 'textarea',
          },
          {
            by: 'label',
            label: 'Description',
            value: 'Some alien gunk in a pot.',
          },
          {
            by: 'label',
            label: 'Hours',
            value: '1',
          },
          {
            by: 'label',
            label: 'Minutes',
            value: '2',
          },
          {
            by: 'label',
            label: 'Note',
            value: 'Or ignore everything I said.',
          },
        ]
        options.forEach(options => {
          cy.assertInput(options)
        })
      }

      const checkText = () => {
        const options: AssertTextOptionTypes[] = [
          {
            by: 'text',
            value: 'Space Soup',
          },
          {
            by: 'text',
            value: 'Italian',
          },
          {
            by: 'text',
            value: 'Chinese',
          },
        ]
        options.forEach(options => {
          cy.assertText(options)
        })
      }
      checkText()
      checkInputs()
    })
  })

  context('Logged in', () => {
    beforeEach(() => {
      cy.forceSignIn()
    })

    it('validates recipe data', function() {
      const recipeId = this.recipe.attributes.clientId
      cy.intercept('PATCH', `/api/v1/recipes/${recipeId}`).as('updateRecipe')
      cy.visit(`/recipes/${recipeId}/edit`)
      cy.getByLabel('Name').clear()
      cy.contains('input', 'Update Recipe').click()
      cy.wait('@updateRecipe')
        .then(data => {
          cy.wrap(data).its('response.statusCode').should('eq', 422)
          // Name must be between 1 and 100 characters
          cy.getFlash('Name must be between 1 and 100 characters').should('exist')
        })

      cy.getByLabel('Name').type('Space Chicken')
      cy.contains('input', 'Update Recipe').click()

      cy.wait('@updateRecipe')
        .then((data) => {
          cy.wrap(data).its('response.statusCode').should('eq', 200)
          cy.wrap(data).its('response.body.data')
            .then(function() {
              cy.url()
                .should('contain', `/recipes/${recipeId}`)
                .and('not.contain', 'edit')
              cy.assertText({
                by: 'text',
                value: 'Space Chicken',
              })
            })
        })
    })

    it('allows recipe update with all data', function() {
      const recipeId = this.recipe.attributes.clientId
      cy.intercept('PATCH', `/api/v1/recipes/${recipeId}`).as('updateRecipe')
      cy.visit(`/recipes/${recipeId}/edit`)
      cy.getByLabel('Name').clear().type('Space Chicken')
      cy.getByLabel('Description').clear().type('Bad description.')
      // Update 1st ingredient
      cy.getTest('ingredient-0').find('input').clear().type('2 cups applesauce')
      // Add ingredient
      cy.contains('Add Ingredient').click()
      cy.getTest('ingredient-2').find('input').type('3 cups cheez-its')
      // Remove 2nd ingredient
      cy.getTest('ingredient-1').find('[data-test="more"]').click()
      cy.getDropdownItem('Delete').click()
      // Delete Italian category
      cy.getTest('category-Italian').within(() => {
        cy.getTest('category-destroy').click()
      })
      // Add category
      cy.getByLabel('Categories').type('Ame')
      cy.getDropdownItem('American').click()
      // Add step
      cy.contains('Add Step').click()
      cy.getTest('step-2').find('textarea').type('Sift cheez-its onto a cat.')
      // Delete 2nd step
      cy.getTest('step-1').find('[data-test="more"]').click()
      cy.getDropdownItem('Delete').click()
      // Change cook time
      cy.getByLabel('Hours').clear().type('2')
      cy.getByLabel('Minutes').clear().type('45')
      // Change Note
      cy.getByLabel('Notes').clear().type('Something else.')

      cy.contains('input', 'Update Recipe').click()

      const checkData = () => {
        [
          'Space Chicken',
          'Bad description.',
          '2 cups applesauce',
          '3 cups cheez-its',
          'American',
          'Chinese',
          'Grab a chicken.',
          'Sift cheez-its onto a cat.',
          '2 hours and 45 minutes',
          'Something else.',
        ].forEach(text => {
          cy.assertText({
            by: 'text',
            value: text,
          })
        });
        [
          'Put all ingredients on it.',
          '2 tsp banana pudding',
          'Italian',
          'Or ignore everything I said.',
          '1 hour and 2 minutes',
        ].forEach(text => {
          cy.assertText({
            by: 'text',
            value: text,
            not: true,
          })
        })
      }

      cy.wait('@updateRecipe')
        .then((data) => {
          cy.wrap(data).its('response.statusCode').should('eq', 200)
            .then(function() {
              // on show page
              cy.url()
                .should('contain', `/recipes/${recipeId}`)
                .and('not.contain', 'edit')

              checkData()
              // check data has truly persisted
              cy.reload().then(() => checkData())
            })
        })
    })

    it('allows editing image', function() {
      const recipeId = this.recipe.attributes.clientId
      cy.visit(`/recipes/${recipeId}/edit`)
      cy.uploadFile({
        path: 'images/super-cute-puppy.jpeg',
        type: 'image/jpeg',
      })
      cy.contains('input', 'Update Recipe').click()
      cy.assertUrl(`/recipes/${recipeId}`)
      cy.get('[src$="super-cute-puppy.jpeg"]').should('exist')
        .and('have.attr', 'alt', 'Space Soup')
        .and('have.attr', 'title', 'Space Soup')
    })

    it('allows removing and adding back a category', function() {
      const recipeId = this.recipe.attributes.clientId
      cy.intercept('PATCH', `/api/v1/recipes/${recipeId}`).as('updateRecipe')
      cy.visit(`/recipes/${recipeId}/edit`)
      // Delete Italian category
      cy.getTest('category-Italian').within(() => {
        cy.getTest('category-destroy').click()
      })
      // Add Italian category back
      cy.getByLabel('Categories').type('Ita')
      cy.getDropdownItem('Italian').click()

      cy.contains('input', 'Update Recipe').click()

      const checkData = () => {
        cy.assertText({
          by: 'text',
          value: 'Italian',
        })
      }

      cy.wait('@updateRecipe')
        .then((data) => {
          cy.wrap(data).its('response.statusCode').should('eq', 200)
            .then(function() {
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
})

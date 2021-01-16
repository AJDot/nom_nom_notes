import Guid from '../../../src/utils/guid'

describe('Recipes List', () => {
  beforeEach(() => {
    cy.task('resetCRI')
  })

  context('Not logged in', () => {
    it('makes recipes collection request successfully', () => {
      cy.intercept('GET', '/api/v1/recipes').as('getRecipes')
      cy.visit('/')
      cy.url().should('include', '/recipes')
      cy.get('header').should('contain', 'New Recipe')

      cy.wait('@getRecipes').its('response.statusCode').should('be.oneOf', [200, 304])
    })

    it('shows recipe details', () => {
      // listed in alphabetical order
      // categories are shown on list item hover
      // link to view shows on list item hover

      const pastaId = Guid.create()
      cy.apiRequest('POST', '/testing/api/v1/categories', {
        categories: [
          { name: 'Italian' },
          { name: 'American' },
          { name: 'Chinese' },
        ],
      }).its('body').as('categories')
        .then(function() {
          const itCat = this.categories.data.find(c => c.attributes.name === 'Italian')
          cy.apiRequest('POST', '/testing/api/v1/recipes', {
            recipe: {
              clientId: pastaId,
              name: 'Pasta',
              recipeCategoriesAttributes: [
                {
                  categoryId: itCat.attributes.clientId,
                },
              ],
            },
            recipes: [
              {
                name: 'Noodle',
              },
              {
                name: 'Penne',
              },
            ],
          }).its('body').as('recipes')
        })
        .then(function() {
          cy.visit('/')
          // recipes are in alphabetical order by name
          cy.get('.card-list > li:nth-child(1)').should('contain', 'Noodle')
          cy.get('.card-list > li:nth-child(2)').should('contain', 'Pasta')
          cy.get('.card-list > li:nth-child(3)').should('contain', 'Penne')

          cy.getRecipeCard('Pasta').within(() => {
            // recipe shows categories
            cy.contains('Italian').should('exist')
            // recipe shows link to show page
            cy.contains('View Recipe').should('not.be.visible')
            cy.task('activateHoverPseudo', { selector: '.card-list > li:nth-child(2)' })
            cy.contains('View Recipe').should('be.visible')
            // link works
            cy.contains('View Recipe').click()
            cy.url().should('include', `/recipes/${pastaId}`)
          })
        })
    })

    it('can be filtered by recipe category', () => {
      cy.apiRequest('POST', '/testing/api/v1/categories', {
        categories: [
          { name: 'Italian' },
          { name: 'American' },
          { name: 'Chinese' },
        ],
      }).its('body').as('categories')
        .then(function() {
          const itCat = this.categories.data.find(c => c.attributes.name === 'Italian')
          const chCat = this.categories.data.find(c => c.attributes.name === 'Chinese')
          cy.apiRequest('POST', '/testing/api/v1/recipes', {
            recipe: {
              name: 'Pasta',
              recipeCategoriesAttributes: [
                {
                  categoryId: itCat.attributes.clientId,
                },
                {
                  categoryId: chCat.attributes.clientId,
                },
              ],
            },
            recipes: [
              {
                name: 'Noodle',
              },
              {
                name: 'Penne',
                recipeCategoriesAttributes: [
                  {
                    categoryId: chCat.attributes.clientId,
                  },
                ],
              },
            ],
          }).its('body').as('recipes')
        })
        .then(function() {
          cy.visit('/')
          cy.get('.filters-toggle').click()
          const filter = '#filter-category'
          cy.get(filter).type('i')
          // Italian and Chinese categories show as results
          cy.getDropdownItem('Italian').should('exist')
          cy.getDropdownItem('Chinese').click()

          cy.getRecipeCard(0).should('contain', 'Pasta')
          cy.getRecipeCard(1).should('contain', 'Penne')
          // Noodle is filtered out
          cy.getRecipeCard(2).should('not.exist')
          cy.get(filter).clear().type('It')
          cy.getDropdownItem('Chinese').should('not.exist')
          cy.getDropdownItem('Italian').click()
          cy.getRecipeCard(0).should('contain', 'Pasta')
          // Penne and Noodle are filtered out
          cy.getRecipeCard(1).should('not.exist')
        })
    })
  })
})
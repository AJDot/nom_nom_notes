import Guid from '../../../src/utils/guid'

describe('Recipes List', () => {
  context('Not logged in', () => {
    it('shows the app name', () => {
      cy.visit('/')
      cy.contains('h1', 'Nom Nom Notes').should('exist')
    })

    it('makes recipes collection request successfully', () => {
      cy.intercept('GET', '/api/v1/recipes').as('getRecipes')
      cy.visit('/')
      cy.url().should('include', '/recipes')
      cy.get('header').should('contain', 'New Recipe')

      cy.wait('@getRecipes').its('response.statusCode').should('be.oneOf', [200, 304])
    })

    it('shows recipe details', () => {
      // listed in alphabetical order
      // tags are shown on list item hover
      // link to view shows on list item hover

      const pastaId = Guid.create()
      cy.apiRequest('POST', '/testing/api/v1/tags', {
        tags: [
          { name: 'Italian' },
          { name: 'American' },
          { name: 'Chinese' },
        ],
      }).its('body').as('tags')
        .then(function () {
          const tag = this.tags.data.find(c => c.attributes.name === 'Italian')
          cy.apiRequest('POST', '/testing/api/v1/recipes', {
            recipe: {
              clientId: pastaId,
              name: 'Pasta',
              taggingsAttributes: [
                {
                  tagId: tag.attributes.clientId,
                  taggableId: pastaId,
                  taggableType: 'Recipe',
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
        .then(function () {
          cy.visit('/')
          // recipes are in alphabetical order by name
          cy.getRecipeCard(0).should('contain', 'Noodle')
          cy.getRecipeCard(1).should('contain', 'Pasta')
          cy.getRecipeCard(2).should('contain', 'Penne')

          cy.getRecipeCard('Pasta').within((response) => {
            // recipe shows tags
            cy.contains('Italian').should('exist')
            // recipe shows link to show page
            cy.contains('View Recipe').should('not.be.visible')
            cy.wrap(response).trigger('mouseover')
            cy.contains('View Recipe').should('be.visible')
            // link works
            cy.contains('View Recipe').click()
            cy.url().should('include', `/recipes/${pastaId}`)
          })
        })
    })

    it('can be filtered by recipe tag', () => {
      cy.apiRequest('POST', '/testing/api/v1/tags', {
        tags: [
          { name: 'Italian' },
          { name: 'American' },
          { name: 'Chinese' },
        ],
      }).its('body').as('tags')
        .then(function () {
          const tag = this.tags.data.find(c => c.attributes.name === 'Italian')
          const chCat = this.tags.data.find(c => c.attributes.name === 'Chinese')
          cy.apiRequest('POST', '/testing/api/v1/recipes', {
            recipe: {
              name: 'Pasta',
              taggingsAttributes: [
                {
                  tagId: tag.attributes.clientId,
                },
                {
                  tagId: chCat.attributes.clientId,
                },
              ],
            },
            recipes: [
              {
                name: 'Noodle',
              },
              {
                name: 'Penne',
                taggingsAttributes: [
                  {
                    tagId: chCat.attributes.clientId,
                  },
                ],
              },
            ],
          }).its('body').as('recipes')
        })
        .then(function () {
          cy.visit('/')
          cy.contains('Noodle').should('exist')
          cy.getTest('filters-toggle').click()
          const filter = '#filter-tag'
          cy.get(filter).type('i')
          // Italian and Chinese tags show as results
          cy.getDropdownItem('Italian').should('exist')
          cy.getDropdownItem('Chinese').click()

          cy.getRecipeCard(0).should('contain', 'Pasta')
          cy.getRecipeCard(1).should('contain', 'Penne')
          // Noodle is filtered out
          cy.getRecipeCard(2).should('not.exist')
          cy.get(filter).clear()
          cy.get(filter).type('It')
          cy.getDropdownItem('Chinese').should('not.exist')
          cy.getDropdownItem('Italian').click()
          cy.getRecipeCard(0).should('contain', 'Pasta')
          // Penne and Noodle are filtered out
          cy.getRecipeCard(1).should('not.exist')
        })
    })
  })
})

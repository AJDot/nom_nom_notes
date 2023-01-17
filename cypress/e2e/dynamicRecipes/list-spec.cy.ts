import Guid from '../../../src/utils/guid'

describe('Dynamic Recipes List', () => {
  beforeEach(function () {
    cy.createFry().as('fry')
    cy.forceSignIn()
    cy.apiRequest('POST', '/testing/api/v1/tags', {
      tags: [
        { name: 'Italian' },
        { name: 'American' },
        { name: 'Chinese' },
      ],
    }).its('body').as('tags')
  })

  context('Not logged in', () => {
    it('makes dynamic recipes collection request successfully', () => {
      cy.intercept('GET', '/api/v1/dynamic_recipes').as('getDynamicRecipes')
      cy.visit('/dynamic_recipes')
      cy.url().should('includes', '/dynamic_recipes')
      cy.get('header').should('contain', 'New Dynamic Recipe')

      cy.wait('@getDynamicRecipes').its('response.statusCode').should('be.oneOf', [200, 304])
    })

    it('shows dynamic recipe title and tags', function () {
      // listed in alphabetical order
      // is link to view

      const italianTag = this.tags.data.find(c => c.attributes.name === 'Italian')
      const chineseTag = this.tags.data.find(c => c.attributes.name === 'Chinese')
      const pastaId = Guid.create()
      cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
        dynamic_recipe: {
          clientId: pastaId,
          name: 'Pasta',
          taggingsAttributes: [
            {
              tagId: italianTag.attributes.clientId,
              taggableId: pastaId,
              taggableType: 'DynamicRecipe',
            },
            {
              tagId: chineseTag.attributes.clientId,
              taggableId: pastaId,
              taggableType: 'DynamicRecipe',
            },
          ],
        },
        dynamic_recipes: [
          { name: 'Noodle' },
          { name: 'Penne' }
        ]
      }).its('body').as('dynamicRecipes')
        .then(function () {
          cy.visit('/dynamic_recipes')
          // dynamic recipes are in alphabetical order by name
          cy.getDynamicRecipeCard(0).should('contain', 'Noodle')
          cy.getDynamicRecipeCard(1).should('contain', 'Pasta')
          cy.getDynamicRecipeCard(2).should('contain', 'Penne')

          cy.getDynamicRecipeCard('Pasta').within((response) => {
            // shows tags
            cy.contains('Italian').should('exist')
            cy.contains('Chinese').should('exist')
            cy.contains('American').should('not.exist')
          })
        })
    })

    it.only('can be filtered by tag', () => {
      cy.apiRequest('POST', '/testing/api/v1/tags', {
        tags: [
          { name: 'Italian' },
          { name: 'American' },
          { name: 'Chinese' },
        ],
      }).its('body').as('tags')
        .then(function () {
          const tag = this.tags.data.find(tag => tag.attributes.name === 'Italian')
          const chTag = this.tags.data.find(tag => tag.attributes.name === 'Chinese')
          cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
            dynamicRecipe: {
              name: 'Pasta',
              ownerId: this.fry.attributes.clientId,
              taggingsAttributes: [
                {
                  tagId: tag.attributes.clientId,
                },
                {
                  tagId: chTag.attributes.clientId,
                },
              ],
            },
            dynamicRecipes: [
              {
                name: 'Noodle',
              },
              {
                name: 'Penne',
                taggingsAttributes: [
                  {
                    tagId: chTag.attributes.clientId,
                  },
                ],
              },
            ],
          }).its('body').as('dynamicRecipes')
        })
        .then(function () {
          cy.visit('/dynamic_recipes')
          cy.contains('Noodle').should('exist')
          const filter = '#filter-tag'
          cy.get(filter).type('i')
          // Italian and Chinese tags show as results
          cy.getDropdownItem('Italian').should('exist')
          cy.getDropdownItem('Chinese').click()

          cy.getDynamicRecipeCard(0).should('contain', 'Pasta')
          cy.getDynamicRecipeCard(1).should('contain', 'Penne')
          // Noodle is filtered out
          cy.getDynamicRecipeCard(2).should('not.exist')
          cy.get(filter).clear().type('It')
          cy.getDropdownItem('Chinese').should('not.exist')
          cy.getDropdownItem('Italian').click()
          cy.getDynamicRecipeCard(0).should('contain', 'Pasta')
          // Penne and Noodle are filtered out
          cy.getDynamicRecipeCard(1).should('not.exist')
        })
    })
  })
})
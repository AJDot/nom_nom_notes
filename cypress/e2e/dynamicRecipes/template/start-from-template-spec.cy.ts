import { RegexUtils } from '../../../../src/utils/regexUtils'

describe('Start from dynamic recipe template', () => {
  function assertBlocks(expected: { id?: string, type: string, text: string }[]) {
    cy.get('[data-test-block]').should('have.length', expected.length)
      .each((block, i) => {
        if (expected[i].id) expect(block.data('id')).to.equal(expected[i].id)
        expect(block.text()).to.equal(expected[i].text)
        expect(block.data('test-block')).to.equal(expected[i].type)
      })
  }

  beforeEach(() => {
    cy.createFry()
  })

  context('Not logged in', () => {
    it('is not available', function () {
      cy.visit('/dynamic_recipes')
      cy.getTest('new-dynamic-recipe-dropdown-button').should('not.exist')
    })
  })

  context('Logged in', () => {
    beforeEach(() => {
      cy.forceSignIn()
    })

    it('is available and cancellable', () => {
      cy.visit('/dynamic_recipes')
      cy.getTest('new-dynamic-recipe-group')
        .getTest('new-dynamic-recipe-dropdown-button').should('exist')
        .click()
      cy.getTest('new-dynamic-recipe-dropdown').contains('New from Template').should('exist')
      cy.getTest('new-dynamic-recipe-dropdown').contains('New from Template').click()
      cy.getTest('new-dynamic-recipe-dropdown').should('not.exist')
      cy.getModal().should('exist')
        .within(() => {
          cy.contains('Select template').should('exist')
          cy.contains('button', 'Select').should('be.disabled')
          cy.contains('Cancel').click()
        })
      cy.url().should('match', /dynamic_recipes$/)
      cy.getModal().should('not.exist')
    })

    it('allows selection of template to start a dynamic recipe', () => {
      cy.visit('/dynamic_recipes')
      cy.getTest('new-dynamic-recipe-dropdown-button').click()
      cy.getTest('new-dynamic-recipe-dropdown').click()
      cy.getModal()
        .within(() => {
          cy.contains('For simple recipes').should('exist')
          cy.contains('Basic recipe').click()
          cy.contains('button', 'Select').should('not.be.disabled').click()
        })
      cy.url().should('match', new RegExp(`dynamic_recipes/${RegexUtils.partial.UUID}/edit$`))

      assertBlocks([
        { type: 'row', text: 'TitleDescriptionOven TempPrep TimeCook Time' },
        { type: 'column', text: 'TitleDescriptionOven TempPrep TimeCook Time' },
        { type: 'h1', text: 'Title' },
        { type: 'h3', text: 'Description' },
        { type: 'text', text: '' },
        { type: 'row', text: 'Oven TempPrep TimeCook Time' },
        { type: 'column', text: 'Oven Temp' },
        { type: 'h3', text: 'Oven Temp' },
        { type: 'text', text: '' },
        { type: 'column', text: 'Prep Time' },
        { type: 'h3', text: 'Prep Time' },
        { type: 'text', text: '' },
        { type: 'column', text: 'Cook Time' },
        { type: 'h3', text: 'Cook Time' },
        { type: 'text', text: '' },
        { type: 'column', text: '' },
        { type: 'image', text: '' },

        { type: 'row', text: 'Ingredients' },
        { type: 'column', text: 'Ingredients' },
        { type: 'h2', text: 'Ingredients' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },

        { type: 'row', text: 'IngredientsDirections' },
        { type: 'sidebar', text: 'Ingredients' },
        { type: 'column', text: 'Directions' },
        { type: 'h2', text: 'Directions' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },

        { type: 'row', text: 'Notes' },
        { type: 'column', text: 'Notes' },
        { type: 'h2', text: 'Notes' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },

        { type: 'text', text: '' }, // the "type anything... placeholder block"
      ])

      cy.contains(/^List$/).click()
      cy.getDynamicRecipeCard(0).should('contain', 'New Recipe')
      cy.reload()
        .then(() => {
          cy.getDynamicRecipeCard(0).should('contain', 'New Recipe')
        })
    })

    it('allows creating a dynamic recipe from a 2-recipe template', () => {
      cy.visit('/dynamic_recipes')
      cy.getTest('new-dynamic-recipe-dropdown-button').click()
      cy.getTest('new-dynamic-recipe-dropdown').click()
      cy.getModal()
        .within(() => {
          cy.contains('For recipes with two components (e.g. crust and filling)').should('exist')
          cy.contains('Two recipes').click()
          cy.contains('button', 'Select').should('not.be.disabled').click()
        })
      cy.url().should('match', new RegExp(`dynamic_recipes/${RegexUtils.partial.UUID}/edit$`))

      assertBlocks([
        { type: 'row', text: 'TitleDescriptionOven TempPrep TimeCook Time' },
        { type: 'column', text: 'TitleDescriptionOven TempPrep TimeCook Time' },
        { type: 'h1', text: 'Title' },
        { type: 'h3', text: 'Description' },
        { type: 'text', text: '' },
        { type: 'row', text: 'Oven TempPrep TimeCook Time' },
        { type: 'column', text: 'Oven Temp' },
        { type: 'h3', text: 'Oven Temp' },
        { type: 'text', text: '' },
        { type: 'column', text: 'Prep Time' },
        { type: 'h3', text: 'Prep Time' },
        { type: 'text', text: '' },
        { type: 'column', text: 'Cook Time' },
        { type: 'h3', text: 'Cook Time' },
        { type: 'text', text: '' },
        { type: 'column', text: '' },
        { type: 'image', text: '' },

        { type: 'row', text: 'IngredientsRecipe 1Recipe 2' },
        { type: 'column', text: 'IngredientsRecipe 1Recipe 2' },
        { type: 'h2', text: 'Ingredients' },
        { type: 'row', text: 'Recipe 1Recipe 2' },
        { type: 'column', text: 'Recipe 1' },
        { type: 'h3', text: 'Recipe 1' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'column', text: 'Recipe 2' },
        { type: 'h3', text: 'Recipe 2' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },

        { type: 'row', text: 'IngredientsDirections' },
        { type: 'sidebar', text: 'Ingredients' },
        { type: 'column', text: 'Directions' },
        { type: 'h2', text: 'Directions' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },

        { type: 'row', text: 'Notes' },
        { type: 'column', text: 'Notes' },
        { type: 'h2', text: 'Notes' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },

        { type: 'text', text: '' }, // the "type anything... placeholder block"
      ])

      cy.contains(/^List$/).click()
      cy.getDynamicRecipeCard(0).should('contain', 'New Recipe')
      cy.reload()
        .then(() => {
          cy.getDynamicRecipeCard(0).should('contain', 'New Recipe')
        })
    })

    it('allows creating a dynamic recipe from a 3-recipe template', () => {
      cy.visit('/dynamic_recipes')
      cy.getTest('new-dynamic-recipe-dropdown-button').click()
      cy.getTest('new-dynamic-recipe-dropdown').click()
      cy.getModal()
        .within(() => {
          cy.contains('For recipes with three components (e.g. crust, filling, and topping)').should('exist')
          cy.contains('Three recipes').click()
          cy.contains('button', 'Select').should('not.be.disabled').click()
        })
      cy.url().should('match', new RegExp(`dynamic_recipes/${RegexUtils.partial.UUID}/edit$`))

      assertBlocks([
        { type: 'row', text: 'TitleDescriptionOven TempPrep TimeCook Time' },
        { type: 'column', text: 'TitleDescriptionOven TempPrep TimeCook Time' },
        { type: 'h1', text: 'Title' },
        { type: 'h3', text: 'Description' },
        { type: 'text', text: '' },
        { type: 'row', text: 'Oven TempPrep TimeCook Time' },
        { type: 'column', text: 'Oven Temp' },
        { type: 'h3', text: 'Oven Temp' },
        { type: 'text', text: '' },
        { type: 'column', text: 'Prep Time' },
        { type: 'h3', text: 'Prep Time' },
        { type: 'text', text: '' },
        { type: 'column', text: 'Cook Time' },
        { type: 'h3', text: 'Cook Time' },
        { type: 'text', text: '' },
        { type: 'column', text: '' },
        { type: 'image', text: '' },

        { type: 'row', text: 'IngredientsRecipe 1Recipe 2Recipe 3' },
        { type: 'column', text: 'IngredientsRecipe 1Recipe 2Recipe 3' },
        { type: 'h2', text: 'Ingredients' },
        { type: 'row', text: 'Recipe 1Recipe 2Recipe 3' },
        { type: 'column', text: 'Recipe 1' },
        { type: 'h3', text: 'Recipe 1' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'column', text: 'Recipe 2' },
        { type: 'h3', text: 'Recipe 2' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'column', text: 'Recipe 3' },
        { type: 'h3', text: 'Recipe 3' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },

        { type: 'row', text: 'IngredientsDirections' },
        { type: 'sidebar', text: 'Ingredients' },
        { type: 'column', text: 'Directions' },
        { type: 'h2', text: 'Directions' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },

        { type: 'row', text: 'Notes' },
        { type: 'column', text: 'Notes' },
        { type: 'h2', text: 'Notes' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },
        { type: 'text', text: '' },

        { type: 'text', text: '' }, // the "type anything... placeholder block"
      ])

      cy.contains(/^List$/).click()
      cy.getDynamicRecipeCard(0).should('contain', 'New Recipe')
      cy.reload()
        .then(() => {
          cy.getDynamicRecipeCard(0).should('contain', 'New Recipe')
        })
    })
  })
})

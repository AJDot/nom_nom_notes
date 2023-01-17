describe('Edit Dynamic Recipe', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
  })

  context('Logged in', () => {
    beforeEach(() => {
      cy.forceSignIn()
    })

    it('allows me to create a recipe using various block types in the command palette', () => {
      cy.intercept('POST', '/api/v1/dynamic_recipes').as('createDynamicRecipe')
      cy.intercept('POST', '/api/v1/file_uploads').as('image')

      cy.visit('/dynamic_recipes')
      cy.contains('New Dynamic Recipe').click()
      cy.getByLabel('Name').type('Pasta')
      cy.wait('@createDynamicRecipe')
        .then(() => {
          cy.getContentEditable("Type anything...").type('PASTA/h1{enter}{enter}/columns{enter}')
          cy.getContentEditable("Type '/' for commands").type('Ingredients/h2{enter}{enter}')
          cy.getContentEditable("Type '/' for commands").type('Noodles{enter}Water{enter}Salt{downArrow}')
          cy.getContentEditable("Type '/' for commands").type('Directions/h2{enter}{enter}Boil water{enter}Add noodles{enter}Drain noodles when cooked/add column{enter}')
          cy.getContentEditable("Type '/' for commands").type('Notes/h3{enter}{enter}Don\'t forget the thing with the thing.{enter}')
          cy.getContentEditable("Type '/' for commands").type('Sidebar button/sidebar{enter}')
          cy.contains('Sidebar button').trigger('mouseenter')
          cy.contains('edit').click()
          cy.contains('Choose Display Block').click()
          cy.contains('Ingredients').closest('[data-test-block="column"]').click(2, 2)

          cy.contains('Sidebar button').type('/image{enter}')
          cy.get('[data-test-block="image"]').trigger('mouseenter')
          cy.contains('add_a_photo').click()
          cy.uploadFile({
            path: 'images/super-cute-puppy.jpeg',
            type: 'image/jpeg',
          })
        })
      cy.wait('@image')
        .then(() => {
          cy.apiRequest('GET', '/testing/api/v1/dynamic_recipes').its('body.included.0').as('attachment')
        })
        .then(function () {
          cy.get(`[src$="${this.attachment.attributes.clientId}"]`).should('exist')
            .and('have.attr', 'alt', 'Pasta')
            .and('have.attr', 'title', 'Pasta')
        })
        .then(() => {
          cy.contains('Back').click()
          cy.contains('Sidebar button').click()
          cy.getTest('side-panel').should('exist')
            .and('include.text', 'Noodles')
            .and('include.text', 'Water')
            .and('include.text', 'Salt')
            .findTest('close').click()
        })

      const data = [
        { type: 'h1', text: 'PASTA' },
        { type: 'row', text: 'IngredientsNoodlesWaterSaltDirectionsBoil waterAdd noodlesDrain noodles when cookedNotesDon\'t forget the thing with the thing.Sidebar button' },
        { type: 'column', text: 'IngredientsNoodlesWaterSalt' },
        { type: 'h2', text: 'Ingredients' },
        { type: 'text', text: 'Noodles' },
        { type: 'text', text: 'Water' },
        { type: 'text', text: 'Salt' },
        { type: 'column', text: 'DirectionsBoil waterAdd noodlesDrain noodles when cooked' },
        { type: 'h2', text: 'Directions' },
        { type: 'text', text: 'Boil water' },
        { type: 'text', text: 'Add noodles' },
        { type: 'text', text: 'Drain noodles when cooked' },
        { type: 'column', text: 'NotesDon\'t forget the thing with the thing.Sidebar button' },
        { type: 'h3', text: 'Notes' },
        { type: 'text', text: 'Don\'t forget the thing with the thing.' },
        { type: 'sidebar', text: 'Sidebar button' },
        { type: 'image' },
      ]
      cy.get('[data-test-block]')
        .should('have.length', data.length)
        .each((block, i) => {
          const datum = data[i]
          // blocks contain the correct text AND are nested correctly (e.g. row contains both texts, each column contains its one text)
          expect(block.data('test-block')).to.equal(datum.type)
          if (datum.text) expect(block.text()).to.equal(datum.text)
        })
    })
  })
})
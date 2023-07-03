describe('Edit Dynamic Recipe Tags', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
      .then(function () {
        cy.apiRequest('POST', '/testing/api/v1/tags', {
          tags: [
            { name: 'American' },
            { name: 'Italian' },
          ],
        }).its('body.data').as('tags')
          .then(function (tags) {
            cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
              dynamicRecipe: {
                name: 'Pasta',
                ownerId: this.fry.attributes.clientId,
                taggingsAttributes: [
                  { tagId: tags.find(x => x.attributes.name === 'Italian').attributes.clientId },
                ],
              },
            })
          }).its('body.data.0').as('dynamicRecipe')
      })
  })

  context('Logged in', () => {
    beforeEach(() => {
      cy.forceSignIn()
    })

    it('allows me to create create, add, remove tags from dynamic recipe', function () {
      cy.intercept('POST', '/api/v1/tags').as('createTag')
      cy.visit('/dynamic_recipes')
      cy.contains('Pasta').click()
      cy.contains('a', 'Edit').click()
      // Add existing tag
      cy.getByLabel('Tags').type('Ame')
      cy.contains('American').should('exist')
      cy.getByLabel('Tags').type('{enter}')

      // Add new tag
      cy.getByLabel('Tags').clear()
      cy.getByLabel('Tags').type('Chinese')
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.getByLabel('Tags').wait(200)
      cy.getByLabel('Tags').getDropdownItem('+ Create tag Chinese').click()
      cy.wait('@createTag')
        .then(data => {
          cy.wrap(data).its('response.statusCode').should('eq', 201)
        })

      // Delete Italian tag
      cy.getTest('tag-Italian').within(() => {
        cy.getTest('tag-destroy').click()
      })

      // Add another new tag
      cy.getByLabel('Tags').clear()
      cy.getByLabel('Tags').type('British')
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.getByLabel('Tags').wait(200).getDropdownItem('+ Create tag British').click()
      cy.wait('@createTag')
        .then(data => {
          cy.wrap(data).its('response.statusCode').should('eq', 201)
        })

      // Can't add tag if already exists
      cy.getByLabel('Tags').clear()
      cy.getByLabel('Tags').type('Chinese')
      cy.getTest('dropdown-item')
        .should('have.length', 1)
        .trim()
        .should('equal', 'No results found.')

      const checkData = function () {
        cy.contains('Italian').should('not.exist')
        cy.contains('American').should('exist')
        cy.contains('Chinese').should('exist')
      }
      checkData()
      cy.reload().then(checkData)

      // Assert the exact right tags exist
      cy.apiRequest('GET', '/api/v1/tags')
        .then(response => {
          const tags = response.body.data
          expect(tags).to.have.length(4)
          const actualNames = tags.map(t => t.attributes.name)
          const expectedNames = ['American', 'Italian', 'Chinese', 'British']
          expectedNames.forEach(name => expect(actualNames).to.include(name))
        })
    })
  })
})

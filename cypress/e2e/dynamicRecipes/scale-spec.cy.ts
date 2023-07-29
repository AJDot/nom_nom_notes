import { Block } from '../../../src/interfaces/blockInterfacesGeneral'
import Guid from '../../../src/utils/guid'

describe('Dynamic Recipe Scale', () => {
  beforeEach(function() {
    cy.createFry().as('fry')
    cy.forceSignIn()
  })

  it('multiplies ingredient quantities by amount chosen', function() {
    cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
      dynamic_recipe: {
        name: 'Pasta',
        ownerId: this.fry.attributes.clientId,
        blocks: [
          { id: Guid.create(), type: 'ingredient', content: { quantity: '1 1/2 cup', name: 'banana', text: '' } }, // ingredient with unit
          { id: Guid.create(), type: 'ingredient', content: { quantity: '1', name: 'lemon', text: '' } }, // ingredient without unit
        ] as Block[],
      },
    })
    cy.visit('/dynamic_recipes')
    cy.contains('Pasta').click()
    cy.contains('1 1/2 cupbanana').should('exist')
    cy.contains('1lemon').should('exist')
    cy.contains('button', 'Scale').click()
    cy.get('input[placeholder="ex: 1.33, 1 1/3"]').should('exist')
    cy.getDropdownItem('1/2').should('exist')
    cy.getDropdownItem('1').should('exist')
    cy.getDropdownItem('1 1/2').should('exist')
    cy.getDropdownItem('2').should('exist')

    cy.get('input[placeholder="ex: 1.33, 1 1/3"]').type('1.2{enter}')
    // dropdown closes
    cy.get('input[placeholder="ex: 1.33, 1 1/3"]').should('not.exist')
    cy.getTest('dropdown-item').should('not.exist')
    cy.contains('1 1/2 cupbanana').should('not.exist')
    cy.contains('1 4/5 cupbanana').should('exist')
    cy.contains('1 1/5lemon').should('exist')

    cy.contains('button', '(1 1/5) Scale').click()
    cy.contains(/^2$/).click() // regex so 1/3 isn't found by mistake
    cy.getTest('dropdown-item').should('not.exist')
    cy.contains('1 1/2 cup').should('not.exist')
    cy.contains('1 4/5 cup').should('not.exist')
    cy.contains('3 cup').should('exist')
    cy.contains('2lemon').should('exist')

    cy.contains('button', '(2) Scale').click()
    cy.getDropdownItem('1/2').click()
    cy.getTest('dropdown-item').should('not.exist')
    cy.contains('1 1/2 cup').should('not.exist')
    cy.contains('1 4/5 cup').should('not.exist')
    cy.contains('3/4 cup').should('exist')
    cy.contains('1/2lemon').should('exist')
  })

  it('multiplies number block text by amount chosen', function() {
    const blocks: Block[] = [
      { id: Guid.create(), type: 'number', content: { text: '1 1/2' } },
      { id: Guid.create(), type: 'number', content: { text: '4' } },
    ]
    cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
      dynamic_recipe: { name: 'Pasta', ownerId: this.fry.attributes.clientId, blocks },
    })
    cy.visit('/dynamic_recipes')
    cy.contains('Pasta').click()
    cy.contains('1 1/2').should('exist')
    cy.contains('4').should('exist')
    cy.contains('button', 'Scale').click()

    cy.contains(/^2$/).click() // regex so 1/3 isn't found by mistake
    cy.contains('3').should('exist')
    cy.contains('8').should('exist')

    cy.contains('button', '(2) Scale').click()
    cy.getDropdownItem('1/2').click()
    cy.getTest('dropdown-item').should('not.exist')
    cy.contains('3/4').should('exist')
    cy.contains('2').should('exist')
  })

  it('only works in "show" mode', function() {
    const blocks: Block[] = [
      { id: Guid.create(), type: 'ingredient', content: { quantity: '1 1/2 cup', name: 'banana', text: '' } },
      { id: Guid.create(), type: 'number', content: { text: '4' } },
    ]
    cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
      dynamic_recipe: { name: 'Pasta', ownerId: this.fry.attributes.clientId, blocks },
    })
    cy.visit('/dynamic_recipes')
    cy.contains('Pasta').click()
    cy.contains('button', 'Scale').click()
    cy.contains('1 1/2 cup').should('exist')
    cy.contains('4').should('exist')
    cy.getDropdownItem('1 1/2').click()
    cy.getTest('dropdown-item').should('not.exist')
    cy.contains('1 1/2 cup').should('not.exist')
    cy.contains('2 1/4 cup').should('exist')
    cy.contains(/^4$/).should('not.exist')
    cy.contains(/^6$/).should('exist')

    // in edit mode the original user data is present and ready for editing
    cy.contains('Edit').click()
    cy.url().should('include', 'edit')
    cy.contains('(1 1/2) Scale').should('not.exist')
    cy.contains('1 1/2 cup').should('exist')
    cy.contains('2 1/4 cup').should('not.exist')
    cy.contains(/^4$/).should('exist')
    cy.contains(/^6$/).should('not.exist')

    // change quantity
    cy.getContentEditable('1 1/2 cup').clear()
    cy.getContentEditableEmpty('Quantity').type('2 tablespoons')
    cy.getContentEditable(/^4$/).clear()
    cy.getContentEditableEmpty('12.34').type('10')

    // scale is remembered so 2 tbsp is scaled by 1 1/2
    cy.contains('Back').click()
    cy.contains('3 tablespoons').should('exist')
    cy.contains('2 tablespoons').should('not.exist')
    cy.contains('15').should('exist')
    cy.contains('10').should('not.exist')
    cy.contains('button', '(1 1/2) Scale').should('exist')
  })
})

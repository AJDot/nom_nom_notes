import Search from '@/structure/search.vue'
import Searcher from '../../src/utils/searcher'
import jQuery from "jquery"
Object.assign(window, { $: jQuery, jQuery })


describe('Search.cy.ts', () => {
  it('searches for matching string', () => {
    const collection = [{ name: 'Turkey' }, { name: 'Thanksgiving' }, { name: 'Team' }]
    cy.mount(Search, {
      props: {
        searcher: new Searcher({ label: 'name', value: 'name', valueString: 'name', collection })
      }
    })
    cy.get('[data-test="dropdown-item"]').should('have.length', 0)
    cy.get('input[placeholder="Search..."]').type('Turkey')
    cy.get('[data-test="dropdown-item"]')
      .should('have.length', 1)
      .should('have.text', 'Turkey')
    cy.get('input[placeholder="Search..."]').clear().type('T')
    let tExpected = ['Turkey', 'Thanksgiving', 'Team']
    cy.get('[data-test="dropdown-item"]')
      .should('have.length', 3)
      .each(($el, index, $list) => {
        cy.wrap($el).should('have.text', tExpected[index])
      })
    cy.get('input[placeholder="Search..."]').clear().type('e')
    let tExpected2 = ['Turkey', 'Team']
    cy.get('[data-test="dropdown-item"]')
      .should('have.length', 2)
      .each(($el, index, $list) => {
        cy.wrap($el).should('have.text', tExpected2[index])
      })
  })

  it('has results navigable with arrow keys', () => {
    const collection = [{ name: 'Turkey' }, { name: 'Thanksgiving' }, { name: 'Team' }]
    cy.mount(Search, {
      props: {
        searcher: new Searcher({ label: 'name', value: 'name', valueString: 'name', collection })
      }
    })
    cy.get('input[placeholder="Search..."]').type('T')
    cy.get('[data-test="dropdown-item"]')
      .should('have.length', 3)
    // first result is "current" automatically
    cy.get('[role=listbox]')
      .find('[aria-current="true"]')
      .should('have.text', 'Turkey')
    // down arrow cycles forward
    cy.get('input[placeholder="Search..."]').type('{downArrow}')
    cy.get('[role=listbox]')
      .find('[aria-current="true"]')
      .should('have.text', 'Thanksgiving')
    cy.get('input[placeholder="Search..."]').type('{downArrow}')
    cy.get('[role=listbox]')
      .find('[aria-current="true"]')
      .should('have.text', 'Team')
    cy.get('input[placeholder="Search..."]').type('{downArrow}')
    cy.get('[role=listbox]')
      .find('[aria-current="true"]')
      .should('have.text', 'Turkey')
    // up arrow cycles background
    cy.get('input[placeholder="Search..."]').type('{upArrow}')
    cy.get('[role=listbox]')
      .find('[aria-current="true"]')
      .should('have.text', 'Team')
    cy.get('input[placeholder="Search..."]').type('{upArrow}')
    cy.get('[role=listbox]')
      .find('[aria-current="true"]')
      .should('have.text', 'Thanksgiving')
    cy.get('input[placeholder="Search..."]').type('{upArrow}')
    cy.get('[role=listbox]')
      .find('[aria-current="true"]')
      .should('have.text', 'Turkey')
  })

  it('selects the current result when enter is pressed and closes the results', () => {
    const collection = [{ name: 'Turkey' }, { name: 'Thanksgiving' }, { name: 'Team' }]
    const onSelectSpy = cy.spy().as('onSelectSpy')
    cy.mount(Search, {
      props: {
        searcher: new Searcher({ type: 'result', label: 'name', value: 'name', valueString: 'name', collection }),
        onSelect: onSelectSpy
      }
    })
    cy.get('input[placeholder="Search..."]').type('T{downArrow}{enter}')
    cy.get('[role=listbox]').should('not.exist')
    cy.get('@onSelectSpy').should('have.been.calledWith', { data: { type: 'result', label: 'Thanksgiving', value: 'Thanksgiving', raw: { name: 'Thanksgiving' } } })
  })

  describe('with multiple searchers', () => {
    it('display results from all searchers', () => {
      const nameCollection = [{ name: 'Turkey' }, { name: 'Thanksgiving' }, { name: 'Team' }]
      const titleCollection = [{ title: 'Apple' }, { title: 'Apricot' }, { title: 'Artichoke' }]
      const onSelectSpy = cy.spy().as('onSelectSpy')
      cy.mount(Search, {
        props: {
          searchers: [
            new Searcher({ label: 'name', value: 'name', valueString: 'name', collection: nameCollection }),
            new Searcher({ label: 'title', value: 'title', valueString: 'title', collection: titleCollection }),
          ],
          onSelect: onSelectSpy
        }
      })

      cy.get('input[placeholder="Search..."]').type('k')
      let tExpected = ['Turkey', 'Thanksgiving', 'Artichoke']
      cy.getTest('dropdown-item')
        .should('have.length', 3)
        .each(($el, index, $list) => {
          cy.wrap($el).should('have.text', tExpected[index])
        })

      cy.get('input[placeholder="Search..."]').type('e') // now "ke"
      let tExpected2 = ['Turkey', 'Artichoke']
      cy.getTest('dropdown-item')
        .should('have.length', 2)
        .each(($el, index, $list) => {
          cy.wrap($el).should('have.text', tExpected2[index])
        })
    })
  })
})
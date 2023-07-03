describe('View Shopping List', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
  })

  context('Not logged in', () => {
    it('redirects to sign in first', function () {
      cy.visit('/')
      cy.contains('Shopping List').click()
      cy.url().should('contain', '/sign_in')
      cy.contains('Email').type(this.fry.attributes.email)
      cy.contains('Password').type('ah123456')
      cy.contains('input', 'Sign In').click()
      cy.url().should('contain', '/shopping_list')
      cy.contains('h1', 'Shopping List').should('exist')
      cy.contains('There are no items in your shopping list').should('exist')
      cy.contains('Condense').should('not.exist')
      cy.contains('Edit').should('not.exist')
    })
  })

  context('Logged in', () => {
    beforeEach(() => {
      cy.forceSignIn()
    })

    it('navigates to shopping list', function () {
      cy.visit('/')
      cy.contains('Shopping List').click()
      cy.url().should('contain', '/shopping_list')
      cy.contains('h1', 'Shopping List').should('exist')
      cy.contains('There are no items in your shopping list').should('exist')
      cy.contains('Condense').should('not.exist')
      cy.contains('Edit').should('not.exist')
    })
  })
})

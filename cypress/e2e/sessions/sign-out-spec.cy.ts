describe('Sign Out', () => {
  it('allows users to sign out when signed in', () => {
    cy.createFry().as('fry')
      .then((fry) => {
        cy.forceSignIn({
          email: fry.attributes.email,
          password: 'ah123456',
        })
      })
      .then(() => {
        cy.visit('/')
        // username should show
        cy.contains('orangejoe').should('exist')
      })
    cy.contains('a', 'Sign Out').click()
    cy.contains('a', 'Sign Out')
      .then(() => {
        cy.contains('a', 'Sign Out').should('not.exist')
        cy.contains('orangejoe').should('not.exist')
        cy.contains('New Dynamic Recipe').should('be.visible')
      })
  })
})

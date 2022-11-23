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
      .then(() => {
        cy.contains('a', 'Sign Out').should('not.exist')
        cy.contains('orangejoe').should('not.exist')
        cy.contains('New Recipe').should('be.visible')
          .then(() => {
            expect(localStorage.getItem('csrf')).to.be.null
            expect(localStorage.getItem('signedIn')).to.be.oneOf([false, null])
          })
      })
  })
})

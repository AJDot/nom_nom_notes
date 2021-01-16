describe('Sign In', () => {
  it('allows users to sign in to an existing account', () => {
    cy.createFry()
      .then(() => {
        cy.visit('/')
        expect(localStorage.getItem('csrf')).to.be.null
        expect(localStorage.getItem('signedIn')).to.be.oneOf([false, null])
        cy.contains('a', 'Sign In').click()
        cy.url().should('include', '/sign_in')
        cy.get('form').within(() => {
          cy.contains('label', 'Email').type('philip@fry.futurama')
          cy.contains('label', /^Password$/).type('ah123456')
          cy.contains('input', 'Sign In').click()
        })
          .then(() => {
            expect(localStorage.getItem('csrf')).to.not.be.null
            expect(localStorage.getItem('signedIn')).to.eq('true')
            cy.url().should('include', '/recipes')
            cy.contains('a', 'Sign Up').should('not.exist')
            cy.contains('a', 'Sign Out').should('exist')
          })
      })
  })

  it('does not allow sign in unless valid credentials are provided', () => {
    // must be present & valid email
    // password must be present and match user's email account
    cy.createFry()
      .then(() => {
        cy.visit('/sign_in')
        cy.get('form').within(() => {
          cy.contains('input', 'Sign In').click()
        })
        cy.getFlash('Email can\'t be blank').should('exist')

        cy.get('form').within(() => {
          cy.contains('label', 'Email').type('philip@fry')
          cy.contains('input', 'Sign In').click()
        })
        cy.getFlash('Email is invalid').should('exist')

        cy.get('form').within(() => {
          cy.contains('label', 'Email').type('.futurama')
          cy.contains('input', 'Sign In').click()
        })
        cy.getFlash('Password can\'t be blank').should('exist')

        cy.get('form').within(() => {
          cy.contains('label', /^Password$/).type('ah12345')
          cy.contains('input', 'Sign In').click()
        })
        cy.getFlash('Not Authorized').should('exist')

        cy.get('form').within(() => {
          cy.contains('label', /^Password$/).type('6')
          cy.contains('input', 'Sign In').click()
        })
        cy.url().should('include', '/recipes')
      })
  })

  it('is not possible to sign in when already signed in', () => {
    cy.createFry().as('fry')
      .then((fry) => {
        cy.forceSignIn({
          email: fry.attributes.email,
          password: 'ah123456',
        })
      })
      .then(() => {
        // trying to sign up when already signed in redirects to recipes list
        cy.visit('/sign_up')
        cy.url().should('include', '/recipes')
      })
  })
})

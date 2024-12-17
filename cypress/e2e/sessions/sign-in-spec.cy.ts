describe('Sign In', () => {
  context('with signup enabled', () => {
    beforeEach(() => {
      // Enable the sign up feature
      cy.apiRequest('POST', '/testing/api/v1/features', {
        key: 'signup',
      })
    })

    it('allows users to sign in to an existing account', () => {
      cy.createFry()
        .then(() => {
          cy.visit('/')
          cy.contains('a', 'Sign In').click()
          cy.url().should('include', '/sign_in')
          cy.contains('a', 'Sign In').should('not.exist') // no sign up link when on sign up page
          cy.get('form').within(() => {
            cy.contains('label', 'Email').type('philip.fry@planet-express.com')
            cy.contains('label', /^Password$/).type('ah123456')
            cy.contains('input', 'Sign In').click()
          })
          cy.contains('New Dynamic Recipe').should('be.visible')
            .then(() => {
              cy.url().should('include', '/dynamic_recipes')
              cy.contains('a', 'Sign Up').should('not.exist')
              cy.contains('a', 'Sign Out').should('exist')
              // username is displayed in app header
              cy.contains('orangejoe').should('exist')
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
          cy.getFlash('email: no matching login').should('exist')

          cy.get('form').within(() => {
            cy.contains('label', 'Email').type('philip.fry@planet-express')
            cy.contains('input', 'Sign In').click()
          })
          cy.getFlash('email: no matching login').should('exist')

          cy.get('form').within(() => {
            cy.contains('label', 'Email').type('.com')
            cy.contains('input', 'Sign In').click()
          })
          cy.getFlash('password: invalid password').should('exist')

          cy.get('form').within(() => {
            cy.contains('label', /^Password$/).type('ah12345')
            cy.contains('input', 'Sign In').click()
          })
          cy.getFlash('password: invalid password').should('exist')

          cy.get('form').within(() => {
            cy.contains('label', /^Password$/).type('6')
            cy.contains('input', 'Sign In').click()
          })
          cy.url().should('include', '/dynamic_recipes')
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
          cy.url().should('include', '/dynamic_recipes')
        })
    })
  })
})

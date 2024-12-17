describe('Sign Up', () => {
  context('with signup enabled', () => {
    beforeEach(() => {
      // Enable the sign up feature
      cy.apiRequest('POST', '/testing/api/v1/features', {
        key: 'signup',
      })
    })

    it('allows users to create an account', () => {
      cy.visit('/')
      cy.contains('a', 'Sign Up').click()
      cy.url().should('include', '/sign_up')
      cy.contains('a', 'Sign Up').should('not.exist') // no sign up link when on sign up page
      cy.get('form').within(() => {
        cy.getByLabel('Email').type('philip.fry@planet-express.com')
        cy.getByLabel('Username').type('orangejoe')
        cy.getByLabel(/^Password$/).type('i.c. wiener')
        cy.getByLabel('Confirm Password').type('i.c. wiener')
        cy.contains('input', 'Sign Up').click()
      })
      cy.contains('New Dynamic Recipe')
        .then(() => {
          cy.url().should('include', '/dynamic_recipes')
          cy.contains('a', 'Sign Up').should('not.exist')
          cy.contains('a', 'Sign Out').should('exist')
          cy.contains('orangejoe').should('exist')
        })
    })

    it('does not allow sign up unless valid credentials are provided', () => {
      // must be valid email
      // password must match password confirmation
      cy.visit('/')
      cy.contains('a', 'Sign Up').click()
      cy.get('form').within(() => {
        cy.contains('input', 'Sign Up').click()
      })
      cy.get('form')
        .then(() => {
          cy.contains("email: minimum 3 characters").should('exist')
          cy.contains("username: can't be blank").should('not.exist')
          cy.contains("password can't be blank").should('not.exist')
          // confirmation error only shows when password is given
          cy.contains("password_confirmation can't be blank").should('not.exist')
        })
      cy.get('form').within(() => {
        cy.getByLabel('Email').type('philip@fry')
        cy.contains('input', 'Sign Up').click()
      })
      cy.get('form')
        .then(() => {
          cy.contains("email: not a valid email address").should('exist')
        })

      cy.get('form').within(() => {
        cy.getByLabel('Email').type('.futurama')
        cy.getByLabel('Username').type('orangejoe')
        cy.getByLabel(/^Password$/).type('i.c. wiener')
        cy.getByLabel('Confirm Password').type('i.c. wiener!')
        cy.contains('input', 'Sign Up').click()
      })
      cy.contains('password: passwords do not match').should('exist')

      cy.get('form').within(() => {
        cy.contains('label', /^Password$/).type('!')
        cy.contains('input', 'Sign Up').click()
      })
      cy.url().should('include', '/dynamic_recipes')
    })

    it('allows sign up if email or username provided is not already taken', () => {
      cy.createFry()
        .then(() => {
          cy.visit('/sign_up')
          cy.get('form').within(() => {
            cy.getByLabel('Email').type('philip.fry@planet-express.com')
            cy.getByLabel('Username').type('orangejoe')
            cy.getByLabel(/^Password$/).type('AH123456')
            cy.getByLabel('Confirm Password').type('AH123456')
            cy.contains('input', 'Sign Up').click()
          })
          cy.contains('username: already taken').should('exist')

          cy.get('form').within(() => {
            cy.getByLabel('Username').type('a')
            cy.contains('input', 'Sign Up').click()
          })
          cy.contains('already an account with this login').should('exist')
          cy.get('form').within(() => {
            cy.getByLabel('Email').type('a')
            cy.contains('input', 'Sign Up').click()
          })
          cy.url().should('include', '/dynamic_recipes')
          cy.contains('orangejoea').should('exist')
        })
    })

    it('is not possible to sign up when already signed in', () => {
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
          cy.contains('orangejoe').should('exist')
        })
    })
  })

  context('with signup disabled', () => {
    beforeEach(() => {
      // Disable the sign up feature
      cy.apiRequest('DELETE', '/testing/api/v1/features/signup')
    })

    it('it not possible to sign up', () => {
      cy.visit('/')
      cy.contains('Sign Up').should('not.exist')
      cy.visit('/sign_up')
      // redirect to recipes and shows flash message
      cy.url().should('include', '/dynamic_recipes')
      cy.getFlash('Unable to sign up. Action is forbidden').should('exist')
    })
  })
})

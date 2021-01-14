describe('Sign Up', () => {
  it('allows users to create an account', () => {
    cy.visit('/')
    expect(localStorage.getItem('csrf')).to.be.null
    expect(localStorage.getItem('signedIn')).to.be.oneOf([false, null])
    cy.contains('a', 'Sign Up').click()
    cy.url().should('include', '/sign_up')
    cy.get('form').within(() => {
      cy.contains('label', 'Email').type('philip@fry.futurama')
      cy.contains('label', /^Password$/).type('i.c. wiener')
      cy.contains('label', 'Confirm Password').type('i.c. wiener')
      cy.contains('Sign Up').click()
    })
      .then(() => {
        expect(localStorage.getItem('csrf')).to.not.be.null
        expect(localStorage.getItem('signedIn')).to.eq('true')
        cy.url().should('include', '/recipes')
        cy.contains('a', 'Sign Up').should('not.exist')
        cy.contains('a', 'Sign Out').should('exist')
      })
  })

  it('does not allow sign up unless valid credentials are provided', () => {
    // must be valid email
    // password must match password confirmation
    cy.visit('/')
    cy.contains('a', 'Sign Up').click()
    cy.get('form').within(() => {
      cy.contains('Sign Up').click()
    })
      .then(() => {
        cy.contains('Password can\'t be blank').should('exist')
        cy.contains('Password confirmation can\'t be blank').should('exist')
        cy.contains('Email can\'t be blank').should('exist')
        cy.contains('Email is invalid').should('exist')
      })

    cy.get('form').within(() => {
      cy.contains('label', 'Email').type('philip@fry')
      cy.contains('label', /^Password$/).type('i.c. wiener')
      cy.contains('label', 'Confirm Password').type('i.c. wiener!')
      cy.contains('Sign Up').click()
    })
    cy.contains('Password can\'t be blank').should('not.exist')
    cy.contains('Password confirmation can\'t be blank').should('not.exist')
    cy.contains('Email can\'t be blank').should('not.exist')
    cy.contains('Email is invalid').should('exist')
    cy.contains('Password confirmation doesn\'t match Password').should('exist')

    cy.get('form').within(() => {
      cy.contains('label', 'Email').type('.futurama')
      cy.contains('label', /^Password$/).type('!')
      cy.contains('Sign Up').click()
    })
    cy.url().should('include', '/recipes')
  })

  it('allows sign up if email provided is not already taken', () => {
    cy.createBob()
      .then(() => {
        cy.visit('/sign_up')
        cy.get('form').within(() => {
          cy.contains('label', 'Email').type('bob@vance.com')
          cy.contains('label', /^Password$/).type('AH1234')
          cy.contains('label', 'Confirm Password').type('AH1234')
          cy.contains('Sign Up').click()
        })
        cy.contains('Email has already been taken').should('exist')

        cy.get('form').within(() => {
          cy.contains('label', 'Email').type('a')
          cy.contains('Sign Up').click()
        })
        cy.url().should('include', '/recipes')
      })
  })

  it.only('is not possible to sign up when already signed in', () => {
    cy.createBob().as('bob')
      .then((bob) => {
        cy.forceSignIn({
          email: bob.attributes.email,
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

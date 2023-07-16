describe('Forgot Password', () => {
  context('when already signed in', () => {
    beforeEach(() => {
      cy.createFry().as('fry')
      cy.forceSignIn()
    })

    it('redirects to home page', () => {
      cy.visit('/password/forgot')
      cy.url().should('contain', '/dynamic_recipes')
    })
  })

  context('when not signed in', () => {
    it('shows error when email is not provided', () => {
      cy.visit('/password/forgot')
      cy.assertInput({
        by: 'label',
        value: '',
        label: 'Email',
      })
      cy.contains('input', 'Request Password Reset').click()
      cy.getFlash('Email not found.').should('exist')
      cy.url().should('contain', 'password/forgot')
    })

    it('shows error when email is not associated with an account', () => {
      cy.visit('/password/forgot')
      cy.getByLabel('Email').type('Space@Chicken.bagawk')
      cy.contains('input', 'Request Password Reset').click()
      cy.getFlash('Account not found.').should('exist')
      cy.url().should('contain', 'password/forgot')
    })

    context('from sign in page', () => {
      it('allows for user to request a password reset', () => {
        cy.createFry().as('fry')
        cy.visit('/sign_in')
        cy.contains('Forgot Password?').click()
        cy.url().should('contain', 'password/forgot')
        cy.getByLabel('Email').type('philip.fry@planet-express.com')
        cy.contains('input', 'Request Password Reset').click()
        cy.getFlash('A request to change your password was made. Please check your email for instructions.').should('exist')
        cy.url().should('contain', 'sign_in')
        cy.assertInput({
          by: 'label',
          label: 'Email',
          value: 'philip.fry@planet-express.com',
        })
      })
    })

    context('from sign up page', () => {
      beforeEach(() => {
        cy.apiRequest('POST', '/testing/api/v1/features', {
          key: 'signup',
        })
      })

      it('allows for user to request a password reset', () => {
        cy.createFry().as('fry')
        cy.visit('/sign_up')
        cy.contains('Forgot Password?').click()
        cy.visit('/password/forgot')
        cy.getByLabel('Email').type('philip.fry@planet-express.com')
        cy.contains('input', 'Request Password Reset').click()
        cy.getFlash('A request to change your password was made. Please check your email for instructions.').should('exist')
        cy.url().should('contain', 'sign_in')
        cy.assertInput({
          by: 'label',
          label: 'Email',
          value: 'philip.fry@planet-express.com',
        })
      })
    })
  })
})

describe('Reset Password', () => {
  beforeEach(() => {
    cy.createFry().as('fry')
  })

  context('with a valid token', () => {
    beforeEach(function() {
      cy.apiRequest('PUT', '/testing/api/v1/password/forgot', {
        email: this.fry.attributes.email,
        originUrl: Cypress.config().baseUrl + '/password/change',
      }).its('body.token').as('token')
    })

    it('allows resetting password with valid form fields', function() {
      const newPassword = '123456'
      // try to sign in first with the new password to see it's not right
      cy.visit('/sign_in')
        .then(() => {
          cy.getByLabel('Email').type(this.fry.attributes.email)
          cy.getByLabel('Password').type(newPassword)
          cy.contains('input', 'Sign In').click()
            .then(() => {
              cy.url().should('contain', 'sign_in')
              cy.getFlash('Not Authorized')

              // "click" link in email to change password
              cy.visit(`password/change?token=${this.token}`)
                .then(() => {
                  cy.url().should('contain', `password/change?token=${this.token}`)

                  // make sure not signed in
                  expect(localStorage.getItem('csrf')).to.be.null
                  expect(localStorage.getItem('signedIn')).to.be.oneOf([false, null])

                  cy.getByLabel('Password').type(newPassword)
                  cy.getByLabel('Confirm Password').type(newPassword)
                  cy.contains('input', 'Change Password').click()
                    .then(() => {
                      cy.url().should('contain', 'sign_in')
                      cy.getFlash('Password was reset successfully. Please sign in.')
                      cy.getByLabel('Email').type(this.fry.attributes.email)
                      cy.getByLabel('Password').type(newPassword)
                      cy.contains('input', 'Sign In').click()
                      // ensure on home page - localStorage should be updated by now.
                      cy.contains('New Recipe').should('be.visible')
                        .then(() => {
                          // ensure signed in
                          expect(localStorage.getItem('csrf')).to.not.be.null
                          expect(localStorage.getItem('signedIn')).to.eq('true')
                        })
                    })
                })
            })
        })
    })

    it('does not allow resetting password with invalid form fields', function() {
      const newPassword = '123456'
      // try to sign in first with the new password to see it's not right
      // "click" link in email to change password
      cy.visit(`password/change?token=${this.token}`)
        .then(() => {
          cy.url().should('contain', `password/change?token=${this.token}`)

          cy.getByLabel('Password').type(newPassword)
          cy.getByLabel('Confirm Password').type(newPassword + 'A')
          cy.contains('input', 'Change Password').click()
            .then(() => {
              cy.url().should('contain', 'password/change')
              cy.getFlash('Password confirmation doesn\'t match Password')
            })
        })
    })
  })

  context('when token is expired by time', function() {
    beforeEach(function() {
      cy.apiRequest('PUT', '/testing/api/v1/password/forgot', {
        email: this.fry.attributes.email,
        originUrl: Cypress.config().baseUrl + '/password/change',
      }).its('body.token').as('token')
      cy.apiRequest('PUT', `/testing/api/v1/users/${this.fry.id}`, {
        reset_password_sent_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 5), // 5 hours ago
      })
    })

    it('does not allow resetting password', function() {
      const newPassword = '123456'
      // try to sign in first with the new password to see it's not right
      // "click" link in email to change password
      cy.visit(`password/change?token=${this.token}`)
        .then(() => {
          cy.url().should('contain', `password/change?token=${this.token}`)

          cy.getByLabel('Password').type(newPassword)
          cy.getByLabel('Confirm Password').type(newPassword)
          cy.contains('input', 'Change Password').click()
            .then(() => {
              cy.url().should('contain', `password/change?token=${this.token}`)
              cy.getFlash('Link not valid or expired.')
            })
        })
    })
  })

  context('when token is expired because a new token was requested', function() {
    beforeEach(function() {
      cy.apiRequest('PUT', '/testing/api/v1/password/forgot', {
        email: this.fry.attributes.email,
        originUrl: Cypress.config().baseUrl + '/password/change',
      }).its('body.token').as('firstToken')
        .then(() => {
          cy.apiRequest('PUT', '/testing/api/v1/password/forgot', {
            email: this.fry.attributes.email,
            originUrl: Cypress.config().baseUrl + '/password/change',
          }).its('body.token').as('secondToken')
        })
    })

    it('does not allow resetting password', function() {
      cy.visit(`password/change?token=${this.firstToken}`)
        .then(() => {
          const newPassword = '123456'
          cy.url().should('contain', `password/change?token=${this.firstToken}`)

          cy.getByLabel('Password').type(newPassword)
          cy.getByLabel('Confirm Password').type(newPassword)
          cy.contains('input', 'Change Password').click()
            .then(() => {
              cy.url().should('contain', `password/change?token=${this.firstToken}`)
              cy.getFlash('Link not valid or expired.')

              cy.visit(`password/change?token=${this.secondToken}`)
                .then(() => {
                  cy.getByLabel('Password').type(newPassword)
                  cy.getByLabel('Confirm Password').type(newPassword)
                  cy.contains('input', 'Change Password').click()
                    .then(() => {
                      cy.url().should('contain', 'sign_in')
                      cy.getFlash('Password was reset successfully. Please sign in.')
                      cy.getByLabel('Email').type(this.fry.attributes.email)
                      cy.getByLabel('Password').type(newPassword)
                      cy.contains('input', 'Sign In').click()
                      // ensure on home page - localStorage should be updated by now.
                      cy.contains('New Recipe').should('be.visible')
                        .then(() => {
                          // ensure signed in
                          expect(localStorage.getItem('csrf')).to.not.be.null
                          expect(localStorage.getItem('signedIn')).to.eq('true')
                        })
                    })
                })
            })
        })
    })
  })
})

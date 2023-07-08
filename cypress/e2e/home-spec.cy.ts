describe('View Home Page', () => {
  it('shows "loading" state when loading', () => {
    // delay to make sure "loading" page is rendered
    cy.intercept('api/v1/current_user', { delay: 100 }).as('current_user')
    cy.intercept('api/v1/ability').as('ability')
    cy.visit('/')
    cy.get('.ldio-spinner-ellipsis').should('exist')
    cy.contains('h1', 'Nom Nom Notes').should('not.exist')
    cy.wait('@current_user')
    cy.get('.ldio-spinner-ellipsis').should('not.exist')
    cy.contains('h1', 'Nom Nom Notes').should('exist')
  })
})

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import HttpMethod = Cypress.HttpMethod
import RequestBody = Cypress.RequestBody

Cypress.Commands.add('apiRequest', (method: HttpMethod, url: string, body?: RequestBody) => {
  cy.request(method, Cypress.env('api_url') + url, body)
    .then(response => {
      expect(response.status).to.eq(200)
    })
})

Cypress.Commands.add('resetDb', () => {
  cy.request('POST', Cypress.env('api_url') + '/testing/api/v1/databases/clean')
})

Cypress.Commands.add('getRecipeCard', (indexOrName: string | number) => {
  if (typeof indexOrName === 'number') {
    return cy.get(`.card-list > li:nth-child(${indexOrName + 1})`)
  } else {
    return cy.contains('.card-list > li', indexOrName)
  }
})

Cypress.Commands.add('getDropdownItem', (label: string) => {
  cy.contains('.dropdown-item', label)
})

Cypress.Commands.add('createUser', (user: { email: string, password: string }) => {
  return cy.apiRequest('POST', '/testing/api/v1/users', {
    user: {
      email: user.email,
      password: user.password,
      password_confirmation: user.password,
    },
  })
    .its('body.data.0')
    .as('currentUser')
})

Cypress.Commands.add('createFry', () => {
  return cy.createUser({
    email: 'philip@fry.futurama',
    password: 'ah123456',
  })
})

Cypress.Commands.add('forceSignIn', (user?: { email?: string, password?: string }) => {
  cy.apiRequest('POST', '/signin', {
    email: user?.email || 'philip@fry.futurama',
    password: user?.password || 'ah123456',
  }).its('body').as('signIn')
    .then((response) => {
      localStorage.setItem('csrf', response.csrf)
      localStorage.setItem('signedIn', 'true')
    })
})

Cypress.Commands.add('getFlash', (text: string) => {
  cy.get('.flash').contains('li', text)
})

Cypress.Commands.add('getTest', (text: string) => {
  cy.get(`[data-test="${text}"]`)
})

Cypress.Commands.add('getByLabel', (text: string) => {
  return cy.contains('label', text).invoke('attr', 'for')
    .then(labelFor => {
      cy.get(`#${labelFor}`)
    })
})

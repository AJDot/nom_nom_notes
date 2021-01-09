// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Wipes the database and sets up for next test
     * @example
     * cy.resetDb()
     */
    resetDb(): Chainable<any>

    /**
     * Wrapper to provide similar syntax to cy.request but for making api requests
     * @param method {Cypress.HttpMethod}
     * @param url {string}
     * @param body {Cypress.RequestBody}
     */
    apiRequest(method: HttpMethod, url: string, body?: RequestBody): Chainable<Response>
}

// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare type AssertInputOptionTypes = import('./test_typings').AssertInputOptionTypes
declare type AssertTextOptionTypes = import('./test_typings').AssertTextOptionTypes

declare namespace Cypress {
  export interface Hash<T = any> {
    [key: string]: T

    [key: number]: T
  }

  interface ModelResponse {
    attributes: Hash
  }

  interface Chainable<Subject> {
    /**
     * Wipes the database and sets up for next test
     * @example
     * cy.resetDb()
     */
    resetDb(): Chainable<Subject>

    /**
     * Wrapper to provide similar syntax to cy.request but for making api requests
     * @param method {HttpMethod}
     * @param url {string}
     * @param body {RequestBody}
     */
    apiRequest(method: string, url: string, body?: string | Record<string, unknown>): Chainable<Response>

    /**
     * Get the recipe card on the list page
     * @param indexOrName {string, number} index of card or name of recipe
     */
    getRecipeCard(indexOrName: string | number): Chainable<Response>

    /**
     * Get a list item in a dropdown
     * @param indexOrName {string} label of the dropdown item
     */
    getDropdownItem(label: string)

    /**
     * Create a user in database
     * @example
     * cy.createUser({email: 'philip@fry.futurama', password: 'ah123456'})
     */
    createUser(user: { email: string, password: string }): Chainable<ModelResponse>

    /**
     * Create Philip Fry in database
     * @example
     * cy.createFry()
     */
    createFry(): Chainable<ModelResponse>

    /**
     * Sign In user
     * @example
     * cy.forceSignIn({email: 'philip@fry.futurama', password: 'ah123456'})
     */
    forceSignIn(user?: { email?: string, password?: string }): Chainable<ModelResponse>

    /**
     * Get the DOM element in the alert section with text 'Not Valid'
     * @example
     * cy.getAlert('Not Valid')
     */
    getFlash(text: string): Chainable<Subject>

    /**
     * Get the DOM element according to data-test HTML attribute
     * @example
     * cy.getTest('ingredient-0')
     */
    getTest(text: string): Chainable<Subject>

    /**
     * Get the DOM element according to its label text
     * @example
     * cy.getByLabel('ingredient-0').clear().type('input stuff')
     */
    getByLabel(text: string): Chainable<Subject>

    /**
     * Test form field values
     *
     * @example
     * cy.assertInput({by: 'label', label: 'My Label', value: 'A Value'})
     *
     * @example
     * cy.assertInput({by: 'locator', method: 'getTest', tag: 'textarea', value: 'A Value'})
     */
    assertInput(options: AssertInputOptionTypes): Chainable<Subject>

    /**
     * Test text on page
     *
     * @example
     * cy.assertText({by: 'text', value: 'A Value'})
     *
     */
    assertText(options: AssertTextOptionTypes): Chainable<Subject>
  }
}

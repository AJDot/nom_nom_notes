// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare type AssertInputOptionTypes = import('./test_typings').AssertInputOptionTypes
declare type AssertTextOptionTypes = import('./test_typings').AssertTextOptionTypes
declare type AssertUrlOptionType = import('./test_typings').AssertUrlOptionType

declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiRequest(method: string, url: string, body?: string | Record<string, unknown>): Chainable<Response<any>>

    /**
     * Get the recipe card on the list page
     * @param indexOrName {string, number} index of card or name of recipe
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRecipeCard(indexOrName: string | number): Chainable<any>

    /**
     * Get the dynamic recipe card on the list page
     * @param indexOrName {string, number} index of card or name of dynamic recipe
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getDynamicRecipeCard(indexOrName: string | number): Chainable<any>

    /**
     * Get a list item in a dropdown
     * @param label {string} label of the dropdown item
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getDropdownItem(label: string): Chainable<any>

    /**
     * Create a user in database
     * @example
     * cy.createUser({email: 'philip.fry@planet-express.com', password: 'ah123456'})
     */
    createUser(user: { email: string, password: string, username: string }): Chainable<ModelResponse>

    /**
     * Create Philip Fry in database
     * @example
     * cy.createFry()
     */
    createFry(): Chainable<ModelResponse>

    /**
     * Sign In user
     * @example
     * cy.forceSignIn({email: 'philip.fry@planet-express.com', password: 'ah123456'})
     */
    forceSignIn(user?: { email?: string, password?: string }): Chainable<ModelResponse>

    /**
     * Sign Out user
     * @example
     * cy.forceSignOut()
     */
    forceSignOut(): Chainable<ModelResponse>

    /**
     * Get the DOM element according to being contenteditable and having a given content
     * @example
     * cy.getContentEditable("Ingredient")
     */
    getContentEditable(content: string): Chainable<Subject>

    /**
     * Get the DOM element according to being contenteditable, empty, and having a given placeholder attribute
     * @example
     * cy.getContentEditableEmpty("Type '\' for commands")
     */
    getContentEditableEmpty(placeholder: string): Chainable<Subject>

    /**
     * Get the DOM element in the alert section with text 'Not Valid'
     * @example
     * cy.getFlash('Not Valid')
     */
    getFlash(text: string): Chainable<Subject>

    /**
     * Get the DOM element according to data-test HTML attribute
     * @example
     * cy.getTest('ingredient-0')
     */
    getTest(text: string): Chainable<Subject>

    /**
     * Get the DOM element according to data-test HTML attribute, scoped to current subject
     * @example
     * cy.getTest('recipe').findTest('ingredient-0')
     */
    findTest(text: string): Chainable<Subject>

    /**
     * Get the DOM element for the modal
     *
     * @example
     * cy.getModal()
     *
     */
    getModal(): Chainable<Subject>

    /**
     * Get the DOM element according to its label text
     * @example
     * cy.getByLabel('ingredient-0').clear().type('input stuff')
     */
    getByLabel(text: string | RegExp): Chainable<Subject>

    /**
     * Trim the whitespace of a subject's text
     * @example
     *
     * cy.contains('No results found.  ').trim().should('equal', 'No results found.')
     */
    trim(): Chainable<Subject>

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

    /**
     * Test url, possibly exactly
     *
     * @example
     * cy.assertUrl('/recipes', {exact: true})
     *
     */
    assertUrl(path: string, options?: AssertUrlOptionType): Chainable<Subject>

    /**
     * Upload file to html file upload field
     *
     * @example
     * cy.uploadFile({path: 'images/super-cute-puppy.jpeg', type: 'image/jpeg'})
     *
     */
    uploadFile(options: { path: string, type: string }): Chainable<Subject>

    /**
     * Drag an element to another element
     *
     * @example
     * cy.get('#draggable').drag('#droppable')
     *
     */
    drag(target: string | { target: string, dragOpts?: Record<string, unknown>, dropOpts?: Record<string, unknown> }): Chainable<Subject>
  }
}

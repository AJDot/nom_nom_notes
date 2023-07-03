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

import { AssertInputOptionTypes, AssertTextOptionTypes, AssertUrlOptionType } from './test_typings'
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

Cypress.Commands.add('getContentEditableEmpty', (placeholder: string) => {
  return cy.get(`[contenteditable="true"][placeholder="${placeholder}"]:empty`).first()
})

Cypress.Commands.add('getContentEditable', (content: string) => {
  return cy.contains('[contenteditable="true"]', content)
})

Cypress.Commands.add('getRecipeCard', (indexOrName: string | number) => {
  if (typeof indexOrName === 'number') {
    return cy.get(`[data-test="card-list"] > [data-test="card-list-item"]:nth-child(${indexOrName + 1})`)
  } else {
    return cy.contains('[data-test="card-list"] > [data-test="card-list-item"]', indexOrName)
  }
})

Cypress.Commands.add('getDynamicRecipeCard', (indexOrName: string | number) => {
  if (typeof indexOrName === 'number') {
    return cy.get(`[data-test="dynamic-recipe-list-item"]:nth-child(${indexOrName + 1})`)
  } else {
    return cy.contains('[data-test="dynamic-recipe-list-item"]', indexOrName)
  }
})

Cypress.Commands.add('getDropdownItem', (label: string) => {
  cy.contains('[data-test="dropdown-item"]', label)
})

Cypress.Commands.add('createUser', (user: { email: string, password: string, username: string }) => {
  return cy.apiRequest('POST', '/testing/api/v1/users', {
    user: {
      email: user.email,
      password: user.password,
      password_confirmation: user.password,
      username: user.username,
    },
  })
    .its('body.data.0')
    .as('currentUser')
})

Cypress.Commands.add('createFry', () => {
  return cy.createUser({
    email: 'philip.fry@planet-express.com',
    password: 'ah123456',
    username: 'orangejoe',
  })
})

Cypress.Commands.add('forceSignIn', (user?: { email?: string, password?: string }) => {
  cy.apiRequest('POST', '/signin', {
    email: user?.email || 'philip.fry@planet-express.com',
    password: user?.password || 'ah123456',
  }).its('body').as('signIn')
    .then((response) => {
      localStorage.setItem('csrf', response.csrf)
      localStorage.setItem('signedIn', 'true')
    })
})

Cypress.Commands.add('forceSignOut', () => {
  localStorage.removeItem('csrf')
  localStorage.removeItem('signedIn')
})

Cypress.Commands.add('getFlash', (text: string) => {
  cy.get('[data-test="flash"]').contains('li', text)
})

Cypress.Commands.add('getTest', (text: string) => {
  cy.get(`[data-test="${text}"]`)
})

Cypress.Commands.add('findTest', { prevSubject: true }, (subject, text: string) => {
  cy.wrap(subject).find(`[data-test="${text}"]`)
})

Cypress.Commands.add('getModal', () => {
  cy.get('[data-test="modal"]')
})

Cypress.Commands.add('getByLabel', (text: string | RegExp) => {
  cy.contains('label', text).invoke('attr', 'for')
    .then(labelFor => {
      cy.get(`#${labelFor}`)
    })
})

Cypress.Commands.add('trim', { prevSubject: true }, (subject) => {
  cy.wrap(subject).invoke('text').then(text => text.trim())
})

Cypress.Commands.add('assertInput', (options: AssertInputOptionTypes) => {
  switch (options.by) {
    case 'label':
      cy.getByLabel(options.label).should('have.value', options.value)
      break
    case 'locator':
      switch (options.method) {
        case 'getTest':
          cy.getTest(options.locator).find(options.tag ?? 'input').should('have.value', options.value)
          break
        default:
          cy.get(options.locator).find(options.tag ?? 'input').should('have.value', options.value)
          break
      }
      break
    default:
      cy.log(`assertInput "by": ${options} not configured.`)
      break
  }
})

Cypress.Commands.add('assertText', (options: AssertTextOptionTypes) => {
  const exp = options.not ? 'not.exist' : 'exist'
  switch (options.by) {
    case 'text':
      cy.contains(options.value).should(exp)
      break
    default:
      cy.log(`assertText "by": ${options} not configured.`)
      break
  }
})

Cypress.Commands.add('assertUrl', (path: string, options?: AssertUrlOptionType) => {
  const exp = options?.exact === false ? 'contain' : 'eq'
  cy.url().should(exp, Cypress.config().baseUrl + path)
})

Cypress.Commands.add('uploadFile', (options: { path: string, type: string }) => {
  // programmatically upload the logo
  cy.fixture(options.path).as(options.path)
  cy.get('input[type=file]').then(function (el) {
    // convert the logo base64 string to a blob
    const blob = Cypress.Blob.base64StringToBlob(this[options.path], 'image/jpeg')

    const file = new File([blob], options.path, { type: options.type })
    const list = new DataTransfer()

    list.items.add(file)
    const myFileList = list.files

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    el[0].files = myFileList
    el[0].dispatchEvent(new Event('change', { bubbles: true }))
  })
})

Cypress.Commands.add('drag', { prevSubject: 'element' }, (subject: Cypress.JQueryWithSelector<HTMLElement>, target: string | { target: string, dragOpts?: Record<string, unknown>, dropOpts?: Record<string, unknown> }, _options?: Partial<Cypress.TypeOptions>) => {
  const dataTransfer = new DataTransfer()
  let dragOpts: Record<string, unknown> = { dataTransfer, force: true }
  let dropOpts: Record<string, unknown> = { dataTransfer, force: true }
  if (typeof target !== 'string') {
    dragOpts = Object.assign(dragOpts, target.dragOpts ?? {})
    dropOpts = Object.assign(dropOpts, target.dropOpts ?? {})
    target = target.target
  }
  cy.wrap(subject).trigger('dragstart', dragOpts)
  cy.get(target).trigger('dragenter', dropOpts)
  cy.get(target).trigger('dragover', dropOpts)
  cy.get(target).trigger('drop', dropOpts)
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.get(target).wait(50)
  cy.get(target).trigger('dragend', dropOpts)
})

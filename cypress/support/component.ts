// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import AInput from '@/structure/a-input.vue'
import DropdownItemButton from '@/structure/dropdown-item-button.vue'
import DropdownItemEmpty from '@/structure/dropdown-item-empty.vue'
import DropdownItem from '@/structure/dropdown-item.vue'
import Dropdown from '@/structure/dropdown.vue'
import { mount } from 'cypress/vue'
import currentUserMixin from '~/mixins/currentUserMixin'

import 'Styles/index.css'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add('mount', (component, options = {}) => {
  // Setup options object
  options.global = options.global || {}
  options.global.stubs = options.global.stubs || {}
  options.global.stubs['transition'] = false
  options.global.components = options.global.components || {}
  options.global.plugins = options.global.plugins || []
  options.global.mixins = options.global.mixins || []

  /* Add any global plugins */
  // options.global.plugins.push({
  //   install(app) {
  //     app.use(MyPlugin);
  //   },
  // });

  /* Add any global components */
  options.global.components['AInput'] = AInput
  options.global.components['dropdown'] = Dropdown
  options.global.components['dropdown-item'] = DropdownItem
  options.global.components['dropdown-item-empty'] = DropdownItemEmpty
  options.global.components['dropdown-item-button'] = DropdownItemButton

  options.global.mixins.push(currentUserMixin)

  return mount(component as any, options)
})
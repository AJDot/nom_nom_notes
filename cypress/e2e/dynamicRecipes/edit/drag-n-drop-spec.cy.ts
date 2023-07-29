import { Block } from '../../../../src/interfaces/blockInterfacesGeneral'
import Guid from '../../../../src/utils/guid'

describe('Drag n Drop Dynamic Recipe Blocks', function () {
  function assertDrag(blocks: Block[], before: { id?: string, text: string }[], dragId: string, dropId: string, after: { id?: string, text: string }[], opts: { dragOpts?, dropOpts?} = {}) {
    const dragOpts = opts.dragOpts ?? {}
    const dropOpts = opts.dropOpts ?? {}
    cy.intercept('PATCH', '/api/v1/dynamic_recipes/*').as('update')
    cy.apiRequest('POST', '/testing/api/v1/dynamic_recipes', {
      dynamic_recipe: { name: 'Pasta', ownerId: this.fry.attributes.clientId, blocks },
    }).its('body.data.0').as('dynamicRecipe')
      .then(function () {
        cy.visit(`/dynamic_recipes/${this.dynamicRecipe.attributes.clientId}/edit`)

        // BEFORE DRAG
        cy.get('[data-test-block]').should('have.length', before.length)
          .each((block, i) => {
            if (before[i].id) expect(block.data('id')).to.equal(before[i].id)
            expect(block.text()).to.equal(before[i].text)
          })

        cy.get(`[data-id="${dragId}"]`).drag({ target: `[data-id="${dropId}"]`, dragOpts, dropOpts })

        // AFTER DRAG
        cy.get('[data-test-block]').should('have.length', after.length)
          .each((block, i) => {
            if (after[i].id) expect(block.data('id')).to.equal(after[i].id)
            expect(block.text()).to.equal(after[i].text)
          })
      })
    cy.wait('@update') // ensure last autosave is complete before ending test
  }

  beforeEach(function () {
    cy.createFry().as('fry')
    cy.forceSignIn()
  })

  describe('onto h1 block', function () {
    const dropType = 'h1'

    it('allows me to move an h1 block into an h1 block', function () {
      const h1Id = Guid.create()
      const h1Id2 = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: dropType, content: { text: 'Heading 1' } },
        { id: h1Id2, type: 'h1', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: h1Id, text: 'Heading 1' },
        { id: h1Id2, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = h1Id2
      const dropId = h1Id
      const after = [
        { id: h1Id2, text: 'Heading 2' },
        { id: h1Id, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h2 block into an h1 block', function () {
      const h1Id = Guid.create()
      const h2Id = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: dropType, content: { text: 'Heading 1' } },
        { id: h2Id, type: 'h2', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: h1Id, text: 'Heading 1' },
        { id: h2Id, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = h2Id
      const dropId = h1Id
      const after = [
        { id: h2Id, text: 'Heading 2' },
        { id: h1Id, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h3 block into an h1 block', function () {
      const h1Id = Guid.create()
      const h3Id = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: dropType, content: { text: 'Heading 1' } },
        { id: h3Id, type: 'h3', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: h1Id, text: 'Heading 1' },
        { id: h3Id, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = h3Id
      const dropId = h1Id
      const after = [
        { id: h3Id, text: 'Heading 2' },
        { id: h1Id, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a text block into an h1 block', function () {
      const h1Id = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: dropType, content: { text: 'Heading 1' } },
        { id: textId, type: 'text', content: { text: 'Text' } },
      ]

      const before = [
        { id: h1Id, text: 'Heading 1' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = textId
      const dropId = h1Id
      const after = [
        { id: textId, text: 'Text' },
        { id: h1Id, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a row block into an h1 block', function () {
      const h1Id = Guid.create()
      const rowId = Guid.create()
      const columnId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: dropType, content: { text: 'Heading 1' } },
        { id: rowId, type: 'row' },
        { id: columnId, type: 'column', parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: columnId },
      ]

      const before = [
        { id: h1Id, text: 'Heading 1' },
        { id: rowId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = rowId
      const dropId = h1Id
      const after = [
        { id: rowId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: h1Id, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a column block into an h1 block', function () {
      const h1Id = Guid.create()
      const rowId = Guid.create()
      const columnId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: dropType, content: { text: 'Heading 1' } },
        { id: rowId, type: 'row' },
        { id: columnId, type: 'column', parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: columnId },
      ]

      const before = [
        { id: h1Id, text: 'Heading 1' },
        { id: rowId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = columnId
      const dropId = h1Id
      const after = [
        { text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: h1Id, text: 'Heading 1' },
        { id: rowId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an sidebar block into an h1 block', function () {
      const h1Id = Guid.create()
      const sidebarId = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: dropType, content: { text: 'Heading 1' } },
        { id: sidebarId, type: 'sidebar', content: { text: 'Sidebar', blockId: null } },
      ]

      const before = [
        { id: h1Id, text: 'Heading 1' },
        { id: sidebarId, text: 'Sidebar' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = sidebarId
      const dropId = h1Id
      const after = [
        { id: sidebarId, text: 'Sidebar' },
        { id: h1Id, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an image block into an h1 block', function () {
      const h1Id = Guid.create()
      const imageId = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: dropType, content: { text: 'Heading 1' } },
        { id: imageId, type: 'image', content: { attachmentId: null } },
      ]

      const before = [
        { id: h1Id, text: 'Heading 1' },
        { id: imageId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = imageId
      const dropId = h1Id
      const after = [
        { id: imageId, text: '' },
        { id: h1Id, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an ingredient block into an h1 block', function () {
      const h1Id = Guid.create()
      const ingredientId = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: dropType, content: { text: 'Heading 1' } },
        { id: ingredientId, type: 'ingredient', content: { quantity: '', name: '', text: '' } },
      ]

      const before = [
        { id: h1Id, text: 'Heading 1' },
        { id: ingredientId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = ingredientId
      const dropId = h1Id
      const after = [
        { id: ingredientId, text: '' },
        { id: h1Id, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a number block into an h1 block', function () {
      const h1Id = Guid.create()
      const numberId = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: dropType, content: { text: 'Heading 1' } },
        { id: numberId, type: 'number', content: { text: '' } },
      ]

      const before = [
        { id: h1Id, text: 'Heading 1' },
        { id: numberId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = numberId
      const dropId = h1Id
      const after = [
        { id: numberId, text: '' },
        { id: h1Id, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })
  })

  describe('onto h2 block', function () {
    const dropType = 'h2'

    it('allows me to move an h1 block into an h2 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'h1', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h2 block into an h2 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'h2', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h3 block into an h2 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'h3', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a text block into an h2 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'text', content: { text: 'Text' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a row block into an h2 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const columnId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'row' },
        { id: columnId, type: 'column', parentId: dragId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: columnId },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a column block into an h2 block', function () {
      const dropId = Guid.create()
      const rowId = Guid.create()
      const dragId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: rowId, type: 'row' },
        { id: dragId, type: 'column', parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dragId },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: rowId, text: 'Text' },
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { text: 'Text' },
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { id: rowId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an sidebar block into an h2 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'sidebar', content: { text: 'Sidebar', blockId: null } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Sidebar' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Sidebar' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an image block into an h2 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'image', content: { attachmentId: null } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an ingredient block into an h2 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'ingredient', content: { quantity: '', name: '', text: '' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a number block into an h2 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'number', content: { text: '' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })
  })

  describe('onto h3 block', function () {
    const dropType = 'h3'

    it('allows me to move an h1 block into an h3 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'h1', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h2 block into an h3 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'h2', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h3 block into an h3 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'h3', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a text block into an h3 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'text', content: { text: 'Text' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a row block into an h3 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const columnId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'row' },
        { id: columnId, type: 'column', parentId: dragId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: columnId },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a column block into an h3 block', function () {
      const dropId = Guid.create()
      const rowId = Guid.create()
      const dragId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: rowId, type: 'row' },
        { id: dragId, type: 'column', parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dragId },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: rowId, text: 'Text' },
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { text: 'Text' },
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { id: rowId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an sidebar block into an h3 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'sidebar', content: { text: 'Sidebar', blockId: null } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Sidebar' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Sidebar' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an image block into an h3 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'image', content: { attachmentId: null } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an ingredient block into an h3 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'ingredient', content: { quantity: '', name: '', text: '' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a number block into an h3 block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'number', content: { text: '' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })
  })

  describe('onto text block', function () {
    const dropType = 'text'

    it('allows me to move an h1 block into an text block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'h1', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h2 block into an text block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'h2', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h3 block into an text block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'h3', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a text block into an text block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'text', content: { text: 'Text' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a row block into an text block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const columnId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'row' },
        { id: columnId, type: 'column', parentId: dragId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: columnId },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a column block into an text block', function () {
      const dropId = Guid.create()
      const rowId = Guid.create()
      const dragId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: rowId, type: 'row' },
        { id: dragId, type: 'column', parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dragId },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: rowId, text: 'Text' },
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { text: 'Text' },
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { id: rowId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an sidebar block into an text block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'sidebar', content: { text: 'Sidebar', blockId: null } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Sidebar' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Sidebar' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an image block into an text block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'image', content: { attachmentId: null } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an ingredient block into an text block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'ingredient', content: { quantity: '', name: '', text: '' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a number block into an text block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1' } },
        { id: dragId, type: 'number', content: { text: '' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })
  })

  describe('onto sidebar block', function () {
    const dropType = 'sidebar'

    it('allows me to move an h1 block into an sidebar block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1', blockId: null } },
        { id: dragId, type: 'h1', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h2 block into an sidebar block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1', blockId: null } },
        { id: dragId, type: 'h2', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h3 block into an sidebar block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1', blockId: null } },
        { id: dragId, type: 'h3', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a text block into an sidebar block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1', blockId: null } },
        { id: dragId, type: 'text', content: { text: 'Text' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a row block into an sidebar block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const columnId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1', blockId: null } },
        { id: dragId, type: 'row' },
        { id: columnId, type: 'column', parentId: dragId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: columnId },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a column block into an sidebar block', function () {
      const dropId = Guid.create()
      const rowId = Guid.create()
      const dragId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1', blockId: null } },
        { id: rowId, type: 'row' },
        { id: dragId, type: 'column', parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dragId },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: rowId, text: 'Text' },
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { text: 'Text' }, // new row
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: 'Heading 1' },
        { id: rowId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an sidebar block into an sidebar block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1', blockId: null } },
        { id: dragId, type: 'sidebar', content: { text: 'Sidebar', blockId: null } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: 'Sidebar' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Sidebar' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an image block into an sidebar block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1', blockId: null } },
        { id: dragId, type: 'image', content: { attachmentId: null } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an ingredient block into an sidebar block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1', blockId: null } },
        { id: dragId, type: 'ingredient', content: { quantity: '', name: '', text: '' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a number block into an sidebar block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: 'Heading 1', blockId: null } },
        { id: dragId, type: 'number', content: { text: '' } },
      ]

      const before = [
        { id: dropId, text: 'Heading 1' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: 'Heading 1' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })
  })

  describe('onto image block', function () {
    const dropType = 'image'

    it('allows me to move an h1 block into an image block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { attachmentId: null } },
        { id: dragId, type: 'h1', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: '' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h2 block into an image block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { attachmentId: null } },
        { id: dragId, type: 'h2', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: '' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h3 block into an image block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { attachmentId: null } },
        { id: dragId, type: 'h3', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: '' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a text block into an image block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { attachmentId: null } },
        { id: dragId, type: 'text', content: { text: 'Text' } },
      ]

      const before = [
        { id: dropId, text: '' },
        { id: dragId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: dropId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a row block into an image block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const columnId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { attachmentId: null } },
        { id: dragId, type: 'row' },
        { id: columnId, type: 'column', parentId: dragId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: columnId },
      ]

      const before = [
        { id: dropId, text: '' },
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a column block into an image block', function () {
      const dropId = Guid.create()
      const rowId = Guid.create()
      const dragId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { attachmentId: null } },
        { id: rowId, type: 'row' },
        { id: dragId, type: 'column', parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dragId },
      ]

      const before = [
        { id: dropId, text: '' },
        { id: rowId, text: 'Text' },
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { text: 'Text' }, // new row
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: '' },
        { id: rowId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an sidebar block into an image block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { attachmentId: null } },
        { id: dragId, type: 'sidebar', content: { text: 'Sidebar', blockId: null } },
      ]

      const before = [
        { id: dropId, text: '' },
        { id: dragId, text: 'Sidebar' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Sidebar' },
        { id: dropId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an image block into an image block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { attachmentId: null } },
        { id: dragId, type: 'image', content: { attachmentId: null } },
      ]

      const before = [
        { id: dropId, text: '' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an ingredient block into an image block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { attachmentId: null } },
        { id: dragId, type: 'ingredient', content: { quantity: '', name: '', text: '' } },
      ]

      const before = [
        { id: dropId, text: '' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a number block into an image block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { attachmentId: null } },
        { id: dragId, type: 'number', content: { text: '' } },
      ]

      const before = [
        { id: dropId, text: '' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })
  })

  describe('onto row block', function () {
    const dropType = 'row'

    it('allows me to move an h1 block into an row block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType },
        { id: dragId, type: 'h1', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h2 block into an row block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType },
        { id: dragId, type: 'h2', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h3 block into an row block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType },
        { id: dragId, type: 'h3', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Heading 2' },
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a text block into an row block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType },
        { id: dragId, type: 'text', content: { text: 'Text' } },
      ]

      const before = [
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { id: dragId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a row block into an row block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const columnId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType },
        { id: dragId, type: 'row' },
        { id: columnId, type: 'column', parentId: dragId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: columnId },
      ]

      const before = [
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a column block into an row block', function () {
      const dropId = Guid.create()
      const rowId = Guid.create()
      const dragId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType },
        { id: rowId, type: 'row' },
        { id: dragId, type: 'column', parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dragId },
      ]

      const before = [
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { id: rowId, text: 'Text' },
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dropId, text: 'Text' },
        { id: dragId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: rowId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an sidebar block into an row block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType },
        { id: dragId, type: 'sidebar', content: { text: 'Sidebar', blockId: null } },
      ]

      const before = [
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { id: dragId, text: 'Sidebar' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dropId, text: 'Sidebar' },
        { id: dragId, text: 'Sidebar' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an image block into an row block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType },
        { id: dragId, type: 'image', content: { attachmentId: null } },
      ]

      const before = [
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an ingredient block into an row block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType },
        { id: dragId, type: 'ingredient', content: { quantity: '', name: '', text: '' } },
      ]

      const before = [
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a number block into an row block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType },
        { id: dragId, type: 'number', content: { text: '' } },
      ]

      const before = [
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })
  })

  describe('onto column block', function () {
    const dropType = 'column'

    it('allows me to move an h1 block into an column block', function () {
      const rowId = Guid.create()
      const dropId = Guid.create()
      const textId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: rowId, type: 'row' },
        { id: dropId, type: dropType, parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dropId },
        { id: dragId, type: 'h1', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: rowId, text: 'TextHeading 2' },
        { id: dropId, text: 'TextHeading 2' },
        { id: textId, text: 'Text' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h2 block into an column block', function () {
      const rowId = Guid.create()
      const dropId = Guid.create()
      const textId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: rowId, type: 'row' },
        { id: dropId, type: dropType, parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dropId },
        { id: dragId, type: 'h2', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: rowId, text: 'TextHeading 2' },
        { id: dropId, text: 'TextHeading 2' },
        { id: textId, text: 'Text' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h3 block into an column block', function () {
      const rowId = Guid.create()
      const dropId = Guid.create()
      const textId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: rowId, type: 'row' },
        { id: dropId, type: dropType, parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dropId },
        { id: dragId, type: 'h3', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: rowId, text: 'TextHeading 2' },
        { id: dropId, text: 'TextHeading 2' },
        { id: textId, text: 'Text' },
        { id: dragId, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a text block into an column block', function () {
      const rowId = Guid.create()
      const dropId = Guid.create()
      const textId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: rowId, type: 'row' },
        { id: dropId, type: dropType, parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dropId },
        { id: dragId, type: 'text', content: { text: 'Drag' } },
      ]

      const before = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dragId, text: 'Drag' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: rowId, text: 'TextDrag' },
        { id: dropId, text: 'TextDrag' },
        { id: textId, text: 'Text' },
        { id: dragId, text: 'Drag' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a row block into an column block', function () {
      const rowId = Guid.create()
      const dropId = Guid.create()
      const textId2 = Guid.create()
      const dragId = Guid.create()
      const columnId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: rowId, type: 'row' },
        { id: dropId, type: dropType, parentId: rowId },
        { id: textId2, type: 'text', content: { text: 'Text 2' }, parentId: dropId },
        { id: dragId, type: 'row' },
        { id: columnId, type: 'column', parentId: dragId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: columnId },
      ]

      const before = [
        { id: rowId, text: 'Text 2' },
        { id: dropId, text: 'Text 2' },
        { id: textId2, text: 'Text 2' },
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: rowId, text: 'Text 2Text' },
        { id: dropId, text: 'Text 2Text' },
        { id: textId2, text: 'Text 2' },
        { id: dragId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a column block into an column block', function () {
      const rowId = Guid.create()
      const dropId = Guid.create()
      const textId = Guid.create()
      const rowId2 = Guid.create()
      const dragId = Guid.create()
      const textIdDrag = Guid.create()
      const blocks: Block[] = [
        { id: rowId, type: 'row' },
        { id: dropId, type: dropType, parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dropId },
        { id: rowId2, type: 'row' },
        { id: dragId, type: 'column', parentId: rowId2 },
        { id: textIdDrag, type: 'text', content: { text: 'Drag' }, parentId: dragId },
      ]

      const before = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: rowId2, text: 'Drag' },
        { id: dragId, text: 'Drag' },
        { id: textIdDrag, text: 'Drag' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: rowId, text: 'DragText' },
        { id: dragId, text: 'Drag' },
        { id: textIdDrag, text: 'Drag' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: rowId2, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an sidebar block into an column block', function () {
      const rowId = Guid.create()
      const dropId = Guid.create()
      const textId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: rowId, type: 'row' },
        { id: dropId, type: dropType, parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dropId },
        { id: dragId, type: 'sidebar', content: { text: 'Sidebar', blockId: null } },
      ]

      const before = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dragId, text: 'Sidebar' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: rowId, text: 'SidebarText' },
        { id: dragId, text: 'Sidebar' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an image block into an column block', function () {
      const rowId = Guid.create()
      const dropId = Guid.create()
      const textId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: rowId, type: 'row' },
        { id: dropId, type: dropType, parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dropId },
        { id: dragId, type: 'image', content: { attachmentId: null } },
      ]

      const before = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an ingredient block into an column block', function () {
      const rowId = Guid.create()
      const dropId = Guid.create()
      const textId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: rowId, type: 'row' },
        { id: dropId, type: dropType, parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dropId },
        { id: dragId, type: 'ingredient', content: { quantity: '', name: '', text: '' } },
      ]

      const before = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a number block into an column block', function () {
      const rowId = Guid.create()
      const dropId = Guid.create()
      const textId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: rowId, type: 'row' },
        { id: dropId, type: dropType, parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: dropId },
        { id: dragId, type: 'number', content: { text: '' } },
      ]

      const before = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: rowId, text: 'Text' },
        { id: dropId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })
  })

  describe('onto text block in column', function () {
    it('allows me to move a text block from one column to another', function () {
      const rowId = Guid.create()
      const column1Id = Guid.create()
      const column2Id = Guid.create()
      const h1Id = Guid.create()
      const text1Id = Guid.create()
      const text2Id = Guid.create()
      const text3Id = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: 'h1', content: { text: 'Description' } },
        { id: column1Id, type: 'column', parentId: rowId },
        { id: text2Id, type: 'text', content: { text: 'Ingredient 2' }, parentId: column2Id },
        { id: text3Id, type: 'text', content: { text: 'Ingredient 3' }, parentId: column2Id },
        { id: rowId, type: 'row' },
        { id: text1Id, type: 'text', content: { text: 'Ingredient 1' }, parentId: column1Id },
        { id: column2Id, type: 'column', parentId: rowId },
      ]
      const before = [
        { id: h1Id, text: 'Description' },
        { id: rowId, text: 'Ingredient 1Ingredient 2Ingredient 3' },
        { id: column1Id, text: 'Ingredient 1' },
        { id: text1Id, text: 'Ingredient 1' },
        { id: column2Id, text: 'Ingredient 2Ingredient 3' },
        { id: text2Id, text: 'Ingredient 2' },
        { id: text3Id, text: 'Ingredient 3' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = text2Id
      const dropId = text1Id
      const after = [
        { id: h1Id, text: 'Description' },
        { id: rowId, text: 'Ingredient 2Ingredient 1Ingredient 3' },
        { id: column1Id, text: 'Ingredient 2Ingredient 1' },
        { id: text2Id, text: 'Ingredient 2' },
        { id: text1Id, text: 'Ingredient 1' },
        { id: column2Id, text: 'Ingredient 3' },
        { id: text3Id, text: 'Ingredient 3' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a text block into a column block', function () {
      const text1Id = Guid.create()
      const rowId = Guid.create()
      const column1Id = Guid.create()
      const text2Id = Guid.create()
      const blocks: Block[] = [
        { id: text1Id, type: 'text', content: { text: 'Ingredient 1' } },
        { id: rowId, type: 'row' },
        { id: column1Id, type: 'column', parentId: rowId },
        { id: text2Id, type: 'text', content: { text: 'Ingredient 2' }, parentId: column1Id },
      ]

      const before = [
        { id: text1Id, text: 'Ingredient 1' },
        { id: rowId, text: 'Ingredient 2' },
        { id: column1Id, text: 'Ingredient 2' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = text1Id
      const dropId = text2Id
      const after = [
        { id: rowId, text: 'Ingredient 1Ingredient 2' },
        { id: column1Id, text: 'Ingredient 1Ingredient 2' },
        { id: text1Id, text: 'Ingredient 1' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a h1 block into a column block', function () {
      const h1Id = Guid.create()
      const rowId = Guid.create()
      const column1Id = Guid.create()
      const text2Id = Guid.create()
      const blocks: Block[] = [
        { id: h1Id, type: 'h1', content: { text: 'Heading' } },
        { id: rowId, type: 'row' },
        { id: column1Id, type: 'column', parentId: rowId },
        { id: text2Id, type: 'text', content: { text: 'Ingredient 2' }, parentId: column1Id },
      ]

      const before = [
        { id: h1Id, text: 'Heading' },
        { id: rowId, text: 'Ingredient 2' },
        { id: column1Id, text: 'Ingredient 2' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = h1Id
      const dropId = text2Id
      const after = [
        { id: rowId, text: 'HeadingIngredient 2' },
        { id: column1Id, text: 'HeadingIngredient 2' },
        { id: h1Id, text: 'Heading' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a h2 block into a column block', function () {
      const h2Id = Guid.create()
      const rowId = Guid.create()
      const column1Id = Guid.create()
      const text2Id = Guid.create()
      const blocks: Block[] = [
        { id: h2Id, type: 'h2', content: { text: 'Heading' } },
        { id: rowId, type: 'row' },
        { id: column1Id, type: 'column', parentId: rowId },
        { id: text2Id, type: 'text', content: { text: 'Ingredient 2' }, parentId: column1Id },
      ]

      const before = [
        { id: h2Id, text: 'Heading' },
        { id: rowId, text: 'Ingredient 2' },
        { id: column1Id, text: 'Ingredient 2' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = h2Id
      const dropId = text2Id
      const after = [
        { id: rowId, text: 'HeadingIngredient 2' },
        { id: column1Id, text: 'HeadingIngredient 2' },
        { id: h2Id, text: 'Heading' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a h3 block into a column block', function () {
      const h3Id = Guid.create()
      const rowId = Guid.create()
      const column1Id = Guid.create()
      const text2Id = Guid.create()
      const blocks: Block[] = [
        { id: h3Id, type: 'h3', content: { text: 'Heading' } },
        { id: rowId, type: 'row' },
        { id: column1Id, type: 'column', parentId: rowId },
        { id: text2Id, type: 'text', content: { text: 'Ingredient 2' }, parentId: column1Id },
      ]

      const before = [
        { id: h3Id, text: 'Heading' },
        { id: rowId, text: 'Ingredient 2' },
        { id: column1Id, text: 'Ingredient 2' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = h3Id
      const dropId = text2Id
      const after = [
        { id: rowId, text: 'HeadingIngredient 2' },
        { id: column1Id, text: 'HeadingIngredient 2' },
        { id: h3Id, text: 'Heading' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a sidebar block into a column block', function () {
      const sidebarId = Guid.create()
      const rowId = Guid.create()
      const column1Id = Guid.create()
      const text2Id = Guid.create()
      const blocks: Block[] = [
        { id: sidebarId, type: 'sidebar', content: { text: 'Sidebar', blockId: null } },
        { id: rowId, type: 'row' },
        { id: column1Id, type: 'column', parentId: rowId },
        { id: text2Id, type: 'text', content: { text: 'Ingredient 2' }, parentId: column1Id },
      ]

      const before = [
        { id: sidebarId, text: 'Sidebar' },
        { id: rowId, text: 'Ingredient 2' },
        { id: column1Id, text: 'Ingredient 2' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = sidebarId
      const dropId = text2Id
      const after = [
        { id: rowId, text: 'SidebarIngredient 2' },
        { id: column1Id, text: 'SidebarIngredient 2' },
        { id: sidebarId, text: 'Sidebar' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an image block into a column block', function () {
      const imageId = Guid.create()
      const rowId = Guid.create()
      const column1Id = Guid.create()
      const text2Id = Guid.create()
      const blocks: Block[] = [
        { id: imageId, type: 'image', content: { attachmentId: null } },
        { id: rowId, type: 'row' },
        { id: column1Id, type: 'column', parentId: rowId },
        { id: text2Id, type: 'text', content: { text: 'Ingredient 2' }, parentId: column1Id },
      ]

      const before = [
        { id: imageId, text: '' },
        { id: rowId, text: 'Ingredient 2' },
        { id: column1Id, text: 'Ingredient 2' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = imageId
      const dropId = text2Id
      const after = [
        { id: rowId, text: 'Ingredient 2' },
        { id: column1Id, text: 'Ingredient 2' },
        { id: imageId, text: '' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an ingredient block into a column block', function () {
      const ingredientId = Guid.create()
      const rowId = Guid.create()
      const column1Id = Guid.create()
      const text2Id = Guid.create()
      const blocks: Block[] = [
        { id: ingredientId, type: 'ingredient', content: { quantity: '', name: '', text: '' } },
        { id: rowId, type: 'row' },
        { id: column1Id, type: 'column', parentId: rowId },
        { id: text2Id, type: 'text', content: { text: 'Ingredient 2' }, parentId: column1Id },
      ]

      const before = [
        { id: ingredientId, text: '' },
        { id: rowId, text: 'Ingredient 2' },
        { id: column1Id, text: 'Ingredient 2' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = ingredientId
      const dropId = text2Id
      const after = [
        { id: rowId, text: 'Ingredient 2' },
        { id: column1Id, text: 'Ingredient 2' },
        { id: ingredientId, text: '' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a number block into a column block', function () {
      const ingredientId = Guid.create()
      const rowId = Guid.create()
      const column1Id = Guid.create()
      const text2Id = Guid.create()
      const blocks: Block[] = [
        { id: ingredientId, type: 'number', content: { text: '' } },
        { id: rowId, type: 'row' },
        { id: column1Id, type: 'column', parentId: rowId },
        { id: text2Id, type: 'text', content: { text: 'Ingredient 2' }, parentId: column1Id },
      ]

      const before = [
        { id: ingredientId, text: '' },
        { id: rowId, text: 'Ingredient 2' },
        { id: column1Id, text: 'Ingredient 2' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = ingredientId
      const dropId = text2Id
      const after = [
        { id: rowId, text: 'Ingredient 2' },
        { id: column1Id, text: 'Ingredient 2' },
        { id: ingredientId, text: '' },
        { id: text2Id, text: 'Ingredient 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })
  })

  describe('onto number block', function () {
    const dropType = 'number'

    it('allows me to move an h1 block into a number block', function () {
      const dropId = Guid.create()
      const h1Id2 = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: '12.34' } },
        { id: h1Id2, type: 'h1', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: '12.34' },
        { id: h1Id2, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = h1Id2
      const after = [
        { id: h1Id2, text: 'Heading 2' },
        { id: dropId, text: '12.34' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h2 block into a number block', function () {
      const dropId = Guid.create()
      const h2Id = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: '12.34' } },
        { id: h2Id, type: 'h2', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: '12.34' },
        { id: h2Id, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = h2Id
      const after = [
        { id: h2Id, text: 'Heading 2' },
        { id: dropId, text: '12.34' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an h3 block into a number block', function () {
      const dropId = Guid.create()
      const h3Id = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: '12.34' } },
        { id: h3Id, type: 'h3', content: { text: 'Heading 2' } },
      ]

      const before = [
        { id: dropId, text: '12.34' },
        { id: h3Id, text: 'Heading 2' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = h3Id
      const after = [
        { id: h3Id, text: 'Heading 2' },
        { id: dropId, text: '12.34' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a text block into a number block', function () {
      const dropId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: '12.34' } },
        { id: textId, type: 'text', content: { text: 'Text' } },
      ]

      const before = [
        { id: dropId, text: '12.34' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = textId
      const after = [
        { id: textId, text: 'Text' },
        { id: dropId, text: '12.34' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a row block into a number block', function () {
      const dropId = Guid.create()
      const rowId = Guid.create()
      const columnId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: '12.34' } },
        { id: rowId, type: 'row' },
        { id: columnId, type: 'column', parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: columnId },
      ]

      const before = [
        { id: dropId, text: '12.34' },
        { id: rowId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = rowId
      const after = [
        { id: rowId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: '12.34' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a column block into a number block', function () {
      const dropId = Guid.create()
      const rowId = Guid.create()
      const columnId = Guid.create()
      const textId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: '12.34' } },
        { id: rowId, type: 'row' },
        { id: columnId, type: 'column', parentId: rowId },
        { id: textId, type: 'text', content: { text: 'Text' }, parentId: columnId },
      ]

      const before = [
        { id: dropId, text: '12.34' },
        { id: rowId, text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = columnId
      const after = [
        { text: 'Text' },
        { id: columnId, text: 'Text' },
        { id: textId, text: 'Text' },
        { id: dropId, text: '12.34' },
        { id: rowId, text: ' + Add Column  - Remove Empty Row ' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an sidebar block into a number block', function () {
      const dropId = Guid.create()
      const sidebarId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: '12.34' } },
        { id: sidebarId, type: 'sidebar', content: { text: 'Sidebar', blockId: null } },
      ]

      const before = [
        { id: dropId, text: '12.34' },
        { id: sidebarId, text: 'Sidebar' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = sidebarId
      const after = [
        { id: sidebarId, text: 'Sidebar' },
        { id: dropId, text: '12.34' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an image block into a number block', function () {
      const dropId = Guid.create()
      const imageId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: '12.34' } },
        { id: imageId, type: 'image', content: { attachmentId: null } },
      ]

      const before = [
        { id: dropId, text: '12.34' },
        { id: imageId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = imageId
      const after = [
        { id: imageId, text: '' },
        { id: dropId, text: '12.34' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move an ingredient block into a number block', function () {
      const dropId = Guid.create()
      const ingredientId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: '12.34' } },
        { id: ingredientId, type: 'ingredient', content: { quantity: '', name: '', text: '' } },
      ]

      const before = [
        { id: dropId, text: '12.34' },
        { id: ingredientId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const dragId = ingredientId
      const after = [
        { id: ingredientId, text: '' },
        { id: dropId, text: '12.34' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })

    it('allows me to move a number block into a number block', function () {
      const dropId = Guid.create()
      const dragId = Guid.create()
      const blocks: Block[] = [
        { id: dropId, type: dropType, content: { text: '12.34' } },
        { id: dragId, type: 'number', content: { text: '' } },
      ]

      const before = [
        { id: dropId, text: '12.34' },
        { id: dragId, text: '' },
        { text: '' }, // the "type anything... placeholder block"
      ]
      const after = [
        { id: dragId, text: '' },
        { id: dropId, text: '12.34' },
        { text: '' }, // the "type anything... placeholder block"
      ]

      assertDrag.call(this, blocks, before, dragId, dropId, after, { dragOpts: { x: 2, y: 2 }, dropOpts: { x: 2, y: 2 } })
    })
  })
})

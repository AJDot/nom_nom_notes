import { Block } from 'Interfaces/blockInterfacesGeneral'
import Guid from '~/utils/guid'

export interface DynamicRecipeTemplate {
  name: string
  description: string
  blocks: Block[]
}

const DynamicRecipeTemplateFactory = {
  get templates(): DynamicRecipeTemplate[] {
    return [this.basic(), this.twoRecipes(), this.threeRecipes()]
  },

  basic(): DynamicRecipeTemplate {
    const headerRowId = Guid.create()
    const headerColumn1Id = Guid.create()
    const headerColumn2Id = Guid.create()
    const timesRowId = Guid.create()
    const timesColumnId = Guid.create()
    const timesColumn2Id = Guid.create()
    const timesColumn3Id = Guid.create()
    const ingRowId = Guid.create()
    const ingColumnId = Guid.create()
    const dirRowId = Guid.create()
    const dirColumnId = Guid.create()
    const notesRowId = Guid.create()
    const notesColumnId = Guid.create()

    return {
      name: 'Basic recipe',
      description: 'For simple recipes',
      blocks: [
        { id: headerRowId, type: 'row' },
        { id: headerColumn1Id, type: 'column', parentId: headerRowId },
        { id: Guid.create(), type: 'h1', content: { text: 'Title' }, parentId: headerColumn1Id },
        { id: Guid.create(), type: 'h3', content: { text: 'Description' }, parentId: headerColumn1Id },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: headerColumn1Id },
        { id: timesRowId, type: 'row', parentId: headerColumn1Id },
        { id: timesColumnId, type: 'column', parentId: timesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Oven Temp' }, parentId: timesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: timesColumnId },
        { id: timesColumn2Id, type: 'column', parentId: timesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Prep Time' }, parentId: timesColumn2Id },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: timesColumn2Id },
        { id: timesColumn3Id, type: 'column', parentId: timesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Cook Time' }, parentId: timesColumn3Id },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: timesColumn3Id },
        { id: headerColumn2Id, type: 'column', parentId: headerRowId },
        { id: Guid.create(), type: 'image', content: { attachmentId: null }, parentId: headerColumn2Id },

        { id: ingRowId, type: 'row' },
        { id: ingColumnId, type: 'column', parentId: ingRowId },
        { id: 'd5e83cf1-8b79-6c6f-8796-3c9d27bd235b', type: 'h2', content: { text: 'Ingredients' }, parentId: ingColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingColumnId },

        { id: dirRowId, type: 'row' },
        { id: Guid.create(), type: 'sidebar', content: { text: 'Ingredients', blockId: ingRowId }, parentId: dirRowId },
        { id: dirColumnId, type: 'column', parentId: dirRowId },
        { id: Guid.create(), type: 'h2', content: { text: 'Directions' }, parentId: dirColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: dirColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: dirColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: dirColumnId },

        { id: notesRowId, type: 'row' },
        { id: notesColumnId, type: 'column', parentId: notesRowId },
        { id: Guid.create(), type: 'h2', content: { text: 'Notes' }, parentId: notesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: notesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: notesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: notesColumnId },
      ],
    }
  },

  twoRecipes(): DynamicRecipeTemplate {
    const headerRowId = Guid.create()
    const headerColumn1Id = Guid.create()
    const headerColumn2Id = Guid.create()
    const timesRowId = Guid.create()
    const timesColumnId = Guid.create()
    const timesColumn2Id = Guid.create()
    const timesColumn3Id = Guid.create()
    const ingRowId = Guid.create()
    const ingColumnId = Guid.create()
    const ingRecipesRowId = Guid.create()
    const ingRecipe1ColumnId = Guid.create()
    const ingRecipe2ColumnId = Guid.create()
    const dirRowId = Guid.create()
    const dirColumnId = Guid.create()
    const notesRowId = Guid.create()
    const notesColumnId = Guid.create()

    return {
      name: 'Two recipes',
      description: 'For recipes with two components (e.g. crust and filling)',
      blocks: [
        { id: headerRowId, type: 'row' },
        { id: headerColumn1Id, type: 'column', parentId: headerRowId },
        { id: Guid.create(), type: 'h1', content: { text: 'Title' }, parentId: headerColumn1Id },
        { id: Guid.create(), type: 'h3', content: { text: 'Description' }, parentId: headerColumn1Id },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: headerColumn1Id },
        { id: timesRowId, type: 'row', parentId: headerColumn1Id },
        { id: timesColumnId, type: 'column', parentId: timesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Oven Temp' }, parentId: timesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: timesColumnId },
        { id: timesColumn2Id, type: 'column', parentId: timesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Prep Time' }, parentId: timesColumn2Id },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: timesColumn2Id },
        { id: timesColumn3Id, type: 'column', parentId: timesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Cook Time' }, parentId: timesColumn3Id },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: timesColumn3Id },
        { id: headerColumn2Id, type: 'column', parentId: headerRowId },
        { id: Guid.create(), type: 'image', content: { attachmentId: null }, parentId: headerColumn2Id },

        { id: ingRowId, type: 'row' },
        { id: ingColumnId, type: 'column', parentId: ingRowId },
        { id: 'd5e83cf1-8b79-6c6f-8796-3c9d27bd235b', type: 'h2', content: { text: 'Ingredients' }, parentId: ingColumnId },
        { id: ingRecipesRowId, type: 'row', parentId: ingColumnId },
        { id: ingRecipe1ColumnId, type: 'column', parentId: ingRecipesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Recipe 1' }, parentId: ingRecipe1ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe1ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe1ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe1ColumnId },
        { id: ingRecipe2ColumnId, type: 'column', parentId: ingRecipesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Recipe 2' }, parentId: ingRecipe2ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe2ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe2ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe2ColumnId },

        { id: dirRowId, type: 'row' },
        { id: Guid.create(), type: 'sidebar', content: { text: 'Ingredients', blockId: ingRowId }, parentId: dirRowId },
        { id: dirColumnId, type: 'column', parentId: dirRowId },
        { id: Guid.create(), type: 'h2', content: { text: 'Directions' }, parentId: dirColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: dirColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: dirColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: dirColumnId },

        { id: notesRowId, type: 'row' },
        { id: notesColumnId, type: 'column', parentId: notesRowId },
        { id: Guid.create(), type: 'h2', content: { text: 'Notes' }, parentId: notesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: notesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: notesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: notesColumnId },
      ],
    }
  },

  threeRecipes(): DynamicRecipeTemplate {
    const headerRowId = Guid.create()
    const headerColumn1Id = Guid.create()
    const headerColumn2Id = Guid.create()
    const timesRowId = Guid.create()
    const timesColumnId = Guid.create()
    const timesColumn2Id = Guid.create()
    const timesColumn3Id = Guid.create()
    const ingRowId = Guid.create()
    const ingColumnId = Guid.create()
    const ingRecipesRowId = Guid.create()
    const ingRecipe1ColumnId = Guid.create()
    const ingRecipe2ColumnId = Guid.create()
    const ingRecipe3ColumnId = Guid.create()
    const dirRowId = Guid.create()
    const dirColumnId = Guid.create()
    const notesRowId = Guid.create()
    const notesColumnId = Guid.create()

    return {
      name: 'Three recipes',
      description: 'For recipes with three components (e.g. crust, filling, and topping)',
      blocks: [
        { id: headerRowId, type: 'row' },
        { id: headerColumn1Id, type: 'column', parentId: headerRowId },
        { id: Guid.create(), type: 'h1', content: { text: 'Title' }, parentId: headerColumn1Id },
        { id: Guid.create(), type: 'h3', content: { text: 'Description' }, parentId: headerColumn1Id },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: headerColumn1Id },
        { id: timesRowId, type: 'row', parentId: headerColumn1Id },
        { id: timesColumnId, type: 'column', parentId: timesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Oven Temp' }, parentId: timesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: timesColumnId },
        { id: timesColumn2Id, type: 'column', parentId: timesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Prep Time' }, parentId: timesColumn2Id },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: timesColumn2Id },
        { id: timesColumn3Id, type: 'column', parentId: timesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Cook Time' }, parentId: timesColumn3Id },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: timesColumn3Id },
        { id: headerColumn2Id, type: 'column', parentId: headerRowId },
        { id: Guid.create(), type: 'image', content: { attachmentId: null }, parentId: headerColumn2Id },

        { id: ingRowId, type: 'row' },
        { id: ingColumnId, type: 'column', parentId: ingRowId },
        { id: 'd5e83cf1-8b79-6c6f-8796-3c9d27bd235b', type: 'h2', content: { text: 'Ingredients' }, parentId: ingColumnId },
        { id: ingRecipesRowId, type: 'row', parentId: ingColumnId },
        { id: ingRecipe1ColumnId, type: 'column', parentId: ingRecipesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Recipe 1' }, parentId: ingRecipe1ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe1ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe1ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe1ColumnId },
        { id: ingRecipe2ColumnId, type: 'column', parentId: ingRecipesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Recipe 2' }, parentId: ingRecipe2ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe2ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe2ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe2ColumnId },
        { id: ingRecipe3ColumnId, type: 'column', parentId: ingRecipesRowId },
        { id: Guid.create(), type: 'h3', content: { text: 'Recipe 3' }, parentId: ingRecipe3ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe3ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe3ColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: ingRecipe3ColumnId },

        { id: dirRowId, type: 'row' },
        { id: Guid.create(), type: 'sidebar', content: { text: 'Ingredients', blockId: ingRowId }, parentId: dirRowId },
        { id: dirColumnId, type: 'column', parentId: dirRowId },
        { id: Guid.create(), type: 'h2', content: { text: 'Directions' }, parentId: dirColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: dirColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: dirColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: dirColumnId },

        { id: notesRowId, type: 'row' },
        { id: notesColumnId, type: 'column', parentId: notesRowId },
        { id: Guid.create(), type: 'h2', content: { text: 'Notes' }, parentId: notesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: notesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: notesColumnId },
        { id: Guid.create(), type: 'text', content: { text: '' }, parentId: notesColumnId },
      ],
    }
  },
}

export default DynamicRecipeTemplateFactory

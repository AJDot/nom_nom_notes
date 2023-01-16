import { RRecord } from 'Interfaces/modelInterfaces'
import { Mutation, MutationTree } from 'vuex'
import Tag from '~/models/tag'
import { TagsState } from '~/store/interfaces'
import { ArrayUtils } from '~/utils/arrayUtils'

export enum TagMutationTypes {
  SET = 'SET',
}

type TagMutations = { [key in TagMutationTypes]: Mutation<TagsState> }

const mutations: MutationTree<TagsState> & TagMutations = {
  async [TagMutationTypes.SET](state, tags: RRecord[]) {
    tags = ArrayUtils.wrap(tags)
    // delete all tags that don't match the incoming ids
    Tag.query()
      .where((tag: Tag) => {
        return !tags.some((r) => r.clientId === tag.clientId)
      })
      .get()
      .forEach((tag) => tag.$delete())
    await Tag.insertOrUpdate({ data: tags })
  },
}

export default mutations

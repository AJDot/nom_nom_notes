<template>
  <app-layout v-if="fetched" id="app" class="min-h-screen" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppLayout from '~/components/app-layout.vue'
import { store, StoreModulePath } from '~/store'
import { UserActionTypes } from '~/store/modules/users/actions'
import currentUserMixin from './mixins/currentUserMixin'
import { AbilityActionTypes } from './store/modules/ability/actions'

export default defineComponent({
  name: 'App',
  components: {
    AppLayout,
  },
  mixins: [
    currentUserMixin,
  ],
  data() {
    return {
      fetched: false
    }
  },
  async created() {
    await store.dispatch(StoreModulePath.Users + UserActionTypes.FETCH_CURRENT)
    await store.dispatch(StoreModulePath.Ability + AbilityActionTypes.FETCH, { user: this.currentUser })
    this.fetched = true
  }
})
</script>

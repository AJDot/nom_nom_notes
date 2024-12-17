<template>
  <app-layout
    v-if="fetched"
    id="app"
    class="min-h-screen"
  />
  <loading v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppLayout from '~/components/app-layout.vue'
import Loading from '~/components/loading.vue'
import { store, StoreModulePath } from '~/store'
import { UserActionTypes } from '~/store/modules/users/actions'
import currentUserMixin from './mixins/currentUserMixin'
import { AbilityActionTypes } from './store/modules/ability/actions'

export default defineComponent({
  name: 'App',
  components: {
    AppLayout,
    Loading,
  },
  mixins: [
    currentUserMixin,
  ],
  data() {
    return {
      fetched: false,
    }
  },
  async mounted() {
    await store.dispatch(StoreModulePath.Users + UserActionTypes.FETCH_CURRENT)
      .then(() => {
        store.dispatch(StoreModulePath.Ability + AbilityActionTypes.FETCH, { user: this.currentUser })
          .then(() => {
            this.fetched = true
          })
      })
  },
})
</script>

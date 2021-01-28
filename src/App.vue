<template>
  <app-layout id="app" />
</template>

<script lang="ts">
import AppLayout from '~/components/app-layout.vue'
import { defineComponent } from 'vue'
import { store, StoreModulePath } from '~/store'
import { SessionGetterTypes } from '~/store/modules/sessions/getters'
import { UserActionTypes } from '~/store/modules/users/actions'

export default defineComponent({
  name: 'App',
  components: {
    AppLayout,
  },
  setup() {
    if (store.getters[StoreModulePath.Session + SessionGetterTypes.SIGNED_IN]) {
      store.dispatch(StoreModulePath.Users + UserActionTypes.FETCH_CURRENT)
    }
  },
})
</script>

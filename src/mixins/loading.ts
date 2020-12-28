import { defineComponent } from 'vue'
import Loading from '@/loading.vue'
import { store, StoreModulePath } from '~/store'
import { LoadingActionTypes } from '~/store/modules/loading'
import { StoreModuleType } from '~/store/interfaces'

interface LoadingOptions {
  local?: boolean
}

export default defineComponent({
  components: {
    Loading,
  },
  data() {
    return {
      loadingCount: 0,
      isLoadingLocal: false,
    }
  },
  methods: {
    isLoading({ local }: LoadingOptions = {}): boolean {
      if (local) {
        return this.isLoadingLocal
      } else {
        return store.state[StoreModuleType.Loading].loading
      }
    },
    async setLoading(loading: boolean, { local }: LoadingOptions = {}) {
      if (local) {
        if (loading) {
          this.loadingCount++
          this.isLoadingLocal = true
        } else if (this.loadingCount > 0) {
          this.loadingCount--
          this.isLoadingLocal = this.loadingCount > 0
        }
      } else {
        await store.dispatch(StoreModulePath.Loading + LoadingActionTypes.SET, loading)
      }
    },
    async loading(callback: () => unknown, { local }: { local?: boolean } = {}): Promise<void> {
      await this.setLoading(true, { local })
      await callback()
      await this.setLoading(false, { local })
    },
  },
})

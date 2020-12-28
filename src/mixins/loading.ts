import { defineComponent } from 'vue'
import Loading from '@/loading.vue'

export default defineComponent({
  components: {
    Loading,
  },
  data() {
    return {
      loadingCount: 0,
      isLoading: false,
    }
  },
  methods: {
    setLoading(isLoading: boolean) {
      if (isLoading) {
        this.loadingCount++
        this.isLoading = true
      } else if (this.loadingCount > 0) {
        this.loadingCount--
        this.isLoading = this.loadingCount > 0
      }
    },
    async loading(callback: () => unknown): Promise<void> {
      this.setLoading(true)
      await callback()
      this.setLoading(false)
    },
  },
})

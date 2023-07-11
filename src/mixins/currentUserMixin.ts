import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { StoreModuleType } from '~/store/interfaces'

export default defineComponent({
  computed: {
    ...mapState(StoreModuleType.Users, { currentUser: 'current' }),
  },
})

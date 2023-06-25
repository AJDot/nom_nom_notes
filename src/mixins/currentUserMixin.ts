import { mapState } from 'vuex'
import { StoreModuleType } from '~/store/interfaces'

export default {
  computed: {
    ...mapState(StoreModuleType.Users, { currentUser: 'current' }),
  },
}

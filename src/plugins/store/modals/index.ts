import { App } from 'vue'
import { store, StoreModulePath } from '~/store'
import { ModalActionTypes } from '~/store/modules/modal'
import { ModalId } from '~/enums/modalId'
import { Store } from 'vuex'
import { RootState, StoreModuleType } from '~/store/interfaces'

export class ModalStore {
  private store: Store<RootState>
  constructor(store: Store<RootState>) {
    this.store = store
  }

  install(app: App): void {
    if (app.config.globalProperties.$modal) return
    app.config.globalProperties.$modal = this
  }

  state(id: ModalId): boolean {
    return this.store.state[StoreModuleType.Modal].modals.includes(id)
  }

  show(id: ModalId): void {
    this.store.dispatch(StoreModulePath.Modal + ModalActionTypes.ADD, { id })
  }

  hide(id: ModalId): void {
    this.store.dispatch(StoreModulePath.Modal + ModalActionTypes.REMOVE, { id })
  }

  toggle(id: ModalId, state?: boolean): void {
    this.store.dispatch(StoreModulePath.Modal + ModalActionTypes.TOGGLE, { id, state })
  }
}

const modalStore = new ModalStore(store)
export default modalStore

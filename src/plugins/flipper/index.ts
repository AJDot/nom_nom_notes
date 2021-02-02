import { Store } from 'vuex'
import { RootState } from '~/store/interfaces'
import { App } from 'vue'
import { FeatureName, FeatureState } from '~/enums/features'
import { store } from '~/store'
import Feature from 'Models/feature'

export class Flipper {
  private store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
  }

  install(app: App): void {
    if (app.config.globalProperties.$flipper) return
    app.config.globalProperties.$flipper = this
  }

  isEnabled(key: FeatureName): boolean {
    return Feature.query().where('key', key).first()?.state === FeatureState.On
  }

  isDisabled(key: FeatureName): boolean {
    return Feature.query().where('key', key).first()?.state === FeatureState.Off
  }
}

const flipper = new Flipper(store)
export default flipper

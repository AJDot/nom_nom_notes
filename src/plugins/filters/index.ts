import { App } from 'vue'
import durationFilter from '~/plugins/filters/durationFilter'

export class Filters {
  install(app: App): void {
    durationFilter.install(app)
  }
}

const filters = new Filters()
export default filters

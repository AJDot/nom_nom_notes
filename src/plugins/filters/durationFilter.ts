import { App } from 'vue'
import { ArrayUtils } from '~/utils/arrayUtils'
import { Hash } from 'Interfaces/util_interfaces'

interface Unit {
  one: string
  many: string
  seconds: number
}

interface Duration {
  amount: number
  unit: Unit
}

export class DurationFilter {
  install(app: App): void {
    app.config.globalProperties.$filters = app.config.globalProperties.$filters ?? {}
    if (app.config.globalProperties.$filters.duration) {
      throw new Error('duration filter already defined!')
    }
    app.config.globalProperties.$filters.duration = this.display.bind(this)
  }

  display(seconds: string | number, startUnit = 'days', endUnit = 'seconds'): string {
    return this.displaySeconds(seconds, startUnit, endUnit)
  }

  // assumes positive number
  // Math.floor will round in wrong direction for negative numbers
  parseSeconds(seconds: string | number, startUnit = 'days', endUnit = 'seconds'): Array<Duration> {
    const s: string = seconds.toString()
    const durations: Array<Duration> = []
    let current: number = parseInt(s, 10)
    const startIndex = DurationFilter.UNITS.findIndex(u => u.many === startUnit)
    const endIndex = DurationFilter.UNITS.findIndex(u => u.many === endUnit)
    DurationFilter.UNITS.slice(startIndex, endIndex + 1).forEach(unit => {
      const quotient = Math.floor(current / unit.seconds)
      const remainder = current % unit.seconds
      if (quotient) {
        durations.push({
          amount: quotient,
          unit: unit,
        })
      }
      current = remainder
    })
    return durations
  }

  displaySeconds(seconds: string | number, startUnit = 'days', endUnit = 'seconds'): string {
    const displays = this.parseSeconds(seconds, startUnit, endUnit)
      .map(d => `${d.amount} ${d.amount === 1 ? d.unit.one : d.unit.many}`)
    return ArrayUtils.toSentence(displays, ' ', ' and ')
  }

  toSeconds(durations: Hash<number>): number {
    return Object.entries(durations).reduce((acc, [key, value]) => {
      const conversion = DurationFilter.UNITS.find(u => u.many === key)?.seconds
      if (conversion) acc += value * conversion
      return acc
    }, 0)
  }

  private static UNITS: Array<Unit> = [
    {
      one: 'day',
      many: 'days',
      seconds: 60 * 60 * 24,
    },
    {
      one: 'hour',
      many: 'hours',
      seconds: 60 * 60,
    },
    {
      one: 'minute',
      many: 'minutes',
      seconds: 60,
    },
    {
      one: 'second',
      many: 'seconds',
      seconds: 1,
    },
  ]
}

const durationFilter = new DurationFilter()
export default durationFilter

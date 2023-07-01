import FractionJS from 'fraction.js'
import { Fraction, Unit, all, create } from 'mathjs'
const math = create(all, {})

math.createUnit({
  tsp: '1 teaspoon',
  tbsp: '1 tablespoon',
  can: {},
})

class Math {
  add(unitA: Unit, unitB: Unit): Unit {
    return math.add(unitA, unitB)
  }

  createUnit(unitType: string): Unit {
    return math.createUnit(unitType)
  }

  ensureUnit(unitType: string, callback: (unitType: string) => void) {
    try {
      math.unit(unitType)
    } catch (e) {
      callback(unitType)
      math.unit(unitType) // check that callback created unit
    }
    return true
  }

  format(unit: Unit): string {
    const amount = unit.toNumeric() as number | FractionJS
    if (typeof amount === 'number') {
      return amount.toString()
    } else {
      return amount.toFraction(true)
    }
  }

  fraction(amount: number): Fraction {
    return math.fraction(amount)
  }

  toNumber(amount: string): number {
    return math.number(math.fraction(amount))
  }

  toUnitType(text: string): string {
    return text.toLocaleLowerCase().replace(/[\W_]+/g, '')
  }

  unit(amount: number | string, unitType?: string): Unit {
    if (unitType) {
      return math.unit(math.fraction(amount), unitType)
    } else {
      return math.unit(amount.toString())
    }
  }

  unitType(unit: Unit): string {
    return unit.toJSON().unit
  }

  unitTypeLess(unit: Unit): Unit {
    return math.unit(unit.toNumber().toString())
  }
}

export default new Math()

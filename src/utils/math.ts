import Fraction from 'fraction.js'
import { Unit, all, create } from 'mathjs'
const math = create(all, {})

math.createUnit({
  tsp: '1 teaspoon',
  tbsp: '1 tablespoon',
  can: {},
})

class MathClass {
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
    return this.simplify(unit).toFraction(true)
  }

  fraction(amount: number): Fraction {
    return math.fraction(amount) as Fraction
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

  /**
   * attempt to simplify fraction to a "nice" fraction within 1/6 (or something like that)
   * disclaimer: may change value represented
   * @example 0.37
   *   simplify(0.37) //=> 1/3
   * @example 0.45
   *   simplify(0.45) //=> 1/2
   */
  private simplify(unit: Unit): Fraction {
    return new Fraction(unit.toNumeric() as number | Fraction).simplify(1 / 16)
  }
}

export default new MathClass()

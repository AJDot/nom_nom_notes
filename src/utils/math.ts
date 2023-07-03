import Fraction from 'fraction.js'
import { Unit, all, create } from 'mathjs'
const math = create(all, {})

math.createUnit({
  tsp: '1 teaspoon',
  tbsp: '1 tablespoon',
  can: {},
})

class MathClass {
  madeUpUnits: Unit[] = []

  add(unitA: Unit, unitB: Unit): Unit {
    return math.add(unitA, unitB)
  }

  createUnit(unitType: string): Unit {
    return math.createUnit(unitType)
  }

  ensureUnit(quantity: number, unitType: string): Unit {
    try {
      return math.unit(quantity, unitType)
    } catch (e) {
      this.createUnit(unitType)
      const unit = math.unit(quantity, unitType)
      this.madeUpUnits.push(unit)
      return unit
    }
  }

  format(unit: Unit): string {
    const parts: string[] = []
    if (this.isMadeUp(unit)) {
      unit = this.unitTypeLess(unit)
    } else {
      parts.push(this.unitType(unit))
    }

    parts.unshift(this.simplify(unit).toFraction(true))
    return parts.join(' ')
  }

  fraction(amount: number): Fraction {
    return math.fraction(amount) as Fraction
  }

  isMadeUp(unit: Unit): boolean {
    return this.madeUpUnits.some(c => c.equalBase(unit))
  }

  /**
   * attempt to simplify fraction to a "nice" fraction within 1/16 (or something like that)
   * disclaimer: may change value represented
   * @example 0.37
   *   simplify(0.37) //=> 1/3
   * @example 0.45
   *   simplify(0.45) //=> 1/2
   */
  simplify(unit: Unit): Fraction {
    return new Fraction(unit.toNumeric() as number | Fraction).simplify(1 / 16)
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

export default new MathClass()

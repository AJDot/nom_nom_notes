import { RRecord } from 'Interfaces/model_interfaces'

export default class Model implements RRecord {
  id: string | undefined
  protected object: object

  constructor(object = {}) {
    this.object = object
    this.loadFromJson(Object.assign(this, object))
  }

  loadFromJson(object = {}): this {
    Object.assign(this, object)
    return this;
  }

  loadFromModel(model: Model): this {
    this.loadFromJson(model.object)
    return this
  }
}

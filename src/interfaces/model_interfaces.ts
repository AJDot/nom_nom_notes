export interface RRecord {
  id: string | undefined
  clientId: string | undefined
}

export interface Nameable {
  name: string | undefined
}

export interface Description {
  description: string | undefined
}

export interface Destroyable {
  markForDestruction(): void
  _destroy: boolean
  markedForDestruction: boolean
}

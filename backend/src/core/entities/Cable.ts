import { CableInterface } from 'core/interfaces/cable.interface'
import { LineString } from 'core/value-objects/Poligon'
import { v4 as uuidv4 } from 'uuid'

export class Cable {
  constructor(
    private readonly id_linea: string,
    private readonly geom: LineString,
    private readonly id_cable?: string
  ) {}

  static create(data: CableInterface.CreateCableProps): Cable {
    return new Cable(data.id_linea, data.geom, data.id_cable ?? uuidv4())
  }

  get getPublicData(): CableInterface.PublicData {
    return {
      id_linea: this.id_linea,
      geom: this.geom,
      id_cable: this.id_cable!
    }
  }

  get getIdCable(): string {
    return this.id_cable!
  }

  get getIdLinea(): string {
    return this.id_linea
  }

  get getGeom(): LineString {
    return this.geom
  }
}

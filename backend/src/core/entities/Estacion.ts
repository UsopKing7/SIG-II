import { EstacionInterface } from 'core/interfaces/estacion.interface'
import { Poligono } from 'core/value-objects/Poligon'
import { v4 as uuidv4 } from 'uuid'

export class Estacion {
  constructor(
    private readonly nombre: string,
    private readonly color: string,
    private readonly geom: Poligono,
    private readonly id_estacion: string
  ) {}

  static createEstacion(props: EstacionInterface.CreateEstacionProps): Estacion {
    return new Estacion(
      props.nombre,
      props.color,
      new Poligono(props.geom.wkt),
      props.id_estacion ?? uuidv4()
    )
  }

  get getPublicData() {
    return {
      nombre: this.nombre,
      color: this.color,
      geom: this.geom,
      id_estacion: this.id_estacion
    }
  }

  get getIdEstacion(): string {
    return this.id_estacion
  }

  get getNombre(): string {
    return this.nombre
  }

  get getColor(): string {
    return this.color
  }

  get getGeom(): Poligono {
    return this.geom
  }
}

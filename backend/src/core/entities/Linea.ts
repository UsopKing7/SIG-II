import { EnumColorLinea, EnumEstadoLinea } from 'core/enums/linea.enum'
import { LineaInterface } from 'core/interfaces/linea.interface'

export class Linea {
  constructor(
    private readonly nombre_linea: string,
    private readonly color: EnumColorLinea,
    private readonly cantidad_cabinas: number,
    private readonly estado: EnumEstadoLinea,
    private readonly id_linea?: string
  ) {}

  static fromPersistence(data: {
    id_linea: string
    nombre_linea: string
    color: EnumColorLinea
    cantidad_cabinas: number
    estado: EnumEstadoLinea
  }): Linea {
    return new Linea(
      data.nombre_linea,
      data.color,
      data.cantidad_cabinas,
      data.estado,
      data.id_linea
    )
  }

  static createLinea(props: LineaInterface.CreateLineaProps): Linea {
    return new Linea(props.nombre_linea, props.color, props.cantidad_cabinas, props.estado)
  }

  get getPublicData() {
    return {
      nombre_linea: this.nombre_linea,
      color: this.color,
      cantidad_cabinas: this.cantidad_cabinas,
      estado: this.estado,
      id_linea: this.id_linea
    }
  }

  get getIdLinea(): string {
    return this.id_linea!
  }

  get getNombreLinea(): string {
    return this.nombre_linea
  }

  get getColor(): EnumColorLinea {
    return this.color
  }

  get getCantidadCabinas(): number {
    return this.cantidad_cabinas
  }

  get getEstado(): EnumEstadoLinea {
    return this.estado
  }
}

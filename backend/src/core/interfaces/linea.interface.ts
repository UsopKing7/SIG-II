import { EnumColorLinea, EnumEstadoLinea } from 'core/enums/linea.enum'

export namespace LineaInterface {
  export interface CreateLineaProps {
    nombre_linea: string
    color: EnumColorLinea
    cantidad_cabinas: number
    estado: EnumEstadoLinea
  }
}

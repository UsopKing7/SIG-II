import { EnumColorLinea, EnumEstadoLinea } from 'core/enums/linea.enum'

export namespace LineaDTOs {
  export interface Create {
    nombre_linea: string
    color: EnumColorLinea
    cantidad_cabinas: number
    estado: EnumEstadoLinea
  }

  export interface PublicData {
    nombre_linea: string
    color: EnumColorLinea
    cantidad_cabinas: number
    estado: EnumEstadoLinea
    id_linea?: string
  }
}

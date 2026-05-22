import { LineString } from 'core/value-objects/Poligon'

export namespace CableCommand {
  export interface Create {
    id_cable?: string
    id_linea: string
    geom: LineString
  }

  export interface PublicData {
    id_linea: string
    geom: LineString
    id_cable: string
  }
}

import { Point } from 'core/value-objects/Poligon'

export namespace PosteCommands {
  export interface Create {
    id_linea: string
    geom: Point
    id_poste: string
  }

  export interface PublicData {
    id_linea: string
    geom: Point
    id_poste: string
  }
}

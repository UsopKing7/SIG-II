import { Poligono } from 'core/value-objects/Poligon'

export namespace EstacionDTOs {
  export interface Create {
    nombre: string
    color: string
    geom: Poligono
    id_estacion: string
    id_linea: string
  }

  export interface PublicData {
    nombre: string
    color: string
    geom: Poligono
    id_estacion: string
  }
}

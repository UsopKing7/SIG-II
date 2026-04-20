import { Poligono } from 'core/value-objects/Poligon'

export namespace EstacionInterface {
  export interface CreateEstacionProps {
    nombre: string
    color: string
    geom: Poligono
    id_estacion: string
  }
}

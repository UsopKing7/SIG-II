import { PosteInterface } from 'core/interfaces/poste.interface'
import { Point } from 'core/value-objects/Poligon'
import { v4 as uuidv4 } from 'uuid'

export class Poste {
  constructor(
    private readonly id_linea: string,
    private readonly geom: Point,
    private readonly id_poste?: string
  ) {}

  static create(props: PosteInterface.Creat): Poste {
    return new Poste(props.id_linea, props.geom, props.id_poste ?? uuidv4())
  }

  get getPublicData(): PosteInterface.PublicData {
    return {
      id_linea: this.id_linea,
      geom: this.geom,
      id_poste: this.id_poste!
    }
  }

  get getIdPoste(): string {
    return this.id_poste!
  }

  get getIdLinea(): string {
    return this.id_linea
  }

  get getGeom(): Point {
    return this.geom
  }
}

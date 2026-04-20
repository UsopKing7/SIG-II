export class LineaEstacion {
  constructor(
    private readonly id_linea: string,
    private readonly id_estacion: string
  ) {}

  static createLienaEstacion(id_linea: string, id_estacion: string) {
    return new LineaEstacion(id_linea, id_estacion)
  }

  get getidLinea(): string {
    return this.id_linea
  }

  get getidEstacion(): string {
    return this.id_estacion
  }
}

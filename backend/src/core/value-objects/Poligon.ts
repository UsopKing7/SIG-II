export class Poligono {
  constructor(public wkt: string) {
    if (!wkt.startsWith('POLYGON')) {
      throw new Error('Invalid WKT: must be POLYGON')
    }
  }
}

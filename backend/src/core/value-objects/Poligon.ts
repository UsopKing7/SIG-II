export class Poligono {
  constructor(public wkt: string) {
    if (!wkt.startsWith('POLYGON')) {
      throw new Error('Invalid WKT: must be POLYGON')
    }
  }

  static create(wkt: string): Poligono {
    return new Poligono(wkt)
  }
}

export class Point {
  constructor(public wkt: string) {
    if (!wkt.startsWith('POINT')) {
      throw new Error('Invalid WKT: must be POINT')
    }
  }
}

export class LineString {
  constructor(public wkt: string) {
    if (!wkt.startsWith('LINESTRING')) {
      throw new Error('Invalid WKT: must be LINESTRING')
    }
  }
}

import { LineaEstacion } from 'core/entities/LineaEstacion'

export abstract class ILineaEstacionRepositorie {
  abstract createLineaEstacion(data: LineaEstacion): Promise<void>
  abstract findLineaEstacionById(
    id_linea: string,
    id_estacion: string
  ): Promise<LineaEstacion | null>
}

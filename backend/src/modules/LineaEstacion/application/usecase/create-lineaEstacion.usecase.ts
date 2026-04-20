import { Inject, Injectable } from '@nestjs/common'
import { ILineaEstacionRepositorie } from 'core/repositories/lineaEstaciones.repositorie'
import { LineaEstacionDTOs } from '../dtos/lineaEstacion.dto'
import { LineaEstacion } from 'core/entities/LineaEstacion'
import { LINEA_ESTACION_REPOSITORY } from 'shared/const/tokensNest'

@Injectable()
export class CreateLineaEstacionUseCase {
  constructor(
    @Inject(LINEA_ESTACION_REPOSITORY) private readonly lineaEstacionRepo: ILineaEstacionRepositorie
  ) {}

  async execute(data: LineaEstacionDTOs.Create): Promise<void> {
    await this.ensureLineaEstacionExists(data.id_linea, data.id_estacion)
    const lineaEstacion = LineaEstacion.createLienaEstacion(data.id_linea, data.id_estacion)
    await this.lineaEstacionRepo.createLineaEstacion(lineaEstacion)
  }

  private async ensureLineaEstacionExists(id_linea: string, id_estacion: string): Promise<void> {
    const lineaEstacion = await this.lineaEstacionRepo.findLineaEstacionById(id_linea, id_estacion)
    if (lineaEstacion) throw new Error('La estación ya existe en la línea')
  }
}

import { Inject, Injectable } from '@nestjs/common'
import { ILineasRepository } from 'core/repositories/lineas.repositorie'
import { LINEAS_REPOSITORY } from 'shared/const/tokensNest'
import { LineaDTOs } from '../dtos/linea.dto'
import { Linea } from 'core/entities/Linea'

@Injectable()
export class CreateLineaUseCase {
  constructor(@Inject(LINEAS_REPOSITORY) private readonly lineaRepository: ILineasRepository) {}

  async execute(data: LineaDTOs.Create): Promise<LineaDTOs.PublicData> {
    const linea = Linea.createLinea({
      nombre_linea: data.nombre_linea,
      color: data.color,
      cantidad_cabinas: data.cantidad_cabinas,
      estado: data.estado
    })

    const createdLinea = await this.lineaRepository.createLinea(linea)
    return createdLinea.getPublicData
  }
}

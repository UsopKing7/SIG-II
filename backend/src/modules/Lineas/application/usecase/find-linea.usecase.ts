import { Inject, Injectable } from '@nestjs/common'
import { ILineasRepository } from 'core/repositories/lineas.repositorie'
import { LineaDTOs } from '../dtos/linea.dto'
import { LINEAS_REPOSITORY } from 'shared/const/tokensNest'

@Injectable()
export class FindLineaUseCase {
  constructor(@Inject(LINEAS_REPOSITORY) private readonly lineaRepository: ILineasRepository) {}

  async execute(id_linea: string): Promise<LineaDTOs.PublicData> {
    const linea = await this.lineaRepository.findLineaById(id_linea)
    if (!linea) throw new Error('Linea no encontrada')
    return linea.getPublicData
  }
}

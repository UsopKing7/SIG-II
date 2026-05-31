import { Inject, Injectable } from '@nestjs/common'
import { ILineasRepository } from 'core/repositories/lineas.repositorie'
import { LINEAS_REPOSITORY } from 'shared/const/tokensNest'
import { LineaDTOs } from '../dtos/linea.dto'

@Injectable()
export class AllLineasUseCase {
  constructor(
    @Inject(LINEAS_REPOSITORY)
    private readonly lineaRepository: ILineasRepository
  ) {}

  async exucute(): Promise<LineaDTOs.PublicData[]> {
    const lineas = await this.lineaRepository.AllLineas()
    return lineas.map(linea => {
      return linea.getPublicData
    })
  }
}

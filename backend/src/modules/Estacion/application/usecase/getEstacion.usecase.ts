import { Inject, Injectable } from '@nestjs/common'
import { IEstacionRepository } from 'core/repositories/estacion.repositorie'
import { ESTACIONES_REPOSITORY } from 'shared/const/tokensNest'
import { EstacionDTOs } from '../dtos/estacion.dto'

@Injectable()
export class GetEstacionUseCase {
  constructor(
    @Inject(ESTACIONES_REPOSITORY)
    private readonly estacionRepo: IEstacionRepository
  ) {}

  async execute(): Promise<EstacionDTOs.PublicData[]> {
    const estacion = await this.estacionRepo.findEstacionById()
    if (!estacion) throw new Error('Estacion no encontrada')
    return estacion.map(estacion => estacion.getPublicData)
  }
}

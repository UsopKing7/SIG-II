import { Injectable } from '@nestjs/common'
import { EstacionDTOs } from 'modules/Estacion/application/dtos/estacion.dto'
import { CreateEstacionUseCase } from 'modules/Estacion/application/usecase/create-estacion.usecase'
import { GetEstacionUseCase } from 'modules/Estacion/application/usecase/getEstacion.usecase'

@Injectable()
export class EstacionService {
  constructor(
    private readonly createEstacionUseCase: CreateEstacionUseCase,
    private readonly getEstacionUseCase: GetEstacionUseCase
  ) {}

  async createEstacion(data: EstacionDTOs.Create): Promise<EstacionDTOs.PublicData> {
    return await this.createEstacionUseCase.execute({
      ...data,
      id_linea: data.id_linea,
      id_estacion: data.id_estacion
    })
  }

  async getEstacion(): Promise<EstacionDTOs.PublicData[]> {
    return await this.getEstacionUseCase.execute()
  }
}

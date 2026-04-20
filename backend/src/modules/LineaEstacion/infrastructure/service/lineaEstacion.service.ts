import { Injectable } from '@nestjs/common'
import { LineaEstacionDTOs } from 'modules/LineaEstacion/application/dtos/lineaEstacion.dto'
import { CreateLineaEstacionUseCase } from 'modules/LineaEstacion/application/usecase/create-lineaEstacion.usecase'

@Injectable()
export class LineaEstacionService {
  constructor(private readonly createLineaEstacionUseCase: CreateLineaEstacionUseCase) {}

  async createLineaEstacion(data: LineaEstacionDTOs.Create) {
    return await this.createLineaEstacionUseCase.execute(data)
  }
}

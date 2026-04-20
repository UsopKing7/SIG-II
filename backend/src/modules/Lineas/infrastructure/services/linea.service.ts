import { Injectable } from '@nestjs/common'
import { LineaDTOs } from 'modules/Lineas/application/dtos/linea.dto'
import { CreateLineaUseCase } from 'modules/Lineas/application/usecase/create-linea.usecase'
import { FindLineaUseCase } from 'modules/Lineas/application/usecase/find-linea.usecase'

@Injectable()
export class LineaService {
  constructor(
    private readonly createLineaUseCase: CreateLineaUseCase,
    private readonly findLilenaUseCase: FindLineaUseCase
  ) {}

  async createLinea(data: LineaDTOs.Create): Promise<LineaDTOs.PublicData> {
    return this.createLineaUseCase.execute(data)
  }

  async findLinea(id_linea: string): Promise<LineaDTOs.PublicData> {
    return this.findLilenaUseCase.execute(id_linea)
  }
}

import { Injectable } from '@nestjs/common'
import { LineaDTOs } from 'modules/Lineas/application/dtos/linea.dto'
import { AllLineasUseCase } from 'modules/Lineas/application/usecase/allLineas.usecase'
import { CreateLineaUseCase } from 'modules/Lineas/application/usecase/create-linea.usecase'
import { FindLineaUseCase } from 'modules/Lineas/application/usecase/find-linea.usecase'

@Injectable()
export class LineaService {
  constructor(
    private readonly createLineaUseCase: CreateLineaUseCase,
    private readonly findLilenaUseCase: FindLineaUseCase,
    private readonly allLineasUseCase: AllLineasUseCase
  ) {}

  async createLinea(data: LineaDTOs.Create): Promise<LineaDTOs.PublicData> {
    return this.createLineaUseCase.execute(data)
  }

  async findLinea(id_linea: string): Promise<LineaDTOs.PublicData> {
    return this.findLilenaUseCase.execute(id_linea)
  }

  async allLineas(): Promise<LineaDTOs.PublicData[]> {
    return await this.allLineasUseCase.exucute()
  }
}

import { Inject, Injectable } from '@nestjs/common'
import { IEstacionRepository } from 'core/repositories/estacion.repositorie'
import { EstacionDTOs } from '../dtos/estacion.dto'
import { Estacion } from 'core/entities/Estacion'
import { ESTACIONES_REPOSITORY } from 'shared/const/tokensNest'
import { LineaEstacionService } from 'modules/LineaEstacion/infrastructure/service/lineaEstacion.service'
import { LineaService } from 'modules/Lineas/infrastructure/services/linea.service'

@Injectable()
export class CreateEstacionUseCase {
  constructor(
    @Inject(ESTACIONES_REPOSITORY)
    private readonly estacionRepo: IEstacionRepository,
    private readonly lineaService: LineaService,
    private readonly LineaEstacionService: LineaEstacionService
  ) {}

  async execute(data: EstacionDTOs.Create): Promise<EstacionDTOs.PublicData> {
    const linea = await this.lineaService.findLinea(data.id_linea)
    const estacion = Estacion.createEstacion(data)
    const createdEstacion = await this.estacionRepo.createEstacion(estacion)

    await this.LineaEstacionService.createLineaEstacion({
      id_linea: linea.id_linea!,
      id_estacion: createdEstacion.getIdEstacion
    })

    return createdEstacion.getPublicData
  }
}

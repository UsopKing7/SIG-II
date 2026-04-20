import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common'
import { EstacionService } from '../services/estacion.service'
import { type EstacionDTOs } from 'modules/Estacion/application/dtos/estacion.dto'

@Controller('api')
export class EstacionController {
  constructor(private readonly estacionService: EstacionService) {}

  @Post('lineas/:id_linea/estaciones')
  @HttpCode(201)
  async createEstaciones(
    @Param('id_linea') id_linea: string,
    @Body() data: EstacionDTOs.Create
  ): Promise<EstacionDTOs.PublicData> {
    return await this.estacionService.createEstacion({ ...data, id_linea })
  }
}

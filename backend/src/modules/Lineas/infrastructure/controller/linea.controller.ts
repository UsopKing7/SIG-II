import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { LineaService } from '../services/linea.service'
import { type LineaDTOs } from 'modules/Lineas/application/dtos/linea.dto'

@Controller('api')
export class LineaController {
  constructor(private readonly lineaService: LineaService) {}

  @Post('/create/linea')
  @HttpCode(201)
  async createLinea(@Body() data: LineaDTOs.Create) {
    return await this.lineaService.createLinea(data)
  }

  @Get('/lineas')
  async allLineas() {
    return await this.lineaService.allLineas()
  }
}

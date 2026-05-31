import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { CableService } from '../service/cable.service'
import { type CableCommand } from 'modules/Cable/application/commands/cable.command'

@Controller('cable')
export class CableController {
  constructor(private readonly cableService: CableService) {}

  @Post('create/:id_linea')
  @HttpCode(201)
  async createCable(@Param('id_linea') id_linea: string, @Body() data: CableCommand.Create) {
    return await this.cableService.createCable({ ...data, id_linea })
  }

  @Get()
  async getCable() {
    return await this.cableService.getCable()
  }
}

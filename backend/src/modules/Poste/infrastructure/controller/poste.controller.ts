import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { PostService } from '../service/poste.service'
import { type PosteCommands } from 'modules/Poste/application/commands/poste.commands'

@Controller('api/poste')
export class PosteController {
  constructor(private readonly posteService: PostService) {}

  @Post('create/:id_linea')
  @HttpCode(201)
  async createPoste(@Param('id_linea') id_linea: string, @Body() data: PosteCommands.Create) {
    return await this.posteService.createPoste({ ...data, id_linea })
  }

  @Get()
  async getPostes() {
    return await this.posteService.getPostes()
  }
}

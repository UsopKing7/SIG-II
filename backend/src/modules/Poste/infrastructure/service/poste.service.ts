import { Injectable } from '@nestjs/common'
import { PosteCommands } from 'modules/Poste/application/commands/poste.commands'
import { CreatePosteUseCase } from 'modules/Poste/application/usecase/createPoste.usecase'
import { GetPostesUseCase } from 'modules/Poste/application/usecase/getPostes.usecase'

@Injectable()
export class PostService {
  constructor(
    private readonly createPosteUseCase: CreatePosteUseCase,
    private readonly getPosteUseCase: GetPostesUseCase
  ) {}

  async createPoste(data: PosteCommands.Create) {
    return await this.createPosteUseCase.execute(data)
  }

  async getPostes() {
    return await this.getPosteUseCase.execute()
  }
}

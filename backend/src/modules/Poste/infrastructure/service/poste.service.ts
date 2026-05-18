import { Injectable } from '@nestjs/common'
import { PosteCommands } from 'modules/Poste/application/commands/poste.commands'
import { CreatePosteUseCase } from 'modules/Poste/application/usecase/createPoste.usecase'

@Injectable()
export class PostService {
  constructor(private readonly createPosteUseCase: CreatePosteUseCase) {}

  async createPoste(data: PosteCommands.Create) {
    return await this.createPosteUseCase.execute(data)
  }
}

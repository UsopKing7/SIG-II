import { Inject, Injectable } from '@nestjs/common'
import { IPosteRepository } from 'core/repositories/poste.repositorie'
import { POSTES_REPOSITORY } from 'shared/const/tokensNest'
import { PosteCommands } from '../commands/poste.commands'
import { Poste } from 'core/entities/Poste'

@Injectable()
export class CreatePosteUseCase {
  constructor(
    @Inject(POSTES_REPOSITORY)
    private readonly posteRepository: IPosteRepository
  ) {}

  async execute(data: PosteCommands.Create): Promise<PosteCommands.PublicData> {
    const poste = Poste.create(data)
    const createdPoste = await this.posteRepository.createPoste(poste)
    return createdPoste.getPublicData
  }
}

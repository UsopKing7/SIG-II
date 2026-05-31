import { Inject, Injectable } from '@nestjs/common'
import { IPosteRepository } from 'core/repositories/poste.repositorie'
import { POSTES_REPOSITORY } from 'shared/const/tokensNest'
import { PosteCommands } from '../commands/poste.commands'

@Injectable()
export class GetPostesUseCase {
  constructor(
    @Inject(POSTES_REPOSITORY)
    private readonly posteRepository: IPosteRepository
  ) {}

  async execute(): Promise<PosteCommands.PublicData[]> {
    const postes = await this.posteRepository.getPostes()
    return postes.map(poste => poste.getPublicData)
  }
}

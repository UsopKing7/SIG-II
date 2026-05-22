import { Inject, Injectable } from '@nestjs/common'
import { ICableRepository } from 'core/repositories/cable.repositorie'
import { CableCommand } from '../commands/cable.command'
import { Cable } from 'core/entities/Cable'
import { CABLES_REPOSITORY } from 'shared/const/tokensNest'

@Injectable()
export class CreateCableUseCase {
  constructor(
    @Inject(CABLES_REPOSITORY)
    private readonly cableRepository: ICableRepository
  ) {}

  async execute(data: CableCommand.Create): Promise<CableCommand.PublicData> {
    const cableCreated = Cable.create(data)
    const cable = await this.cableRepository.createCable(cableCreated)

    return cable.getPublicData
  }
}

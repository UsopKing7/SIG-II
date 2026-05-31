import { Inject, Injectable } from '@nestjs/common'
import { ICableRepository } from 'core/repositories/cable.repositorie'
import { CABLES_REPOSITORY } from 'shared/const/tokensNest'
import { CableCommand } from '../commands/cable.command'

@Injectable()
export class GetCableUseCase {
  constructor(
    @Inject(CABLES_REPOSITORY)
    private readonly cableRepository: ICableRepository
  ) {}

  async execute(): Promise<CableCommand.PublicData[]> {
    const cables = await this.cableRepository.findAllCable()
    return cables.map(cable => cable.getPublicData)
  }
}

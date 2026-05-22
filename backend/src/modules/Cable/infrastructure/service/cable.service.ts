import { Injectable } from '@nestjs/common'
import { CableCommand } from 'modules/Cable/application/commands/cable.command'
import { CreateCableUseCase } from 'modules/Cable/application/usecase/createCable.usecase'

@Injectable()
export class CableService {
  constructor(private readonly createCableUseCase: CreateCableUseCase) {}

  async createCable(data: CableCommand.Create) {
    return await this.createCableUseCase.execute(data)
  }
}

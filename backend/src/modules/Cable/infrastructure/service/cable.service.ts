import { Injectable } from '@nestjs/common'
import { CableCommand } from 'modules/Cable/application/commands/cable.command'
import { CreateCableUseCase } from 'modules/Cable/application/usecase/createCable.usecase'
import { GetCableUseCase } from 'modules/Cable/application/usecase/getCable.usecase'

@Injectable()
export class CableService {
  constructor(
    private readonly createCableUseCase: CreateCableUseCase,
    private readonly getCableUseCase: GetCableUseCase
  ) {}

  async createCable(data: CableCommand.Create) {
    return await this.createCableUseCase.execute(data)
  }

  async getCable() {
    return await this.getCableUseCase.execute()
  }
}

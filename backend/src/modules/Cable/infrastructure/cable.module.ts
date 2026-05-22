import { Module } from '@nestjs/common'
import { PrismaModule } from 'shared/config/prisma/prisma.module'
import { CableController } from './controller/cable.controller'
import { CableService } from './service/cable.service'
import { CreateCableUseCase } from '../application/usecase/createCable.usecase'
import { CablePrisma } from './prisma/cable.prisma'
import { CABLES_REPOSITORY } from 'shared/const/tokensNest'

@Module({
  imports: [PrismaModule],
  controllers: [CableController],
  providers: [
    CableService,
    CreateCableUseCase,
    {
      provide: CABLES_REPOSITORY,
      useClass: CablePrisma
    }
  ]
})
export class CableModule {}

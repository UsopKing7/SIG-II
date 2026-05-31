import { Module } from '@nestjs/common'
import { PrismaModule } from 'shared/config/prisma/prisma.module'
import { LineaController } from './controller/linea.controller'
import { LineaService } from './services/linea.service'
import { CreateLineaUseCase } from '../application/usecase/create-linea.usecase'
import { LINEAS_REPOSITORY } from 'shared/const/tokensNest'
import { LineaPrisma } from './prisma/linea.prisma'
import { FindLineaUseCase } from '../application/usecase/find-linea.usecase'
import { AllLineasUseCase } from '../application/usecase/allLineas.usecase'

@Module({
  imports: [PrismaModule],
  controllers: [LineaController],
  providers: [
    LineaService,
    CreateLineaUseCase,
    FindLineaUseCase,
    AllLineasUseCase,
    {
      provide: LINEAS_REPOSITORY,
      useClass: LineaPrisma
    }
  ],
  exports: [LineaService, { provide: LINEAS_REPOSITORY, useClass: LineaPrisma }]
})
export class LineaModule {}

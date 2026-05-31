import { Module } from '@nestjs/common'
import { PrismaModule } from 'shared/config/prisma/prisma.module'
import { EstacionController } from './controller/estacion.controller'
import { EstacionService } from './services/estacion.service'
import { CreateEstacionUseCase } from '../application/usecase/create-estacion.usecase'
import { ESTACIONES_REPOSITORY } from 'shared/const/tokensNest'
import { EstacionPrisma } from './prisma/estacion.prisma'
import { LineaModule } from 'modules/Lineas/infrastructure/linea.module'
import { LineaEstacionModule } from 'modules/LineaEstacion/infrastructure/lineaEstacion.module'
import { GetEstacionUseCase } from '../application/usecase/getEstacion.usecase'

@Module({
  imports: [PrismaModule, LineaModule, LineaEstacionModule],
  controllers: [EstacionController],
  providers: [
    EstacionService,
    CreateEstacionUseCase,
    GetEstacionUseCase,
    {
      provide: ESTACIONES_REPOSITORY,
      useClass: EstacionPrisma
    }
  ]
})
export class EstacionModule {}

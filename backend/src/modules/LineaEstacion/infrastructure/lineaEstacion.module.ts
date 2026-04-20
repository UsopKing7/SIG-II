import { Module } from '@nestjs/common'
import { PrismaModule } from 'shared/config/prisma/prisma.module'
import { LineaEstacionService } from './service/lineaEstacion.service'
import { CreateLineaEstacionUseCase } from '../application/usecase/create-lineaEstacion.usecase'
import { LINEA_ESTACION_REPOSITORY } from 'shared/const/tokensNest'
import { LineaEstacionPrisma } from './prisma/lineaEstacion.prisma'

@Module({
  imports: [PrismaModule],
  providers: [
    LineaEstacionService,
    CreateLineaEstacionUseCase,
    {
      provide: LINEA_ESTACION_REPOSITORY,
      useClass: LineaEstacionPrisma
    }
  ],

  exports: [LineaEstacionService]
})
export class LineaEstacionModule {}

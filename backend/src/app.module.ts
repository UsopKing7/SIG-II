import { Module } from '@nestjs/common'
import { CableModule } from 'modules/Cable/infrastructure/cable.module'
import { EstacionModule } from 'modules/Estacion/infrastructure/estacion.module'
import { LineaEstacionModule } from 'modules/LineaEstacion/infrastructure/lineaEstacion.module'
import { LineaModule } from 'modules/Lineas/infrastructure/linea.module'
import { PosteModule } from 'modules/Poste/infrastructure/poste.module'
import { PrismaModule } from 'shared/config/prisma/prisma.module'

@Module({
  imports: [
    PrismaModule,
    LineaModule,
    EstacionModule,
    LineaEstacionModule,
    PosteModule,
    CableModule
  ]
})
export class AppModule {}

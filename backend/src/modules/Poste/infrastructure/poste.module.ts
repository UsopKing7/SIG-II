import { Module } from '@nestjs/common'
import { PrismaModule } from 'shared/config/prisma/prisma.module'
import { PosteController } from './controller/poste.controller'
import { CreatePosteUseCase } from '../application/usecase/createPoste.usecase'
import { PostService } from './service/poste.service'
import { POSTES_REPOSITORY } from 'shared/const/tokensNest'
import { PostePrisma } from './prisma/poste.prisma'

@Module({
  imports: [PrismaModule],
  controllers: [PosteController],
  providers: [
    PostService,
    CreatePosteUseCase,
    {
      provide: POSTES_REPOSITORY,
      useClass: PostePrisma
    }
  ]
})
export class PosteModule {}

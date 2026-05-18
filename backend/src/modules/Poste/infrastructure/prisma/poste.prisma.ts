import { Injectable } from '@nestjs/common'
import { Poste } from 'core/entities/Poste'
import { IPosteRepository } from 'core/repositories/poste.repositorie'
import { PrismaService } from 'shared/config/prisma/prisma.service'

@Injectable()
export class PostePrisma implements IPosteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPoste(data: Poste): Promise<Poste> {
    await this.prisma.db
      .$executeRaw`INSERT INTO "Poste" ("id_poste", "id_linea", "geom", "createdAt", "updatedAt") VALUES (${data.getIdPoste}, ${data.getIdLinea}, ST_GeomFromText(${data.getGeom.wkt}, 4326), NOW(), NOW());`

    return data
  }
}

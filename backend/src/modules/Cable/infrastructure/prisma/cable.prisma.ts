import { Injectable } from '@nestjs/common'
import { Cable } from 'core/entities/Cable'
import { ICableRepository } from 'core/repositories/cable.repositorie'
import { PrismaService } from 'shared/config/prisma/prisma.service'

@Injectable()
export class CablePrisma implements ICableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCable(data: Cable): Promise<Cable> {
    console.log({
      idCable: data.getIdCable,
      idLinea: data.getIdLinea,
      geom: data.getGeom
    })
    await this.prisma.db
      .$queryRaw`INSERT INTO "Cable" ("id_cable", "id_linea", "geom", "createdAt", "updatedAt") VALUES (${data.getIdCable}, ${data.getIdLinea}, ST_GeomFromText(${data.getGeom.wkt}, 4326), NOW(), NOW());`

    return data
  }
}

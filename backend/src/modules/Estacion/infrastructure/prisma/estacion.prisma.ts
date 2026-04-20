import { Injectable } from '@nestjs/common'
import { Estacion } from 'core/entities/Estacion'
import { IEstacionRepository } from 'core/repositories/estacion.repositorie'
import { PrismaService } from 'shared/config/prisma/prisma.service'

@Injectable()
export class EstacionPrisma implements IEstacionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createEstacion(data: Estacion): Promise<Estacion> {
    await this.prisma.db.$executeRaw`
      INSERT INTO "Estacion" ("id_estacion", "nombre", "color", "geom", "createdAt", "updatedAt") VALUES (${data.getIdEstacion}, ${data.getNombre}, ${data.getColor}, ST_GeomFromText(${data.getGeom.wkt}, 4326), NOW(), NOW());`
    return data
  }
}

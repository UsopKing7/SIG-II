import { Injectable } from '@nestjs/common'
import { Estacion } from 'core/entities/Estacion'
import { IEstacionRepository } from 'core/repositories/estacion.repositorie'
import { PrismaService } from 'shared/config/prisma/prisma.service'

interface EstacionRaw {
  id_estacion: string
  nombre: string
  color: string
  geom: {
    type: string
    coordinates: [number, number]
    wkt: string
  }
}

@Injectable()
export class EstacionPrisma implements IEstacionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createEstacion(data: Estacion): Promise<Estacion> {
    await this.prisma.db.$executeRaw`
      INSERT INTO "Estacion" ("id_estacion", "nombre", "color", "geom", "createdAt", "updatedAt") VALUES (${data.getIdEstacion}, ${data.getNombre}, ${data.getColor}, ST_GeomFromText(${data.getGeom.wkt}, 4326), NOW(), NOW());`
    return data
  }

  async findEstacionById(): Promise<Estacion[]> {
    const result = await this.prisma.db.$queryRaw<EstacionRaw[]>`
    SELECT 
      id_estacion,
      nombre,
      color,
      jsonb_build_object(
        'type',        ST_GeometryType(geom),
        'coordinates', ST_AsGeoJSON(geom)::json->'coordinates',
        'wkt',         ST_AsText(geom)
      ) as geom
    FROM "Estacion"
  `

    if (!result || result.length === 0) return []

    return result.map(estacion =>
      Estacion.createEstacion({
        id_estacion: estacion.id_estacion,
        nombre: estacion.nombre,
        color: estacion.color,
        geom: estacion.geom
      })
    )
  }
}

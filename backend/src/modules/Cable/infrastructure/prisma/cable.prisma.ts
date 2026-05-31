import { Injectable } from '@nestjs/common'
import { Cable } from 'core/entities/Cable'
import { ICableRepository } from 'core/repositories/cable.repositorie'
import { PrismaService } from 'shared/config/prisma/prisma.service'

interface CableRaw {
  id_cable: string
  id_linea: string
  geom: {
    type: string
    coordinates: [number, number]
    wkt: string
  }
}

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

  async findAllCable(): Promise<Cable[]> {
    const cables = await this.prisma.db.$queryRaw<CableRaw[]>`
      SELECT 
        id_cable,
        id_linea,
        jsonb_build_object(
          'type',        ST_GeometryType(geom),
          'coordinates', ST_AsGeoJSON(geom)::json->'coordinates',
          'wkt',         ST_AsText(geom)
        ) as geom
      FROM "Cable"
    `

    if (!cables || cables.length === 0) return []

    return cables.map(cable =>
      Cable.create({
        id_cable: cable.id_cable,
        id_linea: cable.id_linea,
        geom: cable.geom
      })
    )
  }
}

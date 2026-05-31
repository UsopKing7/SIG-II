import { Injectable } from '@nestjs/common'
import { Poste } from 'core/entities/Poste'
import { IPosteRepository } from 'core/repositories/poste.repositorie'
import { PrismaService } from 'shared/config/prisma/prisma.service'

interface PosteRaw {
  id_poste: string
  id_linea: string
  geom: {
    type: string
    coordinates: [number, number]
    wkt: string
  }
}

@Injectable()
export class PostePrisma implements IPosteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPoste(data: Poste): Promise<Poste> {
    await this.prisma.db
      .$executeRaw`INSERT INTO "Poste" ("id_poste", "id_linea", "geom", "createdAt", "updatedAt") VALUES (${data.getIdPoste}, ${data.getIdLinea}, ST_GeomFromText(${data.getGeom.wkt}, 4326), NOW(), NOW());`

    return data
  }

  async getPostes(): Promise<Poste[]> {
    const poster = await this.prisma.db.$queryRaw<PosteRaw[]>`
  SELECT 
    id_poste,
    id_linea,
    jsonb_build_object(
      'type',        ST_GeometryType(geom),
      'coordinates', ST_AsGeoJSON(geom)::json->'coordinates',
      'wkt',         ST_AsText(geom)
    ) as geom
  FROM "Poste"
`

    return poster.map(poste => {
      return Poste.create({
        id_poste: poste.id_poste,
        id_linea: poste.id_linea,
        geom: poste.geom
      })
    })
  }
}

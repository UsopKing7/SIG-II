import { Injectable } from '@nestjs/common'
import { LineaEstacion } from 'core/entities/LineaEstacion'
import { ILineaEstacionRepositorie } from 'core/repositories/lineaEstaciones.repositorie'
import { PrismaService } from 'shared/config/prisma/prisma.service'

@Injectable()
export class LineaEstacionPrisma implements ILineaEstacionRepositorie {
  constructor(private readonly prisma: PrismaService) {}

  async createLineaEstacion(data: LineaEstacion): Promise<void> {
    await this.prisma.db.lineaEstacion.create({
      data: {
        id_linea: data.getidLinea,
        id_estacion: data.getidEstacion
      }
    })
  }

  async findLineaEstacionById(
    id_linea: string,
    id_estacion: string
  ): Promise<LineaEstacion | null> {
    const lineaEstacion = await this.prisma.db.lineaEstacion.findUnique({
      where: {
        id_linea_id_estacion: {
          id_linea,
          id_estacion
        }
      }
    })

    if (!lineaEstacion) {
      return null
    }

    return LineaEstacion.createLienaEstacion(lineaEstacion.id_linea, lineaEstacion.id_estacion)
  }
}

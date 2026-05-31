import { Injectable } from '@nestjs/common'
import { Linea } from 'core/entities/Linea'
import { EnumColorLinea, EnumEstadoLinea } from 'core/enums/linea.enum'
import { ILineasRepository } from 'core/repositories/lineas.repositorie'
import { PrismaService } from 'shared/config/prisma/prisma.service'

@Injectable()
export class LineaPrisma implements ILineasRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createLinea(data: Linea): Promise<Linea> {
    const createdLinea = await this.prisma.db.linea.create({
      data: {
        nombre_linea: data.getNombreLinea,
        color: data.getColor,
        cantidad_cabinas: data.getCantidadCabinas,
        estado: data.getEstado
      }
    })

    return Linea.fromPersistence({
      id_linea: createdLinea.id_linea,
      nombre_linea: createdLinea.nombre_linea,
      color: createdLinea.color as EnumColorLinea,
      cantidad_cabinas: createdLinea.cantidad_cabinas,
      estado: createdLinea.estado as EnumEstadoLinea
    })
  }

  async findLineaByColor(color: EnumColorLinea): Promise<boolean> {
    const linea = await this.prisma.db.linea.findUnique({
      where: {
        color
      }
    })

    return !!linea
  }

  async findLineaById(id_linea: string): Promise<Linea | null> {
    const linea = await this.prisma.db.linea.findFirst({
      where: {
        id_linea
      }
    })

    if (!linea) return null
    return Linea.fromPersistence({
      id_linea: linea.id_linea,
      nombre_linea: linea.nombre_linea,
      color: linea.color as EnumColorLinea,
      cantidad_cabinas: linea.cantidad_cabinas,
      estado: linea.estado as EnumEstadoLinea
    })
  }

  async AllLineas(): Promise<Linea[]> {
    const lineas = await this.prisma.db.linea.findMany()
    return lineas.map(linea => {
      return Linea.fromPersistence({
        id_linea: linea.id_linea,
        nombre_linea: linea.nombre_linea,
        color: linea.color as EnumColorLinea,
        cantidad_cabinas: linea.cantidad_cabinas,
        estado: linea.estado as EnumEstadoLinea
      })
    })
  }
}

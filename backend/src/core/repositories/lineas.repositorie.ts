import { Linea } from 'core/entities/Linea'
import { EnumColorLinea } from 'core/enums/linea.enum'

export abstract class ILineasRepository {
  abstract createLinea(data: Linea): Promise<Linea>
  abstract findLineaByColor(color: EnumColorLinea): Promise<boolean>
  abstract findLineaById(id_linea: string): Promise<Linea | null>
  abstract AllLineas(): Promise<Linea[]>
}

import { Cable } from 'core/entities/Cable'

export abstract class ICableRepository {
  abstract createCable(data: Cable): Promise<Cable>
  abstract findAllCable(): Promise<Cable[]>
}

import { Poste } from 'core/entities/Poste'

export abstract class IPosteRepository {
  abstract createPoste(data: Poste): Promise<Poste>
  abstract getPostes(): Promise<Poste[]>
}

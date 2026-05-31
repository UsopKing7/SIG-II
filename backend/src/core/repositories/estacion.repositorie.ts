import { Estacion } from 'core/entities/Estacion'

export abstract class IEstacionRepository {
  abstract createEstacion(data: Estacion): Promise<Estacion>
  abstract findEstacionById(): Promise<Estacion[]>
}

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { env } from 'shared/const/env'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.enableShutdownHooks()
  await app.listen(env.PORT)
  console.table({
    URL: `http://0.0.0.0:${env.PORT}`
  })
}
void bootstrap()

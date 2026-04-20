import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly db: PrismaClient
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env['DATABASE_URL']
    })

    this.db = new PrismaClient({ adapter })
  }

  async onModuleInit() {
    await this.db.$connect()
    this.logger.log('[+][OK][PRISMA] Connected to database successfully')
  }

  async onModuleDestroy() {
    await this.db.$disconnect()
    this.logger.log('[-][OK][PRISMA] Disconnected from database successfully')
  }
}

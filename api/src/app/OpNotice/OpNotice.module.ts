import { MiddlewareConsumer } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OpNoticeController } from './OpNotice.controller'
import { OpNoticeEntity } from './OpNotice.entity'
import { OpNoticeService } from './OpNotice.service'

@Module({
  imports: [TypeOrmModule.forFeature([OpNoticeEntity])],
  providers: [OpNoticeService],
  controllers: [OpNoticeController],
  exports: [OpNoticeService],
})
export class OpNoticeModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(AuthMiddleware)
    //   .forRoutes(
    //     { path: 'user', method: RequestMethod.GET },
    //     { path: 'user', method: RequestMethod.PUT }
    //   )
  }
}

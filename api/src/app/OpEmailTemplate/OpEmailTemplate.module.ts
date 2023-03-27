import { MiddlewareConsumer } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OpEmailTemplateController } from './OpEmailTemplate.controller'
import { OpEmailTemplateEntity } from './OpEmailTemplate.entity'
import { OpEmailTemplateService } from './OpEmailTemplate.service'

@Module({
  imports: [TypeOrmModule.forFeature([OpEmailTemplateEntity])],
  providers: [OpEmailTemplateService],
  controllers: [OpEmailTemplateController],
  exports: [OpEmailTemplateService],
})
export class OpEmailTemplateModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(AuthMiddleware)
    //   .forRoutes(
    //     { path: 'user', method: RequestMethod.GET },
    //     { path: 'user', method: RequestMethod.PUT }
    //   )
  }
}

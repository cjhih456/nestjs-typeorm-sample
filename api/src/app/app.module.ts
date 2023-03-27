import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { validate } from '#helpers/ConfigValidator'
import { OpNoticeModule } from './OpNotice/OpNotice.module'
import { OpEmailTemplateModule } from './OpEmailTemplate/OpEmailTemplate.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
      validate: validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          autoLoadEntities: true,
          host: config.get('MAINDB_HOST'),
          port: config.get('MAINDB_PORT'),
          database: config.get('MAINDB_DATABASE') as string,
          username: config.get('MAINDB_USERNAME'),
          password: config.get('MAINDB_PASSWORD'),
          type: config.get('MAINDB_DIALECT') as any,
          logging: false,
          synchronize: true,
        }
      },
    }),
    OpNoticeModule,
    OpEmailTemplateModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {}

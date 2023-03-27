import { Test, TestingModule } from '@nestjs/testing'
import { OpEmailTemplateController } from './OpEmailTemplate.controller'
import { OpEmailTemplateService } from './OpEmailTemplate.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OpEmailTemplateEntity } from './OpEmailTemplate.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { validate } from '#helpers/ConfigValidator'
import { OpEmailTemplateData } from './OpEmailTemplate.interface'

describe('OpEmailTemplate (e2e)', () => {
  const opEmailTemplateSampleData = {
    idx: 0,
    name: 'test',
    serviceKey: `serviceKey${new Date().getTime()}`,
    titleEn: 'title',
    titleKo: '제목',
    contentEn: 'content',
    contentKo: '내용',
  } as OpEmailTemplateData
  let opEmailTemplateController: OpEmailTemplateController
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
            console.log
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
        TypeOrmModule.forFeature([OpEmailTemplateEntity]),
      ],
      controllers: [OpEmailTemplateController],
      providers: [OpEmailTemplateService],
    }).compile()
    opEmailTemplateController = moduleFixture.get<OpEmailTemplateController>(
      OpEmailTemplateController
    )
  })
  describe('이메일 템플릿 생성', () => {
    it('/email (PUT) - create', async () => {
      const { idx, ...opEmailTemplateInfoOnly } = opEmailTemplateSampleData
      const result = await opEmailTemplateController.createEmailTemplate(
        opEmailTemplateInfoOnly
      )
      opEmailTemplateSampleData.idx = result.data?.idx || 0
      expect(result.data).toBeInstanceOf(OpEmailTemplateEntity)
    })
  })
  describe('이메일 템플릿 활동', () => {
    it('/email/list (GET)', async () => {
      const result = await opEmailTemplateController.getEmailTemplateList({
        pageSize: 10,
        pageNumber: 1,
      })
      expect(result.data).toBeInstanceOf(Array<OpEmailTemplateEntity>)
    })
    it(`/email/{idx} (GET)`, async () => {
      const result = await opEmailTemplateController.getEmailTemplateByIdx(
        opEmailTemplateSampleData.idx || 0
      )
      expect(result.data).toBeInstanceOf(OpEmailTemplateEntity)
    })
    it(`/email/{idx} (POST)`, async () => {
      opEmailTemplateSampleData.contentEn = 'testtest'
      const result = await opEmailTemplateController.updateEmailTemplateByIdx(
        opEmailTemplateSampleData.idx || 0,
        opEmailTemplateSampleData
      )
      expect(result.data).toBeInstanceOf(OpEmailTemplateEntity)
    })
  })
  describe('이메일 템플릿 제거', () => {
    it(`/email/{idx} (DELETE)`, async () => {
      const result = await opEmailTemplateController.deleteEmailTemplateByIdx(
        opEmailTemplateSampleData.idx || 0
      )
      expect(result.code).toBe(200)
    })
  })
})

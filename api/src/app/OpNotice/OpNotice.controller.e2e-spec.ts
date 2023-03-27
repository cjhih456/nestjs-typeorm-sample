import { Test, TestingModule } from '@nestjs/testing'
import { OpNoticeController } from './OpNotice.controller'
import { OpNoticeService } from './OpNotice.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OpNoticeEntity } from './OpNotice.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { validate } from '#helpers/ConfigValidator'

describe('OpNotice (e2e)', () => {
  const opNoticeSampleData = {
    idx: 0,
    noticeType: '',
    titleKo: '테스트',
    contentKo: '테스트 컨탠츠',
    titleEn: 'test',
    contentEn: 'test content',
    regAdm: 'test comment',
  }
  let opNoticeController: OpNoticeController
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
        TypeOrmModule.forFeature([OpNoticeEntity]),
      ],
      controllers: [OpNoticeController],
      providers: [OpNoticeService],
    }).compile()
    opNoticeController = moduleFixture.get<OpNoticeController>(OpNoticeController)
  })
  describe('공지사항 생성', () => {
    it('/notice (PUT) - create', async () => {
      const { idx, ...opNoticeInfoOnly } = opNoticeSampleData
      const result = await opNoticeController.createNotice(opNoticeInfoOnly)
      opNoticeSampleData.idx = result.data?.idx || 0
      expect(result.data).toBeInstanceOf(OpNoticeEntity)
    })
  })
  describe('공지사항 활동', () => {
    it('/notice/list (GET)', async () => {
      console.log(opNoticeController)
      const result = await opNoticeController.findWithPaging({
        pageSize: 10,
        pageNumber: 1,
      })
      expect(result.data).toBeInstanceOf(Array<OpNoticeEntity>)
    })
    it(`/notice/{idx} (GET)`, async () => {
      const result = await opNoticeController.getNoticeByIdx(opNoticeSampleData.idx)
      expect(result.data).toBeInstanceOf(OpNoticeEntity)
    })
    it(`/notice/{idx} (POST)`, async () => {
      opNoticeSampleData.contentEn = 'testtest'
      const result = await opNoticeController.updateNoticeByIdx(
        opNoticeSampleData.idx,
        opNoticeSampleData
      )
      expect(result.data).toBeInstanceOf(OpNoticeEntity)
    })
  })
  describe('공지사항 제거', () => {
    it(`/notice/{idx} (DELETE)`, async () => {
      const result = await opNoticeController.deleteNoticeByIdx(opNoticeSampleData.idx)
      expect(result.code).toBe(200)
    })
  })
})

import { Controller } from '@nestjs/common'
import { OpNoticeService } from './OpNotice.service'
import { ApiTags } from '@nestjs/swagger'
import { NestControllerGenerator } from '#helpers/ServiceGenerator'
import { OpNoticeEntity } from './OpNotice.entity'
import { OpNoticeData } from './OpNotice.interface'

@ApiTags('OpNotice')
@Controller('/notice')
export class OpNoticeController extends NestControllerGenerator<
  OpNoticeEntity,
  OpNoticeData,
  OpNoticeService
> {
  constructor(readonly opNoticeService: OpNoticeService) {
    super(opNoticeService)
  }
}

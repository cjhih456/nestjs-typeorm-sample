import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { OpNoticeEntity } from './OpNotice.entity'
import { Repository } from 'typeorm'
import { NestServiceGenerator } from '#helpers/ServiceGenerator'

@Injectable()
export class OpNoticeService extends NestServiceGenerator<OpNoticeEntity> {
  base = new OpNoticeEntity()
  constructor(
    @InjectRepository(OpNoticeEntity)
    private readonly opNoticeRepositry: Repository<OpNoticeEntity>
  ) {
    super(opNoticeRepositry, OpNoticeEntity)
  }
}

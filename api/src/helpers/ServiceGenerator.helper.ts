// This is a Nest service generator that creates a generic service for any TypeORM entity
import { DbNotFoundException } from '#exceptions/DbNotFoundException'
import { Body, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import _ from 'lodash'
import {
  BeforeInsert,
  BeforeUpdate,
  Between,
  Column,
  FindOneOptions,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm'
import { OpNoticePagingData } from '../app/OpNotice/OpNotice.interface'
import { DateHelpers } from './DateHelpers.helper'
import { Response } from './ResponseHelper.helper'

export class Base {
  readonly deletedValue = 9
  takeNotDeletedQuery(query: any): any {
    _.merge(query, { where: { useFlag: Not(this.deletedValue) } })
    return query
  }

  @PrimaryGeneratedColumn({ type: 'int', name: 'idx', unsigned: true })
  public idx: number
  @Column('int', {
    name: 'use_flag',
    comment: '1 : 정상 | 9 : 삭제',
    default: () => "'1'",
  })
  public useFlag: number
  @Column('int', { name: 'created_at', default: () => "'0'" })
  public createdAt: number
  @Column('varchar', {
    name: 'set_date',
    length: 45,
    nullable: true,
  })
  setDate: string
  @Column('int', { name: 'deleted_at', default: () => "'0'" })
  public deletedAt: number
  @Column('varchar', {
    name: 'del_date',
    length: 45,
    nullable: true,
  })
  delDate: string
  @BeforeInsert()
  baseInitDate() {
    this.createdAt = DateHelpers.getCurrentUCTimestamp()
    this.setDate = DateHelpers.getCurrentUTCDateTime()
    this.useFlag = 1
  }
  @BeforeUpdate()
  useFlagCheck() {
    if (this.useFlag === this.deletedValue) {
      this.delDate = DateHelpers.getCurrentUTCDateTime()
      this.deletedAt = DateHelpers.getCurrentUCTimestamp()
    }
  }
}

export abstract class NestServiceGenerator<T extends Base> {
  base: T
  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityType: new () => T
  ) {
    this.base = new entityType()
  }
  async findWithPaging(
    pageSize = 10,
    pageNumber = 1,
    startAt?: string,
    finishAt?: string
  ): Promise<T[]> {
    let findOption = undefined
    if (startAt && finishAt)
      findOption = Between(
        DateHelpers.getUTCTimestampFromDateTime(startAt),
        DateHelpers.getUTCTimestampFromDateTime(finishAt)
      )
    else if (startAt)
      findOption = MoreThanOrEqual(DateHelpers.getUTCTimestampFromDateTime(startAt))
    else if (finishAt)
      findOption = LessThanOrEqual(DateHelpers.getUTCTimestampFromDateTime(finishAt))
    const tempModel = new this.entityType()
    return await this.entityRepository.find(
      tempModel.takeNotDeletedQuery({
        take: pageSize,
        skip: pageSize * (pageNumber - 1),
        where: {
          createdAt: findOption,
        },
        order: {
          createdAt: 'DESC',
        },
      })
    )
  }

  async findOne(where: FindOneOptions<any>): Promise<T> {
    const result = await this.entityRepository.findOne(where)
    if (!result) {
      throw new DbNotFoundException('Not Found Data')
    }
    return result
  }

  async create(data: Partial<T>): Promise<T> {
    const block = new this.entityType()
    Object.assign(block, data)
    // @ts-ignore
    return await this.entityRepository.save(block)
  }

  async update(where: FindOneOptions<any>, data: Partial<any>): Promise<Partial<T>> {
    const result = await this.findOne(where)
    Object.assign(result, data)
    // @ts-ignorea
    return await this.entityRepository.save(result)
  }

  async delete(where: FindOneOptions<any>): Promise<Partial<T>> {
    return await this.update(where, { useFlag: this.base.deletedValue })
  }
  async deleteByIdx(idx: number) {
    return await this.delete({ where: { idx: idx } })
  }
}

export abstract class NestControllerGenerator<
  T extends Base,
  D extends Partial<T>,
  S extends NestServiceGenerator<T>
> {
  constructor(readonly service: S) {}
  @Get('list')
  async findWithPaging(@Query() pagingData: OpNoticePagingData) {
    const result = await this.service.findWithPaging(
      pagingData.pageSize,
      pagingData.pageNumber,
      pagingData.startAt,
      pagingData.finishAt
    )
    return Response.success(result)
  }
  @Put()
  async createNotice(@Body() body: D) {
    const result = await this.service.create(body)
    return Response.success(result)
  }
  @Get(':idx')
  async getNoticeByIdx(@Param('idx') idx: number) {
    const result = await this.service.findOne({ where: { idx: idx } })
    return Response.success(result)
  }
  @Post(':idx')
  async updateNoticeByIdx(@Param('idx') idx: number, @Body() body: D) {
    const result = await this.service.update({ where: { idx: idx } }, body)
    return Response.success(result)
  }
  @Delete(':idx')
  async deleteNoticeByIdx(@Param('idx') idx: number) {
    const result = await this.service.deleteByIdx(idx)
    return Response.success(result)
  }
}

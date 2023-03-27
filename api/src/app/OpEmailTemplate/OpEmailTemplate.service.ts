import { Injectable } from '@nestjs/common'
import { DbNotFoundException } from '#exceptions/DbNotFoundException'
import { InjectRepository } from '@nestjs/typeorm'
import { OpEmailTemplateEntity } from './OpEmailTemplate.entity'
import { Between, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm'
import { DateHelpers } from '#helpers/DateHelpers'
import { OpEmailTemplateData } from './OpEmailTemplate.interface'

@Injectable()
export class OpEmailTemplateService {
  constructor(
    @InjectRepository(OpEmailTemplateEntity)
    private readonly opEmailTemplateRepositry: Repository<OpEmailTemplateEntity>
  ) {}
  /**
   * 이메일 템플릿 목록 조회
   * @param pageSize 페이지 사이즈
   * @param pageNumber 페이지 넘버
   * @param startAt 생성일자 범위 검색 - 시작일자
   * @param finishAt 생성일자 범위 검색 - 종료일자
   * @returns Promise<OpEmailTemplateEntity[]>
   */
  async getEmailTemplateList(
    pageSize = 10,
    pageNumber = 1,
    startAt?: string,
    finishAt?: string
  ) {
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
    const result = await this.opEmailTemplateRepositry.find({
      take: pageSize,
      skip: pageSize * (pageNumber - 1),
      where: {
        useFlag: Not(9),
        createdAt: findOption,
      },
      order: {
        createdAt: 'DESC',
      },
    })
    return result
  }
  /**
   * 이메일 템플릿 생성
   * @param noticeData 이메일 템플릿 정보 데이터
   * @returns 성공한 경우 idx를 포함한 이메일 템플릿 정보값을 반환한다.
   */
  async createEmailTemplate(noticeData: OpEmailTemplateData) {
    const newEmailTemplate = Object.assign(new OpEmailTemplateEntity(), noticeData)
    const result = await this.opEmailTemplateRepositry.save(newEmailTemplate)
    return result
  }

  async getEmailTemplateByIdx(idx: number) {
    const notice = await this.opEmailTemplateRepositry.findOne({
      where: {
        idx,
        useFlag: Not(9),
      },
    })
    if (!notice) {
      throw new DbNotFoundException('NotFound')
    }
    return notice
  }
  async getEmailTemplateByServiceKey(serviceKey: string) {
    const notice = await this.opEmailTemplateRepositry.findOne({
      where: {
        serviceKey,
        useFlag: Not(9),
      },
    })
    if (!notice) {
      throw new DbNotFoundException('NotFound')
    }
    return notice
  }
  /**
   * 이메일 템플릿 정보 수정
   * @param idx 이메일 템플릿 idx
   * @param OpEmailTemplateData 이메일 템플릿 정보데이터
   * @returns 갱신된 이메일 템플릿 정보
   */
  async updateEmailTemplateByIdx(idx: number, noticeData: OpEmailTemplateData) {
    const originEmailTemplateData = await this.getEmailTemplateByIdx(idx)
    const updatedObj = Object.assign(originEmailTemplateData, noticeData)
    return this.opEmailTemplateRepositry.save(updatedObj)
  }
  /**
   * 이메일 템플릿 삭제
   * @param idx 삭제할 이메일 템플릿 idx
   * @returns
   */
  async deleteEmailTemplateByIdx(idx: number) {
    const originEmailTemplateData = await this.getEmailTemplateByIdx(idx)
    const updatedObj = Object.assign(originEmailTemplateData, { useFlag: 9 })
    return this.opEmailTemplateRepositry.save(updatedObj)
  }
}

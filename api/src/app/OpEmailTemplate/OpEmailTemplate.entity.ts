import { DateHelpers } from '#helpers/DateHelpers'
import { BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Index('key_UNIQUE', ['serviceKey'], { unique: true })
@Entity('op_email_template')
export class OpEmailTemplateEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'idx', unsigned: true })
  idx: number

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '목적',
    length: 45,
  })
  name?: string

  @Column('varchar', {
    name: 'service_key',
    nullable: true,
    unique: true,
    comment: '서비스 연동 키',
    length: 45,
  })
  serviceKey?: string

  @Column('varchar', {
    name: 'title_ko',
    nullable: true,
    comment: '메일 제목',
    length: 255,
  })
  titleKo?: string

  @Column('text', { name: 'content_ko', nullable: true, comment: '메일 내용' })
  contentKo?: string

  @Column('varchar', {
    name: 'title_en',
    nullable: true,
    comment: '메일 제목',
    length: 255,
  })
  titleEn?: string

  @Column('text', { name: 'content_en', nullable: true, comment: '메일 내용' })
  contentEn?: string

  @Column('int', {
    name: 'use_flag',
    comment: '1 : 정상 | 9 : 삭제',
    default: () => "'1'",
  })
  useFlag: number

  @Column('varchar', {
    name: 'set_date',
    comment: '생성일시 한국시간 datetime',
    length: 45,
  })
  setDate: string

  @Column('int', {
    name: 'created_at',
    comment: '생성일시 UTC timestamp',
    default: () => "'0'",
  })
  createdAt: number

  @BeforeInsert()
  initDate() {
    this.setDate = DateHelpers.getCurrentUTCDateTime()
    this.createdAt = DateHelpers.getCurrentUCTimestamp()
    this.useFlag = 1
  }
}

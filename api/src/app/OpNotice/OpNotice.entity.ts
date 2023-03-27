import { Base } from '#helpers/ServiceGenerator'
import { BeforeInsert, Column, Entity } from 'typeorm'

@Entity('op_notice')
export class OpNoticeEntity extends Base {
  @Column('varchar', { name: 'notice_type', nullable: true, length: 45 })
  noticeType?: string

  @Column('varchar', { name: 'title_ko', nullable: true, length: 255 })
  titleKo?: string

  @Column('text', { name: 'content_ko', nullable: true })
  contentKo?: string

  @Column('varchar', { name: 'title_en', nullable: true, length: 255 })
  titleEn?: string

  @Column('text', { name: 'content_en', nullable: true })
  contentEn?: string

  @Column('int', { name: 'priority', default: () => "'0'" })
  priority: number

  @Column('int', { name: 'view_hit', nullable: true, default: () => "'0'" })
  viewHit?: number

  @Column('varchar', {
    name: 'reg_adm',
    nullable: true,
    length: 45,
    default: () => "'default'",
  })
  regAdm?: string
}

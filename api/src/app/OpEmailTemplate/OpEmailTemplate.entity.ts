import { Base } from '#helpers/ServiceGenerator'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Index('key_UNIQUE', ['serviceKey'], { unique: true })
@Entity('op_email_template')
export class OpEmailTemplateEntity extends Base {
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
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class OpEmailTemplateData {
  idx?: number
  name?: string
  serviceKey?: string
  titleKo?: string
  contentKo?: string
  titleEn?: string
  contentEn?: string
  useFlag?: number
  setDate?: string
  createdAt?: number
}
export class OpEmailTemplatePagingData {
  @ApiProperty()
  pageSize: number
  @ApiProperty()
  pageNumber: number
  @ApiPropertyOptional()
  startAt?: string
  @ApiPropertyOptional()
  finishAt?: string
}

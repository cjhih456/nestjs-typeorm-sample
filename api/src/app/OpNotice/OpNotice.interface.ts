import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class OpNoticeData {
  @ApiPropertyOptional()
  idx?: number
  @ApiPropertyOptional()
  noticeType?: string
  @ApiPropertyOptional()
  titleKo?: string
  @ApiPropertyOptional()
  contentKo?: string
  @ApiPropertyOptional()
  titleEn?: string
  @ApiPropertyOptional()
  contentEn?: string
  @ApiPropertyOptional()
  priority?: number
  @ApiPropertyOptional()
  viewHit?: number
  @ApiPropertyOptional()
  regAdm?: string
  @ApiPropertyOptional()
  useFlag?: number
}
export class OpNoticePagingData {
  @ApiProperty()
  pageSize: number
  @ApiProperty()
  pageNumber: number
  @ApiPropertyOptional()
  startAt?: string
  @ApiPropertyOptional()
  finishAt?: string
}

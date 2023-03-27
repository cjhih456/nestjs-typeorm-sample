import { Controller, Get, Query, Body, Post, Put, Param, Delete } from '@nestjs/common'
import { OpEmailTemplateService } from './OpEmailTemplate.service'
import { ApiTags } from '@nestjs/swagger'
import { Response } from '#helpers/ResponseHelper'
import {
  OpEmailTemplateData,
  OpEmailTemplatePagingData,
} from './OpEmailTemplate.interface'

@ApiTags('OpEmailTemplate')
@Controller('/email')
export class OpEmailTemplateController {
  constructor(private readonly opEmailTemplateService: OpEmailTemplateService) {}
  @Get('list')
  async getEmailTemplateList(@Query() pagingData: OpEmailTemplatePagingData) {
    const result = await this.opEmailTemplateService.getEmailTemplateList(
      pagingData.pageSize,
      pagingData.pageNumber,
      pagingData.startAt,
      pagingData.finishAt
    )
    return Response.success(result)
  }
  @Put()
  async createEmailTemplate(@Body() body: OpEmailTemplateData) {
    const result = await this.opEmailTemplateService.createEmailTemplate(body)
    return Response.success(result)
  }
  @Get(':idx')
  async getEmailTemplateByIdx(@Param('idx') idx: number) {
    const result = await this.opEmailTemplateService.getEmailTemplateByIdx(idx)
    return Response.success(result)
  }
  @Post(':idx')
  async updateEmailTemplateByIdx(
    @Param('idx') idx: number,
    @Body() body: OpEmailTemplateData
  ) {
    const result = await this.opEmailTemplateService.updateEmailTemplateByIdx(idx, body)
    return Response.success(result)
  }
  @Delete(':idx')
  async deleteEmailTemplateByIdx(@Param('idx') idx: number) {
    const result = await this.opEmailTemplateService.deleteEmailTemplateByIdx(idx)
    return Response.success(result)
  }
}

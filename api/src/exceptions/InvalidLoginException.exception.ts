import { HttpException } from '@nestjs/common'

export class InvalidLoginException extends HttpException {
  constructor(
    errorMessage = '',
    code = 1002,
    errorDetailMessage: any = null,
    status = 400
  ) {
    const responseJson: any = {}

    responseJson.code = code
    responseJson.message = errorMessage
    if (errorDetailMessage) {
      responseJson.detail = errorDetailMessage
    }
    super(responseJson, status)
  }
}

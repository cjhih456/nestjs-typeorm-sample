import { HttpException } from '@nestjs/common'

export class DbNotFoundException extends HttpException {
  constructor(errorMessage = '', code = 1003, errorDetailMessage = null, status = 400) {
    const responseJson: any = {}

    responseJson.code = code
    responseJson.message = errorMessage
    if (errorDetailMessage) {
      responseJson.detail = errorDetailMessage
    }
    super(responseJson, status)
  }
}

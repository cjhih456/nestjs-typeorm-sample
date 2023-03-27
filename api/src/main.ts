import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ApplicationModule } from './app/app.module'
import Package from '../../package.json'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, { cors: true })
  const swaggerDocBuilder = new DocumentBuilder()
    .setTitle(Package.name)
    .setVersion(Package.version)
    .addBearerAuth()
    .build()
  const configModule = app.get<ConfigService>(ConfigService)
  const document = SwaggerModule.createDocument(app, swaggerDocBuilder)
  SwaggerModule.setup('/docs', app, document)
  await app.listen(configModule.get('API_PORT') || 3000)
}
bootstrap()

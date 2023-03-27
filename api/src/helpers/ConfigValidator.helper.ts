import { plainToInstance } from 'class-transformer'
import { IsNumber, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
  @IsString()
  MAINDB_HOST: string
  @IsNumber()
  MAINDB_PORT: number
  @IsString()
  MAINDB_DATABASE: string
  @IsString()
  MAINDB_USERNAME: string
  @IsString()
  MAINDB_PASSWORD: string
}

export function validate(config: Record<string, unknown>) {
  config.MAINDB_PORT = Number(config.MAINDB_PORT)
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}

import { ConsoleLogger, Global, Logger, Module } from '@nestjs/common'

@Global()
@Module({
  providers: [
    ConsoleLogger,
    {
      useExisting: ConsoleLogger,
      provide: Logger,
    },
  ],
  exports: [ConsoleLogger, Logger],
})
export class LoggingModule {}

import { ConsoleLogger, Logger, Module } from '@nestjs/common'
import { RoomModule } from './room/room.module'
import { LoggingModule } from './logging/logging.module'

@Module({
  imports: [RoomModule, LoggingModule],
})
export class AppModule {}

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common'
import { RoomService } from 'src/room/room.service/room.service'

@Controller('room')
export class RoomController {
  constructor(private svc: RoomService) {}

  @Get(':id')
  getId(@Param('id') id: string) {
    if (this.svc.exists(id)) {
      return
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND)
  }
}

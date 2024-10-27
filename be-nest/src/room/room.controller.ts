import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common'
import { RoomService } from 'src/room/room.service/room.service'

@Controller('room')
export class RoomController {
  constructor(private svc: RoomService) {}

  @Get(':id')
  checkIfExists(@Param('id') id: string) {
    if (this.svc.exists(id)) {
      return
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND)
  }

  @Post()
  create() {
    const roomId = this.svc.create()

    return {
      roomId,
    }
  }
}

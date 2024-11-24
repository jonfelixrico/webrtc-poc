import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common'
import { RoomDto } from 'src/room/room.dto'
import { RoomService } from 'src/room/room.service/room.service'

@Controller('room')
export class RoomController {
  constructor(private svc: RoomService) {}

  @Get(':id')
  checkIfExists(@Param('id') id: string) {
    if (this.svc.checkIfExists(id)) {
      return
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND)
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: RoomDto })
  create(@Body('name') bodyName: string): RoomDto {
    const { id, name } = this.svc.create(bodyName)

    return {
      id,
      name,
      users: [],
    }
  }
}

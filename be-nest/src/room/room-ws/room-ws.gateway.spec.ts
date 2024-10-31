import { Test, TestingModule } from '@nestjs/testing'
import { RoomWsGateway } from './room-ws.gateway'

describe('RoomWsGateway', () => {
  let gateway: RoomWsGateway

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomWsGateway],
    }).compile()

    gateway = module.get<RoomWsGateway>(RoomWsGateway)
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })
})

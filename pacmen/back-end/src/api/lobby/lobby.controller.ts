import { Body, Controller, Param, Post, Put } from '@nestjs/common';

import { LobbyService } from './lobby.service';

import {
  JoinLobby,
  LobbyCreateInput,
  LobbyBodyUpdateInput,
  AddNPCInput,
  LobbyWhereIdAndUserId,
} from './dto';

import { Lobby } from './model';

@Controller('lobbies')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post()
  async create(@Body() lobby: LobbyCreateInput): Promise<Lobby> {
    return this.lobbyService.create(lobby);
  }

  @Post('join/:lobbyId/:username')
  async joinLobby(@Param() params:JoinLobby){
    return this.lobbyService.joinLobby(params)
  }

  @Post(':lobbyId/:ghostName') 
  async addNPC(@Param()params:AddNPCInput):Promise<Lobby> {
    const {lobbyId,ghostName} = params
    return this.lobbyService.addNPC(lobbyId,ghostName)
  }

  @Put(':lobbyId/:username')
  async update(
    @Param() params: LobbyWhereIdAndUserId,
    @Body() data: LobbyBodyUpdateInput,
  ) {
    return this.lobbyService.update(params, data);
  }

  @Put('leave/:lobbyId/:username')
  async leaveLobby (@Param() params:LobbyWhereIdAndUserId):Promise<Lobby> {
    return this.lobbyService.leaveLobby(params)
  }

}

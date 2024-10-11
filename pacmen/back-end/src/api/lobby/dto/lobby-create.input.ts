import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum LobbyType {
  PRIVATE = 'private',
  PUBLIC = 'public',
  LOCAL = 'local',
}

export interface LobbyModifiableProperties {
  maxPlayers: number;
  type: LobbyType;
  mapId: string;
  playtime: number;
}

export class LobbyCreateInput implements LobbyModifiableProperties {
  @IsNumber()
  @IsNotEmpty()
  maxPlayers: number;

  @IsEnum(LobbyType)
  @IsNotEmpty()
  type: LobbyType;

  @IsString()
  @IsNotEmpty()
  hostUsername: string;

  @IsString()
  @IsNotEmpty()
  mapId: string;

  @IsNumber()
  @IsNotEmpty()
  @IsIn([45,60,75,90], {message:"Playtime must be 60, 120 or 180"})
  playtime: number;

  @IsNumber()
  @IsIn([1,2,3], {message:"lives should be only 1,2 or 3" })
  @IsNotEmpty()
  lives: number
}

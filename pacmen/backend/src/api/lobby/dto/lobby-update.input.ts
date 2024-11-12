import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { LobbyModifiableProperties, LobbyType } from './lobby-create.input';

export class LobbyBodyUpdateInput
  implements Partial<LobbyModifiableProperties>
{
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxPlayers?: number;

  @IsOptional()
  @IsEnum(LobbyType)
  type?: LobbyType;

  @IsOptional()
  @IsString()
  mapId?: string;

  @IsOptional()
  @IsString()
  playtime?: number;
}

export class LobbyWhereIdAndUserId {
  @IsNotEmpty()
  @IsString()
  lobbyId: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}

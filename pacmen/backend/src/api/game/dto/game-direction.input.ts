import { IsEnum, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { Direction } from 'src/shared/types';

export class GameDirectionInput {
  @IsNotEmpty()
  @IsString()
  gameId: string;

  @IsNotEmpty()
  @IsEnum(Direction)
  direction: Direction;

  @IsNotEmpty()
  @IsNumberString()
  playerId: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class GameStartInput {
  @IsNotEmpty()
  @IsString()
  lobbyId: string;
}

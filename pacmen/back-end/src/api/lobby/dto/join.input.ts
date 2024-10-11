import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class JoinPrivateInput {
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @IsNotEmpty()
  lobbyCode: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  

}

export class JoinLobby {
  @IsString()
  @IsNotEmpty()
  lobbyId: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}

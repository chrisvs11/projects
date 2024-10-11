import { IsEnum, IsNotEmpty, IsString } from "class-validator";

import { GhostType, NPC } from "src/shared/types";

export class AddNPCInput implements NPC {

  @IsEnum(GhostType)
  @IsNotEmpty()
  ghostName: GhostType;

  @IsString()
  @IsNotEmpty()
  lobbyId:string;

}


export class addInkyRefPlayer  {

  @IsString()
  @IsNotEmpty()
  lobbyId:string;

  @IsNotEmpty()
  @IsString()
  ghostRefName:string
}
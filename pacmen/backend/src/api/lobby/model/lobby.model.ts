import { Member, Player } from 'src/shared/types';
import { LobbyCreateInput } from '../dto';
export class Lobby extends LobbyCreateInput {
  uuid?: string;
  code: string;
  members: Member[];
  gamesIds?: string[];
  createdAt: Date;
  deletedAt?: Date;
  updatedAt?:Date;
  inkyRefPlayer?:Player;
}

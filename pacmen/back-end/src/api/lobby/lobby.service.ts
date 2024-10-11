import { addInkyRefPlayer } from './dto/add-npc.input';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  Collection,
  GhostType,
  Member,
  npcSelector,
} from 'src/shared/types';

import { FirebaseService } from 'src/shared/services';

import { Lobby } from './model';

import {
  JoinLobby,
  LobbyCreateInput,
  LobbyWhereIdAndUserId,
  LobbyBodyUpdateInput,
} from './dto';

@Injectable()
export class LobbyService {
  conflictException: ConflictException;

  constructor(private readonly firebaseService: FirebaseService) {
    this.conflictException = new ConflictException(
      'Error during lobby process',
    );
  }

  async create({ hostUsername, ...lobby }: LobbyCreateInput): Promise<Lobby> {
    try {
      const code = this.generateRandomCode();
      const newMember: Member = {
        username: hostUsername,
      };
  
      const newLobby: Lobby = {
        ...lobby,
        code,
        hostUsername,
        members: [newMember],
        createdAt: new Date(),
      };

      const firebaseLobby =  await this.firebaseService.createEntity(Collection.LOBBIES, newLobby)

      return firebaseLobby

    } catch (e) {

      console.error(e);
      
    }
 
  }

  async joinLobby({ lobbyId, username }: JoinLobby): Promise<Lobby> {
    
    try {

      console.log(lobbyId)
      const fetchLobby = await this.firebaseService.getOneById(
        Collection.LOBBIES,
        lobbyId,
      );

      if (fetchLobby.deletedAt)
        throw new ForbiddenException('Cannot join to closed lobbies');

      const isLobbyFull = fetchLobby.members.length === fetchLobby.maxPlayers;

      if (isLobbyFull)

        throw new ServiceUnavailableException('Lobby size limit reached');

      const newMember: Member = {
        username: username,
      };

      fetchLobby.members.push(newMember);

      return this.firebaseService.updateEntity(
        Collection.LOBBIES,
        fetchLobby.uuid,
        {
          members: fetchLobby.members,
        },
      );

    } catch (e) {

      throw e

    }
  }

  async update(
    where: LobbyWhereIdAndUserId,
    data: LobbyBodyUpdateInput,
  ): Promise<Lobby> {
    const fetchLobby = (await this.firebaseService.getOneById(
      Collection.LOBBIES,
      where.lobbyId,
    )) as Lobby;

    if (fetchLobby.deletedAt)
      throw new ForbiddenException('Cannot edit closed lobbies');

    const isLobbyHost = fetchLobby.hostUsername === where.username;

    if (!isLobbyHost) throw new UnauthorizedException('You are not lobby host');

    return await this.firebaseService.updateEntity(
      Collection.LOBBIES,
      where.lobbyId,
      { ...data },
    );
  }

  generateRandomCode(length: number = 6) {
    const charactersSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let code = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersSet.length);
      code += charactersSet[randomIndex];
    }

    return code;
  }

  async addNPC(lobbyId: string, ghostType: GhostType): Promise<Lobby> {
    const fetchLobby = (await this.firebaseService.getOneById(
      Collection.LOBBIES,
      lobbyId,
    )) as Lobby;

    if (fetchLobby.deletedAt)
      throw new ForbiddenException('Cannot edit closed lobbies');

    if (fetchLobby.members.length < fetchLobby.maxPlayers) {
      const npcMember: Member = {
        username: ghostType,
      };

      fetchLobby.members.push(npcMember);

      return await this.firebaseService.updateEntity(
        Collection.LOBBIES,
        lobbyId,
        fetchLobby,
      );
    } else {
      throw new ForbiddenException('The server is full');
    }
  }

  async leaveLobby({
    lobbyId,
    username,
  }: LobbyWhereIdAndUserId): Promise<Lobby> {
    const fetchLobby: Lobby = await this.firebaseService.getOneById(
      Collection.LOBBIES,
      lobbyId,
    );

    if (fetchLobby.deletedAt)
      throw new ForbiddenException('Cannot edit closed Lobbies');

    if (
      !fetchLobby.members.some(
        (member) => member.username.toLowerCase() === username.toLowerCase(),
      )
    )
      throw new ForbiddenException('No user found with that name');

    const nonNPCMembers = this.getNonNPCMembers(fetchLobby);

    if (
      nonNPCMembers.length === 1 &&
      nonNPCMembers.some((member) => member.username === username)
    ) {
      console.log('Removing last member...');
      console.log('Closing lobby...');
      fetchLobby.deletedAt = new Date();
      return await this.firebaseService.updateEntity(
        Collection.LOBBIES,
        fetchLobby.uuid,
        fetchLobby,
      );
    }

    if (fetchLobby.hostUsername.toLowerCase() === username.toLowerCase()) {
      console.log('Searching new host...');
      const foundHostUsername = this.getNextHostId(fetchLobby);
      if (!foundHostUsername) {
        console.log('No other possible host found...closing the lobby');
        fetchLobby.deletedAt = new Date();
        return await this.firebaseService.updateEntity(
          Collection.LOBBIES,
          fetchLobby.uuid,
          fetchLobby,
        );
      } else {
        fetchLobby.hostUsername = foundHostUsername;
      }
    }
    fetchLobby.members = fetchLobby.members.filter(
      (member) => member.username.toLowerCase() !== username.toLowerCase(),
    );

    console.log(`Remove member ${username} from lobby`);
    return await this.firebaseService.updateEntity(
      Collection.LOBBIES,
      lobbyId,
      fetchLobby,
    );
  }

  getNextHostId(lobby: Lobby): string | null {
    for (let i = 0; i < lobby.members.length; i++) {
      const currentMember = lobby.members[i];
      if (
        currentMember.username !== lobby.hostUsername &&
        !npcSelector[currentMember.username]
      ) {
        return currentMember.username;
      }
    }
    return null;
  }

  getNonNPCMembers(lobby: Lobby): Member[] {
    return lobby.members.filter(
      (members) => !npcSelector[members.username],
    );
  }
}

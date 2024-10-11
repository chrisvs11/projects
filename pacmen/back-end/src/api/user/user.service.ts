import { ForbiddenException, Injectable } from '@nestjs/common';

import { FirebaseService } from 'src/shared/services';

import { CreateUserInput } from './dto';

import { Collection, GhostType } from 'src/shared/types';

import { UserModel } from './model';
@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create({ username }: CreateUserInput): Promise<UserModel> {
    const newUser: UserModel = {
      username: username,
      createdAt: new Date(),
    };

    const lowerCaseUsername = username.toLowerCase();

    if (
      lowerCaseUsername === GhostType.BLINKY ||
      lowerCaseUsername === GhostType.CLYDE ||
      lowerCaseUsername === GhostType.INKY ||
      lowerCaseUsername === GhostType.PINKY
    )
      throw new ForbiddenException(
        'Username cannot be blinky, inky, clyde, pinky',
      );

    const docRef = (
      await this.firebaseService
        .getDocReference(Collection.USERS, username)
        .get()
    ).exists;
    if (docRef) throw new ForbiddenException('Username already taken');

    return await this.firebaseService.createEntity(
      Collection.USERS,
      newUser,
      username,
    );
  }
}

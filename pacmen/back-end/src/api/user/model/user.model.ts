import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';

import { CreateUserInput } from '../dto';

export class UserModel extends CreateUserInput {
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  deletedAt?: Date;
}

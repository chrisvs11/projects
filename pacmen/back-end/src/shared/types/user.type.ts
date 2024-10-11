export interface User {
  uuid: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

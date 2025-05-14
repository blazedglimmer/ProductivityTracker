import { Collaborator, User } from '@prisma/client';

export type CollaboratorWithUser = Pick<Collaborator, 'id' | 'isOwner'> & {
  user: Pick<User, 'id' | 'username' | 'name' | 'image' | 'email'>;
};

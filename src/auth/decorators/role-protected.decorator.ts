import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

export const META_ROLES = 'roles';

export const RoleProtected = (...validRoles: ValidRoles[]) =>
  SetMetadata(META_ROLES, validRoles);

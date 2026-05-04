import type { User, UserRole } from "./user.js";

export interface AuthenticatedRequestUser {
  id: string;
  role: UserRole;
}

export interface JwtPayload extends AuthenticatedRequestUser {}

export interface GraphQLContext {
  user: AuthenticatedRequestUser | null;
}

export interface RoleProtectedInput {
  userId: string;
}

export interface OwnershipOptions {
  allowAdmin?: boolean;
  resourceName?: string;
}

export type RequestUser = User | AuthenticatedRequestUser;

export interface AuthResponse {
  token: string;
  user: User;
}

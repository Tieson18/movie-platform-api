import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import type {
  AuthResponse,
  CreateUserDTO,
  LoginUserDTO,
  OwnershipOptions,
  RequestUser,
  User,
  UserRole,
  UserRow,
} from "../types/index.js";
import { AppError } from "../utils/errors.js";
import { signToken } from "../utils/jwt.js";
import { mapUserRow } from "../utils/mappers.js";

const baseSelect = "SELECT id, name, email, password, role, created_at FROM users";

const requireRow = <T>(row: T | undefined, message: string): T => {
  if (!row) {
    throw new AppError(500, "DATABASE_ERROR", message);
  }

  return row;
};

export const UserService = {
  async list(): Promise<User[]> {
    const result = await pool.query<UserRow>(`${baseSelect} ORDER BY created_at DESC`);
    return result.rows.map(mapUserRow);
  },

  async getById(id: string): Promise<User | null> {
    const result = await pool.query<UserRow>(`${baseSelect} WHERE id = $1`, [id]);
    return result.rows[0] ? mapUserRow(result.rows[0]) : null;
  },

  async getRowByEmail(email: string): Promise<UserRow | null> {
    const result = await pool.query<UserRow>(`${baseSelect} WHERE email = $1`, [email]);
    return result.rows[0] ?? null;
  },

  async requireById(id: string): Promise<User> {
    const user = await this.getById(id);

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    return user;
  },

  async register(data: CreateUserDTO): Promise<AuthResponse> {
    const existing = await this.getRowByEmail(data.email);

    if (existing) {
      throw new AppError(409, "USER_EXISTS", "A user with this email already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const role: UserRole = "user";

    const created = await pool.query<UserRow>(
      `
        INSERT INTO users (id, name, email, password, role)
        VALUES (gen_random_uuid(), $1, $2, $3, $4)
        RETURNING id, name, email, password, role, created_at
      `,
      [data.name, data.email, passwordHash, role],
    );

    const user = mapUserRow(requireRow(created.rows[0], "Failed to create user"));

    return {
      token: signToken({ id: user.id, role: user.role }),
      user,
    };
  },

  async login(data: LoginUserDTO): Promise<AuthResponse> {
    const row = await this.getRowByEmail(data.email);

    if (!row) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, row.password);

    if (!isPasswordValid) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const user = mapUserRow(row);

    return {
      token: signToken({ id: user.id, role: user.role }),
      user,
    };
  },

  assertRole(user: RequestUser | null | undefined, ...allowedRoles: UserRole[]) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    }

    if (!allowedRoles.includes(user.role)) {
      throw new AppError(403, "FORBIDDEN", "Insufficient permissions");
    }
  },

  assertOwnership(
    requestUser: RequestUser | null | undefined,
    ownerUserId: string,
    options: OwnershipOptions = {},
  ) {
    if (!requestUser) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    }

    const { allowAdmin = true, resourceName = "resource" } = options;

    if (requestUser.id === ownerUserId) {
      return;
    }

    if (allowAdmin && requestUser.role === "admin") {
      return;
    }

    throw new AppError(403, "FORBIDDEN", `You cannot access this ${resourceName}`);
  },
};

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const ensureColumn = async (tableName: string, columnName: string, definition: string) => {
  await pool.query(`
    ALTER TABLE ${tableName}
    ADD COLUMN IF NOT EXISTS ${columnName} ${definition};
  `);
};

export const initializeDatabase = async () => {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL DEFAULT '',
      role VARCHAR(16) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await ensureColumn("users", "password", "VARCHAR(255) NOT NULL DEFAULT ''");
  await ensureColumn("users", "role", "VARCHAR(16) NOT NULL DEFAULT 'user'");
  await pool.query(`UPDATE users SET role = 'user' WHERE role IS NULL`);
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_role_check'
      ) THEN
        ALTER TABLE users
        ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));
      END IF;
    END $$;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS movies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      director VARCHAR(255) NOT NULL,
      release_year INT,
      genre VARCHAR(100) NOT NULL,
      rating NUMERIC(4, 1) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
      rating NUMERIC(4, 1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
      comment TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS watchlist (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT watchlist_user_movie_unique UNIQUE (user_id, movie_id)
    );
  `);
};

# Movie Platform API

A RESTful and GraphQL API for managing a movie catalog, built with Node.js, TypeScript, and Express. Integrates with the [TMDB (The Movie Database)](https://www.themoviedb.org/) API to enrich movie data, backed by PostgreSQL for persistence and in-memory caching for performance.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 (ESM) |
| Language | TypeScript |
| Framework | Express 5 |
| GraphQL | Apollo Server (`apollo-server-express`) |
| Database | PostgreSQL (via `pg`, connection pool) |
| Caching | `node-cache` (5-min TTL) |
| Validation | Zod |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| HTTP Client | Axios (TMDB) |
| API Docs | Swagger UI at `/docs` |
| Testing | Jest + Supertest |
| Containerization | Docker + Docker Compose |

---

## Features

- **Dual API** — REST and GraphQL endpoints running side-by-side
- **TMDB integration** — enrich local movie records with external metadata
- **Authentication** — JWT-based auth with role-based access control (`user` / `admin`)
- **Watchlist** — per-user movie watchlists
- **Reviews** — users can post and manage movie reviews
- **In-memory caching** — 5-minute TTL cache, auto-invalidated on writes
- **Swagger UI** — interactive docs at `/docs`
- **OpenAPI spec** — `openapi.yaml` in the project root
- **CI/CD** — GitHub Actions pipeline for build, test, and Azure deploy

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- TMDB API key ([get one here](https://developer.themoviedb.org/docs/getting-started))

### Installation

```bash
git clone https://github.com/Tieson18/movie-platform-api.git
cd movie-platform-api
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
PORT=3000
API_BASE_URL=http://localhost:3000
TMDB_KEY=your_tmdb_api_key_here
JWT_SECRET=your_jwt_secret_here
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

### Running the Server

```bash
# Development (hot reload via tsx)
npm run dev

# Build for production
npm run build

# Start production build
npm start
```

The server starts on the configured port (default `3000`):

```
REST:    http://localhost:3000/api
GraphQL: http://localhost:3000/graphql
Docs:    http://localhost:3000/docs
```

### Docker (Recommended)

Spin up both the API and a PostgreSQL database with a single command:

```bash
docker compose up --build
```

The `docker-compose.yml` sets up:
- `db` — Postgres 16 Alpine with a health check
- `api` — Node.js 20 Alpine, connects to `db` once it's healthy, exposed on port `3000`

---

## REST API Reference

Base URL: `http://localhost:3000/api`

Interactive docs: `http://localhost:3000/docs`

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | Public |
| `POST` | `/auth/login` | Login and receive a JWT | Public |

### Movies

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/movies` | List all movies | Public |
| `GET` | `/movies/stats` | Get aggregate stats | Public |
| `GET` | `/movies/:id` | Get a movie by ID | Public |
| `GET` | `/movies/:id/details` | Get movie + TMDB enrichment | Public |
| `GET` | `/movies/:id/reviews` | Get reviews for a movie | Public |
| `POST` | `/movies` | Create a new movie | Admin |
| `PUT` | `/movies/:id` | Update a movie | Admin |
| `DELETE` | `/movies/:id` | Delete a movie | Admin |

### Reviews

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/reviews` | Submit a review | User |
| `PUT` | `/reviews/:id` | Update own review | User |
| `DELETE` | `/reviews/:id` | Delete own review | User |

### Users

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/users/:id` | Get user profile | User |
| `PUT` | `/users/:id` | Update user profile | User |

### Watchlist

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/users/:id/watchlist` | Get user's watchlist | User |
| `POST` | `/watchlist` | Add movie to watchlist | User |
| `DELETE` | `/watchlist/:id` | Remove from watchlist | User |

### Example — Create a Movie

```http
POST /api/movies
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Inception",
  "genre": "Sci-Fi",
  "rating": 8.8,
  "release_year": 2010
}
```

### Example — Get Movie with TMDB Details

```http
GET /api/movies/1/details
```

```json
{
  "id": 1,
  "title": "Inception",
  "genre": "Sci-Fi",
  "rating": 8.8,
  "release_year": 2010,
  "externalData": {
    "id": 27205,
    "title": "Inception",
    "overview": "Cobb, a skilled thief...",
    "poster_path": "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    "release_date": "2010-07-15",
    "vote_average": 8.369
  }
}
```

---

## GraphQL API

Endpoint: `http://localhost:3000/graphql`

### Schema (excerpt)

```graphql
type Movie {
  id: ID
  title: String
  genre: String
  rating: Float
  release_year: Int
}

type Query {
  movies: [Movie]
  movie(id: ID!): Movie
}

type Mutation {
  createMovie(title: String!, genre: String!, rating: Float!): Movie
  updateMovie(id: ID!, title: String!, genre: String!, rating: Float!): Movie
  deleteMovie(id: ID!): String
}
```

### Example Queries

```graphql
# Fetch all movies
query {
  movies {
    id
    title
    genre
    rating
  }
}

# Create a movie
mutation {
  createMovie(title: "Dune", genre: "Sci-Fi", rating: 8.0) {
    id
    title
  }
}
```

---

## Authentication & Roles

All protected routes require a `Bearer` token in the `Authorization` header. Tokens are issued at login and carry the user's role (`user` or `admin`).

- `requireAuth` — rejects requests with no valid token
- `requireAdmin` — additionally rejects non-admin users

To seed an initial admin account:

```bash
npm run seed:admin
```

---

## Caching

Movie list queries (`GET /api/movies` and the `movies` GraphQL query) are cached for 5 minutes using `node-cache`. The cache is automatically invalidated on any write operation (create, update, or delete).

---

## Project Structure

```
src/
├── app.ts                   # Express setup (middleware, routes, Swagger)
├── index.ts                 # Entry point
├── server.ts                # Apollo Server bootstrap
├── config/
│   └── db.ts                # PostgreSQL connection pool
├── controllers/             # Route handler logic
├── graphql/
│   ├── resolvers.ts         # GraphQL resolvers
│   └── schema.ts            # GraphQL type definitions
├── middleware/
│   ├── auth.ts              # JWT extraction & verification
│   ├── requireAuth.ts       # Auth guard middleware
│   ├── requireAdmin.ts      # Admin role guard
│   ├── validate.ts          # Zod request validation
│   └── error.ts             # Global error handler
├── routes/                  # REST route definitions
├── scripts/
│   └── seedAdmin.ts         # Admin seed script
├── services/                # Business logic & DB queries
│   ├── movieService.ts
│   ├── ReviewService.ts
│   ├── UserService.ts
│   ├── WatchlistService.ts
│   └── TMDBService.ts
├── types/                   # Shared TypeScript types & DTOs
├── utils/
│   ├── axios.ts             # Axios instance (TMDB base URL)
│   ├── cache.ts             # node-cache instance (5-min TTL)
│   ├── errors.ts            # AppError class
│   └── jwt.ts               # JWT sign/verify helpers
└── validations/             # Zod schemas per resource
tests/
└── movies.test.ts           # Integration tests (Jest + Supertest)
```

---

## Testing

```bash
npm test
```

Uses Jest with `--experimental-vm-modules` for ESM support. Tests are run in-band (`--runInBand`) to avoid connection pool conflicts. Environment variables for tests are loaded from `tests/setupEnv.ts`.

---

## CI/CD

Two GitHub Actions workflows are included:

- **`ci.yml`** — runs on every push and pull request: installs, builds, and tests.
- **`main_movie-platform-api.yml`** — triggers on pushes to `main`: builds, tests, and deploys to **Azure App Service** (`movie-platform-api`).

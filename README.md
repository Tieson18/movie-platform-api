# Movie Platform API

A RESTful and GraphQL API for managing a movie catalog, built with Node.js, TypeScript, and Express. Integrates with the [TMDB (The Movie Database)](https://www.themoviedb.org/) API to enrich movie data, with PostgreSQL for persistence and in-memory caching for performance.

---

## Features

- **Dual API interface** — REST endpoints and a GraphQL API served side-by-side
- **TMDB integration** — enrich local movie records with external metadata from TMDB
- **PostgreSQL** — persistent storage via `pg` with a connection pool
- **In-memory caching** — 5-minute TTL cache via `node-cache` to reduce redundant DB queries
- **Swagger UI** — auto-generated API docs available at `/docs`
- **TypeScript** — fully typed with strict interfaces for movies and DTOs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Language | TypeScript |
| Framework | Express 5 |
| GraphQL | Apollo Server (apollo-server-express) |
| Database | PostgreSQL (via `pg`) |
| Caching | node-cache (5-min TTL) |
| HTTP Client | Axios (TMDB) |
| API Docs | Swagger UI (swagger-jsdoc + swagger-ui-express) |

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- TMDB API key ([get one here](https://developer.themoviedb.org/docs/getting-started))

### Installation

```bash
git clone <your-repo-url>
cd movie-platform-api
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
PORT=3000
TMDB_KEY=your_tmdb_api_key_here
API_BASE_URL=http://localhost:3000
```

> ⚠️ Never commit your `.env` file. Make sure it's listed in `.gitignore`.

### Database Setup

Make sure your PostgreSQL database has a `movies` table:

```sql
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  rating FLOAT,
  release_year INT
);
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The server will start on the configured port (default `3000`):

```
Server running on port 3000
REST:    http://localhost:3000/api
GraphQL: http://localhost:3000/graphql
```

---

## REST API

Base URL: `http://localhost:3000/api`

Interactive docs available at: `http://localhost:3000/docs`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/movies` | Get all movies |
| `GET` | `/movies/:id` | Get a movie by ID |
| `POST` | `/movies` | Create a new movie |
| `PUT` | `/movies/:id` | Update a movie |
| `DELETE` | `/movies/:id` | Delete a movie |
| `GET` | `/movies/:id/details` | Get a movie with TMDB enrichment |

### Example Request — Create a Movie

```http
POST /api/movies
Content-Type: application/json

{
  "title": "Inception",
  "genre": "Sci-Fi",
  "rating": 8.8,
  "release_year": 2010
}
```

### Example Response — Get Movie with TMDB Details

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

### Schema

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

# Fetch a single movie
query {
  movie(id: "1") {
    id
    title
    release_year
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

## Project Structure

```
src/
├── app.ts               # Express app setup (middleware, routes, Swagger)
├── index.ts             # Entry point
├── server.ts            # Apollo Server setup and app bootstrap
├── config/
│   ├── db.ts            # PostgreSQL connection pool
│   └── swagger.ts       # Swagger/OpenAPI configuration
├── controllers/
│   └── movieController.ts   # Route handler logic
├── graphql/
│   └── resolvers.ts     # GraphQL resolvers
├── models/
│   └── schema.ts        # GraphQL type definitions
├── routes/
│   └── movieRoutes.ts   # REST route definitions with Swagger annotations
├── servers/
│   ├── movieService.ts  # Business logic and DB queries
│   └── TMDBService.ts   # TMDB API integration
├── types/
│   ├── movie.ts         # Movie, CreateMovieDTO, UpdateMovieDTO, TMDBMovie
│   ├── user.ts          # User type
│   └── watchlist.ts     # Watchlist type
└── utils/
    ├── axios.ts         # Axios instance with TMDB base URL
    └── cache.ts         # node-cache instance (5-min TTL)
```

---

## Caching

Movie list queries (`GET /api/movies` and the `movies` GraphQL query) are cached for 5 minutes using `node-cache`. The cache is automatically invalidated on any write operation (create, update, or delete).

import { afterEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import { MovieService } from "../src/services/movieService.js";
import { signToken } from "../src/utils/jwt.js";

describe("movies routes", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("GET /movies returns 200", async () => {
    jest.spyOn(MovieService, "list").mockResolvedValue([
      {
        id: "11111111-1111-1111-1111-111111111111",
        title: "Arrival",
        director: "Denis Villeneuve",
        releaseYear: 2016,
        genre: "Sci-Fi",
        rating: 8.3,
        externalData: {
          adult: false,
          backdrop_path: "/test.jpg",
          genre_ids: [1, 2, 3],
          id: 123,
          title: "Arrival",
          original_language: "string",
          original_title: "string",
          overview: "string",
          popularity: 2222222222,
          poster_path: "/test.jpg",
          release_date: "2016-11-11",
          video: false,
          vote_average: 8.0,
          vote_count: 200,
        },
      },
    ]);

    const response = await request(app).get("/movies");

    expect(response.status).toBe(200);
    expect(response.body.value).toHaveLength(1);
  });
  it("returns movies with null externalData", async () => {
    jest.spyOn(MovieService, "list").mockResolvedValue([
      {
        id: "22222222-2222-2222-2222-222222222222",
        title: "Unknown Movie",
        director: "Unknown",
        releaseYear: 2020,
        genre: "Drama",
        rating: 5,
        externalData: null,
      },
    ]);

    const res = await request(app).get("/movies");

    expect(res.status).toBe(200);
    expect(res.body.value[0].externalData).toBeNull();
  });

  it("POST /movies as admin returns 201", async () => {
    jest.spyOn(MovieService, "create").mockResolvedValue({
      id: "22222222-2222-2222-2222-222222222222",
      title: "Interstellar",
      director: "Christopher Nolan",
      releaseYear: 2014,
      genre: "Sci-Fi",
      rating: 9,
    });

    const token = signToken({
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      role: "admin",
    });

    const response = await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Interstellar",
        director: "Christopher Nolan",
        genre: "Sci-Fi",
        releaseYear: 2014,
        rating: 9,
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Interstellar");
  });

  it("POST /movies as non-admin returns 403", async () => {
    const createSpy = jest.spyOn(MovieService, "create");
    const token = signToken({
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      role: "user",
    });

    const response = await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Dune",
        director: "Denis Villeneuve",
        genre: "Sci-Fi",
        releaseYear: 2021,
        rating: 8.5,
      });

    expect(response.status).toBe(403);
    expect(createSpy).not.toHaveBeenCalled();
  });
});

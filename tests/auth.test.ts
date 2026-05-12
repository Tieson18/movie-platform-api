import { afterEach, describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import { UserService } from "../src/services/UserService.js";

describe("auth routes", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("POST /auth/register sends a clean register DTO to the service", async () => {
    const registerSpy = jest.spyOn(UserService, "register").mockResolvedValue({
      token: "test-token",
      user: {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Ada Lovelace",
        email: "ada@example.com",
        role: "user",
        createdAt: "2026-05-12T00:00:00.000Z",
      },
    });

    const response = await request(app).post("/auth/register").send({
      name: " Ada Lovelace ",
      email: "ADA@example.com",
      password: "secret1",
    });

    expect(response.status).toBe(201);
    expect(response.body.user.role).toBe("user");
    expect(registerSpy).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "secret1",
    });
  });

  it("POST /auth/register rejects frontend-supplied roles", async () => {
    const registerSpy = jest.spyOn(UserService, "register");

    const response = await request(app).post("/auth/register").send({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "secret1",
      role: "admin",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation failed");
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "body",
          code: "unrecognized_keys",
        }),
      ]),
    );
    expect(registerSpy).not.toHaveBeenCalled();
  });
});

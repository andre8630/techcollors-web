import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "src/models/user";
import password from "src/models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "AndreLuis",
          email: "andre@email.com",
          password: "senha123",
        }),
      });
      const responseBody = await response.json();

      expect(response.status).toBe(201);

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "AndreLuis",
        email: "andre@email.com",
        password: responseBody.password,
        enterprise: "Nome da empresa",
        features: ["read:activation_token"],
        document: "1234567655",
        phone: "4499887755",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOnByUsername("AndreLuis");
      const correctPasswordMatch = await password.compare(
        "senha123",
        userInDatabase.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "senhaErrada",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });

    test("With duplicate email", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado1",
          email: "duplicado@email.com",
          password: "senha123",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "Duplicado@email.com",
          password: "senha123",
        }),
      });
      const responseBody2 = await response2.json();

      expect(response2.status).toBe(400);

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Email ja cadastrado no banco de dados",
        action: "Tente usar outro email",
        status_code: 400,
      });
    });

    test("With duplicate username", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameduplicado",
          email: "usernameduplicado1@email.com",
          password: "senha123",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: "Usernameduplicado",
          email: "usernameduplicado2@email.com",
          password: "senha123",
        }),
      });
      const responseBody2 = await response2.json();

      expect(response2.status).toBe(400);

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "Username ja cadastrado no banco de dados",
        action: "Tente usar outro username",
        status_code: 400,
      });
    });
  });
});

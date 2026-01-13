import activation from "src/models/activation";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";
import user from "src/models/user";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/activations/[token_id]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent token", async () => {
      const response = await fetch(
        `http://localhost:3000/api/v1/activations/3b7014fd-e28b-46fc-bb2c-979671123dad`,
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Token expirado ou nao encontrado.",
        action: "Refaça o cadastro",
        status_code: 404,
      });
    });

    test("With expired token", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - activation.expireAtMilleSeconds),
      });
      const createdUser = await orchestrator.createUser();

      const expiredActivationToken = await activation.create(createdUser.id);

      jest.useRealTimers();

      const response = await fetch(
        `http://localhost:3000/api/v1/activations/${expiredActivationToken.id}`,
        {
          method: "PATCH",
        },
      );
      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Token expirado ou nao encontrado.",
        action: "Refaça o cadastro",
        status_code: 404,
      });
    });

    test("With used token", async () => {
      const createdUser = await orchestrator.createUser();

      const usedActivationToken = await activation.create(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/activations/${usedActivationToken.id}`,
        {
          method: "PATCH",
        },
      );
      expect(response.status).toBe(200);

      const response2 = await fetch(
        `http://localhost:3000/api/v1/activations/${usedActivationToken.id}`,
        {
          method: "PATCH",
        },
      );
      expect(response2.status).toBe(404);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "NotFoundError",
        message: "Token expirado ou nao encontrado.",
        action: "Refaça o cadastro",
        status_code: 404,
      });
    });

    test("With valid token", async () => {
      const createdUser = await orchestrator.createUser();

      const activationToken = await activation.create(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/activations/${activationToken.id}`,
        {
          method: "PATCH",
        },
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: activationToken.id,
        used_at: responseBody.used_at,
        user_id: activationToken.user_id,
        expires_at: activationToken.expires_at.toISOString(),
        created_at: activationToken.created_at.toISOString(),
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(uuidVersion(responseBody.user_id)).toBe(4);

      expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const expiresAt = new Date(responseBody.expires_at);
      const createAt = new Date(responseBody.created_at);

      expiresAt.setMilliseconds(0);
      createAt.setMilliseconds(0);

      expect(expiresAt - createAt).toBe(activation.expireAtMilleSeconds);

      const activedUser = await user.findOneById(responseBody.user_id);

      expect(activedUser.features).toEqual(["create:session", "read:session"]);
    });

    test("With valid token but already actived user", async () => {
      const createdUser = await orchestrator.createUser();
      await orchestrator.activateUser(createdUser);

      const activationToken = await activation.create(createdUser.id);

      const response = await fetch(
        `http://localhost:3000/api/v1/activations/${activationToken.id}`,
        {
          method: "PATCH",
        },
      );
      expect(response.status).toBe(403);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ForbiddenError",
        message: "Voce nao pode mais usar tokens de ativaçao",
        action: "Entre em contato com suporte",
        status_code: 403,
      });
    });
  });
  // describe("Default user", () => {
  //   test("With valid token, but already logged in user", async () => {
  //     const user1 = await orchestrator.createUser();
  //     await orchestrator.activateUser(user1);

  //     const user1SessionObject = await orchestrator.createSession(user1.id);

  //     const user2 = await orchestrator.createUser();

  //     const user2ActivationToken = await activation.create(user2.id);

  //     const response = await fetch(
  //       `http://localhost:3000/api/v1/activations/${user2ActivationToken.id}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           Cookie: `session_id=${user1SessionObject.token}`,
  //         },
  //       }
  //     );

  //     expect(response.status).toBe(403);
  //   });
  // });
});

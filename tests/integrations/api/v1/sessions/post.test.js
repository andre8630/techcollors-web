import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";
import session from "src/models/session";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/sessions", () => {
  describe("Anonymous user", () => {
    describe("Current system status", () => {
      test("Inconrrect email and correct password", async () => {
        await orchestrator.createUser({
          password: "senha-correta",
        });
        const response = await fetch(`http://localhost:3000/api/v1/sessions`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: "email.errado@email.com",
            password: "senha-correta",
          }),
        });

        expect(response.status).toBe(401);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "UnauthorizedError",
          message: "Dados invalidos",
          action: "Verifique os dados e tente novamente",
          status_code: 401,
        });
      });

      test("Inconrrect password and correct email", async () => {
        await orchestrator.createUser({
          email: "email.correto@email.com",
        });

        const response = await fetch(`http://localhost:3000/api/v1/sessions`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: "email.correto@email.com",
            password: "senha-incorreta",
          }),
        });

        expect(response.status).toBe(401);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "UnauthorizedError",
          message: "Dados invalidos",
          action: "Verifique os dados e tente novamente",
          status_code: 401,
        });
      });

      test("Inconrrect password and incorrect email", async () => {
        await orchestrator.createUser({
          email: "email.incorrect1@email.com",
        });

        const response = await fetch(`http://localhost:3000/api/v1/sessions`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: "email.incorreto2@email.com",
            password: "senha-incorreta",
          }),
        });

        expect(response.status).toBe(401);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "UnauthorizedError",
          message: "Dados invalidos",
          action: "Verifique os dados e tente novamente",
          status_code: 401,
        });
      });

      test("Correct password and correct email", async () => {
        const createdUser = await orchestrator.createUser({
          email: "emailcorreto@email.com",
          password: "senhacorreta",
        });

        await orchestrator.activateUser(createdUser);

        const response = await fetch(`http://localhost:3000/api/v1/sessions`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: "emailcorreto@email.com",
            password: "senhacorreta",
          }),
        });
        console.log(response);
        expect(response.status).toBe(201);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          id: responseBody.id,
          user_id: createdUser.id,
          token: responseBody.token,
          expires_at: responseBody.expires_at,
          updated_at: responseBody.updated_at,
          created_at: responseBody.created_at,
        });

        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
        expect(Date.parse(responseBody.expires_at)).not.toBeNaN();

        const expiresAt = new Date(responseBody.expires_at);
        const createdAt = new Date(responseBody.created_at);

        expiresAt.setMilliseconds(0);
        createdAt.setMilliseconds(0);

        expect(expiresAt - createdAt).toBe(session.expireAtMilleSeconds);

        const parsedSetCookie = setCookieParser(response, {
          map: true,
        });

        expect(parsedSetCookie.session_id).toEqual({
          name: "session_id",
          value: responseBody.token,
          maxAge: session.expireAtMilleSeconds / 1000,
          path: "/",
          httpOnly: true,
        });
      });
    });
  });
});

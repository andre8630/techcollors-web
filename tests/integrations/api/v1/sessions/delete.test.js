import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";
import session from "src/models/session";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("DELETE /api/v1/sessions", () => {
  describe("Default user", () => {
    describe("Current system status", () => {
      test("With invalid session", async () => {
        const invalidSession =
          "f09bb700e3b2e4fb0d8516e13d7cae6e08b54f1adb289aa6cfabe6fc8d44240f6f82e9abc6f6bf5f08df2113c017548c";

        const response = await fetch("http://localhost:3000/api/v1/sessions", {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${invalidSession}`,
          },
        });

        expect(response.status).toBe(401);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "UnauthorizedError",
          message: "O id nao encontrado no banco de dados",
          action: "Tente usar outro id",
          status_code: 401,
        });
      });

      test("With expired session", async () => {
        jest.useFakeTimers({
          now: new Date(Date.now() - session.expireAtMilleSeconds),
        });

        const createdUser = await orchestrator.createUser({
          username: "UsuarioComSessionExpirado",
        });

        const sessionObject = await orchestrator.createSession(createdUser.id);

        jest.useRealTimers();

        const response = await fetch("http://localhost:3000/api/v1/sessions", {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        });

        expect(response.status).toBe(401);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          name: "UnauthorizedError",
          message: "O id nao encontrado no banco de dados",
          action: "Tente usar outro id",
          status_code: 401,
        });
      });

      test("With valid session", async () => {
        const createdUser = await orchestrator.createUser({
          username: "UsuarioComSessionValido",
        });

        const sessionObject = await orchestrator.createSession(createdUser.id);

        const response = await fetch("http://localhost:3000/api/v1/sessions", {
          method: "DELETE",
          headers: {
            Cookie: `session_id=${sessionObject.token}`,
          },
        });

        expect(response.status).toBe(200);

        const cacheControl = response.headers.get("Cache-Control");

        expect(cacheControl).toBe(
          "no-store, no-cache, max-age=0, must-revalidate",
        );

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          id: responseBody.id,
          user_id: createdUser.id,
          token: responseBody.token,
          expires_at: responseBody.expires_at,
          updated_at: responseBody.updated_at,
          created_at: responseBody.created_at,
        });

        expect(
          responseBody.expires_at < sessionObject.expires_at.toISOString(),
        ).toBe(true);
        expect(
          responseBody.updated_at > sessionObject.updated_at.toISOString(),
        ).toBe(true);

        //COOKIES ASSERTIONS

        const parserSetCookie = setCookieParser(response, {
          map: true,
        });

        expect(parserSetCookie.session_id).toEqual({
          name: "session_id",
          value: "invalid",
          maxAge: -1,
          path: "/",
          httpOnly: true,
        });

        //DOUBLE CHECK CONFERENCE
        const doubleCheckResponse = await fetch(
          "http://localhost:3000/api/v1/user",
          {
            headers: {
              Cookie: `session_id=${sessionObject.token}`,
            },
          },
        );
        console.log(doubleCheckResponse);
        expect(doubleCheckResponse.status).toBe(401);
      });
    });
  });
});

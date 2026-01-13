import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import session from "src/models/session";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/user", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UsuarioComSessionValido",
      });

      const activetdUser = await orchestrator.activateUser(createdUser);
      console.log("USER ATIVADO:", activetdUser);
      const sessionObject = await orchestrator.createSession(createdUser.id);
      console.log("SESSAO:", sessionObject);
      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      console.log("RESPONSE:", response);
      expect(response.status).toBe(200);

      const cacheControl = response.headers.get("Cache-Control");

      expect(cacheControl).toBe(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "UsuarioComSessionValido",
        email: responseBody.email,
        password: responseBody.password,
        enterprise: "Nome da empresa",
        features: ["create:session", "read:session"],
        document: "1234567655",
        phone: "4499887755",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const renewedSessionObject = await session.findValidSessionByToken(
        sessionObject.token,
      );

      expect(renewedSessionObject.expires_at > sessionObject.expires_at).toBe(
        true,
      );
      expect(renewedSessionObject.updated_at > sessionObject.updated_at).toBe(
        true,
      );
      //COOKIES ASSERTIONS
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: renewedSessionObject.token,
        maxAge: session.expireAtMilleSeconds / 1000,
        path: "/",
        httpOnly: true,
      });
    });

    test("With middle session time", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.expireAtMilleSeconds / 2),
      });
      const createdUser = await orchestrator.createUser({
        username: "UsuarioComMetadeDoTempoValido",
      });

      const ativedUser = await orchestrator.activateUser(createdUser);

      const sessionObject = await orchestrator.createSession(createdUser.id);

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "UsuarioComMetadeDoTempoValido",
        email: responseBody.email,
        password: responseBody.password,
        enterprise: "Nome da empresa",
        features: ["create:session", "read:session"],
        document: "1234567655",
        phone: "4499887755",
        created_at: createdUser.created_at.toISOString(),
        updated_at: ativedUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const renewedSessionObject = await session.findValidSessionByToken(
        sessionObject.token,
      );

      expect(renewedSessionObject.expires_at > sessionObject.expires_at).toBe(
        true,
      );
      expect(renewedSessionObject.updated_at > sessionObject.updated_at).toBe(
        true,
      );
      //COOKIES ASSERTIONS
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: renewedSessionObject.token,
        maxAge: session.expireAtMilleSeconds / 1000,
        path: "/",
        httpOnly: true,
      });
    });

    test("With invalid session", async () => {
      const invalidSession =
        "f09bb700e3b2e4fb0d8516e13d7cae6e08b54f1adb289aa6cfabe6fc8d44240f6f82e9abc6f6bf5f08df2113c017548c";

      const response = await fetch("http://localhost:3000/api/v1/user", {
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

      const response = await fetch("http://localhost:3000/api/v1/user", {
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
  });
});

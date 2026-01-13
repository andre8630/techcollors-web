import activation from "src/models/activation";
import orchestrator from "tests/orchestrator.js";
import webserver from "src/infra/webserver";
import user from "src/models/user";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (All sucessful)", () => {
  let userCreatedResponseBody;
  let activationToken;
  let activedUser;
  test("Create user account", async () => {
    const response = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: "RegistrationFlow",
        email: "registration.flow@email.com",
        password: "senha123",
      }),
    });
    userCreatedResponseBody = await response.json();

    expect(response.status).toBe(201);

    expect(userCreatedResponseBody).toEqual({
      id: userCreatedResponseBody.id,
      username: "RegistrationFlow",
      email: "registration.flow@email.com",
      password: userCreatedResponseBody.password,
      enterprise: "Nome da empresa",
      features: ["read:activation_token"],
      document: "1234567655",
      phone: "4499887755",
      created_at: userCreatedResponseBody.created_at,
      updated_at: userCreatedResponseBody.updated_at,
    });
  });

  test("Receive activation email", async () => {
    const lastEmail = await orchestrator.getLastEmail();

    activationToken = await orchestrator.extractUUID(lastEmail.text);

    const foundUser = await activation.findUserByToken(activationToken);

    expect(lastEmail.sender).toBe("<contato@techcollors.net.br>");
    expect(lastEmail.recipients[0]).toBe("<registration.flow@email.com>");
    expect(lastEmail.subject).toBe("Ative sua conta na Techcollors");
    expect(lastEmail.text).toContain("RegistrationFlow");

    expect(lastEmail.text).toContain(
      `${webserver.origin}/cadastro/ativar/${activationToken}`,
    );
    expect(foundUser.used_at).toBe(null);

    expect(userCreatedResponseBody.id).toEqual(foundUser.user_id);
  });

  test("Activate account", async () => {
    const activationResponse = await fetch(
      `http://localhost:3000/api/v1/activations/${activationToken}`,
      {
        method: "PATCH",
      },
    );

    expect(activationResponse.status).toBe(200);

    const activationsResponseBody = await activationResponse.json();

    expect(Date.parse(activationsResponseBody.used_at)).not.toBeNaN();

    activedUser = await user.findOnByUsername("RegistrationFlow");

    expect(activedUser.features).toEqual(["create:session", "read:session"]);
  });

  test("Login", async () => {
    const createSessionResponse = await fetch(
      "http://localhost:3000/api/v1/sessions",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: "registration.flow@email.com",
          password: "senha123",
        }),
      },
    );
    console.log("SESSAO :", activationToken);
    expect(createSessionResponse.status).toBe(201);

    const createSessionResponseBody = await createSessionResponse.json();

    expect(createSessionResponseBody.user_id).toBe(userCreatedResponseBody.id);
  });

  test("Get user information", async () => {
    const sessionCreated = await orchestrator.createSession(activedUser.id);

    const response = await fetch("http://localhost:3000/api/v1/user", {
      headers: {
        Cookie: `session_id=${sessionCreated.token}`,
      },
    });
    console.log(activedUser);
    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id: responseBody.id,
      username: responseBody.username,
      email: responseBody.email,
      password: responseBody.password,
      enterprise: "Nome da empresa",
      features: ["create:session", "read:session"],
      document: "1234567655",
      phone: "4499887755",
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
  });
});

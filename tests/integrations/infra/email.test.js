import email from "src/infra/email";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.deleteAllEmails();
});

describe("infra/email.js", () => {
  test("send", async () => {
    await email.send({
      from: "Techcollors <contato@techcollors.net.br>",
      to: "teste@email.com",
      subject: "Teste de assunto",
      text: "Teste de corpo do email",
    });
    await email.send({
      from: "Techcollors <contato@techcollors.net.br>",
      to: "teste2@email.com",
      subject: "Teste de assunto2",
      text: "Teste de corpo do email2",
    });
    const lastEmail = await orchestrator.getLastEmail();
    console.log(lastEmail);

    expect(lastEmail.sender).toBe("<contato@techcollors.net.br>");
    expect(lastEmail.recipients[0]).toBe("<teste2@email.com>");
    expect(lastEmail.subject).toBe("Teste de assunto2");
    expect(lastEmail.created_at).toBe(lastEmail.created_at);
    expect(lastEmail.text).toBe("Teste de corpo do email2\n");
  });
});

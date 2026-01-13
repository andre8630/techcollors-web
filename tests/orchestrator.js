import retry from "async-retry";
import { faker } from "@faker-js/faker";
import database from "src/infra/database";
import migrator from "src/models/migrator";
import user from "src/models/user";
import session from "src/models/session";
import activation from "src/models/activation";

const emailHttpHost = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function waitForAllServices() {
  await waitForServer();
  await waitForEmailServer();

  async function waitForServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (!response.ok) {
        throw Error();
      }
      await response.json();
    }
  }
  async function waitForEmailServer() {
    return retry(fetchEmailPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchEmailPage() {
      const response = await fetch(emailHttpHost);

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject) {
  return await user.create({
    username:
      userObject?.username || faker.internet.username().replace(/[_.-]/, ""),
    email: userObject?.email || faker.internet.email(),
    password: userObject?.password || "senhapadrao",
  });
}

async function createSession(userId) {
  return await session.create(userId);
}

async function deleteAllEmails() {
  await fetch(`${emailHttpHost}/messages`, {
    method: "DELETE",
  });
}

async function getLastEmail() {
  const emailListResponse = await fetch(`${emailHttpHost}/messages`);
  const emailListBody = await emailListResponse.json();
  const lastEmailItem = emailListBody.pop();

  if (!lastEmailItem) {
    return null;
  }

  const emailTextResponse = await fetch(
    `${emailHttpHost}/messages/${lastEmailItem.id}.plain`,
  );
  const emailTextBody = await emailTextResponse.text();
  lastEmailItem.text = emailTextBody;
  return lastEmailItem;
}

function extractUUID(text) {
  const match = text.match(/[0-9a-fA-F-]{36}/);
  return match ? match[0] : null;
}

async function activateUser(inactiveUser) {
  return await activation.activateUserByUserId(inactiveUser.id);
}

const orchestrator = {
  activateUser,
  waitForAllServices,
  cleanDatabase,
  runPendingMigrations,
  createUser,
  createSession,
  deleteAllEmails,
  getLastEmail,
  extractUUID,
};
export default orchestrator;

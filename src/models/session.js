import database from "src/infra/database";
import crypto from "node:crypto";
import { UnauthorizedError } from "src/infra/errors";

const expireAtMilleSeconds = 60 * 60 * 24 * 30 * 1000;

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");

  const expiresAt = new Date(Date.now() + expireAtMilleSeconds);

  const newSession = await runInsertQuery(token, userId, expiresAt);

  return newSession;

  async function runInsertQuery(token, userId, expiresAt) {
    const results = await database.query({
      text: "INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3) RETURNING * ;",
      values: [token, userId, expiresAt],
    });
    return results.rows[0];
  }
}

async function findValidSessionByToken(sessionToken) {
  const sessionFound = await runSelectQuery(sessionToken);

  return sessionFound;

  async function runSelectQuery(sessionToken) {
    const results = await database.query({
      text: "SELECT * FROM sessions WHERE token = $1 AND expires_at > updated_at LIMIT 1 ;",
      values: [sessionToken],
    });

    if (results.rowCount === 0) {
      throw new UnauthorizedError({
        message: "O id nao encontrado no banco de dados",
        action: "Tente usar outro id",
      });
    }
    return results.rows[0];
  }
}

async function renew(sessionId) {
  const expiresAt = new Date(Date.now() + expireAtMilleSeconds);

  const updatedSession = await runUpdateQuery(sessionId, expiresAt);

  return updatedSession;

  async function runUpdateQuery(sessionId, expiresAt) {
    const results = await database.query({
      text: "UPDATE sessions SET expires_at = $2, updated_at = NOW() WHERE id = $1 RETURNING * ;",
      values: [sessionId, expiresAt],
    });
    return results.rows[0];
  }
}

async function expireById(sessionId) {
  const updatedSession = await runUpdateQuery(sessionId);

  return updatedSession;

  async function runUpdateQuery(sessionId) {
    const results = await database.query({
      text: "UPDATE sessions SET expires_at = expires_at - interval '1 year', updated_at = NOW() WHERE id = $1 RETURNING * ;",
      values: [sessionId],
    });
    return results.rows[0];
  }
}

const session = {
  create,
  renew,
  expireById,
  findValidSessionByToken,
  expireAtMilleSeconds,
};

export default session;

// text:" ",
// values: []

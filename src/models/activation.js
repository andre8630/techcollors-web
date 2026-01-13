import database from "src/infra/database";
import webserver from "src/infra/webserver";
import email from "src/infra/email";
import { NotFoundError, ForbiddenError } from "src/infra/errors";
import user from "src/models/user";
import authorization from "src/models/authorization";

const expireAtMilleSeconds = 60 * 15 * 1000; // 15 min

async function create(userId) {
  const expirsAt = new Date(Date.now() + expireAtMilleSeconds);

  const newToken = await runInsertQuery(userId, expirsAt);

  return newToken;

  async function runInsertQuery(userId, expirsAt) {
    const results = await database.query({
      text: "INSERT INTO user_activation_tokens (user_id, expires_at) VALUES ($1, $2) RETURNING *;",
      values: [userId, expirsAt],
    });

    return results.rows[0];
  }
}

async function findUserByToken(token) {
  const findUser = await runSelectQuery(token);
  return findUser;

  async function runSelectQuery(token) {
    const results = await database.query({
      text: "SELECT * FROM user_activation_tokens WHERE id = $1 AND expires_at > NOW() AND used_at IS NULL LIMIT 1 ;",
      values: [token],
    });
    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Token expirado ou nao encontrado.",
        action: "Refaça o cadastro",
      });
    }

    return results.rows[0];
  }
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "<contato@techcollors.net.br>",
    to: user.email,
    subject: "Ative sua conta na Techcollors",
    text: `${user.username}, clique no link abaixo para ativar seu cadastro.

${webserver.origin}/cadastro/ativar/${activationToken.id}

Atenciosamente,
Equipe Techcollors`,
  });
}

async function markTokenAsUsed(activationTokenId) {
  const usedAtivationToken = await runUpdateQuery(activationTokenId);

  return usedAtivationToken;

  async function runUpdateQuery(activationTokenId) {
    const results = await database.query({
      text: "UPDATE user_activation_tokens SET used_at = timezone('utc', now()), updated_at = timezone('utc', now()) WHERE id = $1 RETURNING * ;",
      values: [activationTokenId],
    });

    return results.rows[0];
  }
}

async function activateUserByUserId(userId) {
  const userToActive = await user.findOneById(userId);
  if (!authorization.can(userToActive, "read:activation_token")) {
    throw new ForbiddenError({
      message: "Voce nao pode mais usar tokens de ativaçao",
      action: "Entre em contato com suporte",
    });
  }
  const activedUser = await user.setFeatures(userId, [
    "create:session",
    "read:session",
  ]);
  console.log("USER ATIVADO :", activedUser);
  return activedUser;
}

const activation = {
  markTokenAsUsed,
  activateUserByUserId,
  sendEmailToUser,
  create,
  findUserByToken,
  expireAtMilleSeconds,
};

export default activation;

import * as cookie from "cookie";
import session from "src/models/session";
import user from "src/models/user";
import authorization from "src/models/authorization";
import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "src/infra/errors";

// ERRORS CONTROL

function onNoMAtchHandler(resquest, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, resquest, response) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError
  ) {
    return response.status(error.statusCode).json(error);
  }

  if (error instanceof UnauthorizedError) {
    clearSessionCookie(response);
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

// SET COOKIES OF SESSION

async function setSessionCookie(sessionToken, response) {
  const setCookie = cookie.serialize("session_id", sessionToken, {
    path: "/",
    maxAge: session.expireAtMilleSeconds / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

async function clearSessionCookie(response) {
  const setCookie = cookie.serialize("session_id", "invalid", {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  response.setHeader("Set-Cookie", setCookie);
}

// MIDLEWARE INJECTIONS

async function injectAnonymousOrUser(request, response, next) {
  if (request.cookies?.session_id) {
    await injectAuthenticatedUser(request);
  }
  injectAnonymousUser(request);
  return next();
}

async function injectAuthenticatedUser(request) {
  const sessionToken = request.cookies.session_id;
  const sessionObject = await session.findValidSessionByToken(sessionToken);
  const userObject = await user.findOneById(sessionObject.user_id);
  console.log(userObject);
  request.context = {
    ...request.context,
    user: userObject,
  };
}

function injectAnonymousUser(request) {
  const anonymousUser = {
    features: ["read:activation_token", "create:session", "create:user"],
  };

  request.context = {
    ...request.context,
    user: anonymousUser,
  };
}

function canRequest(features) {
  return function canRequestFeatures(request, response, next) {
    const userTryingRequest = request.context.user;
    if (authorization.can(userTryingRequest, features)) {
      return next();
    }

    throw new ForbiddenError({
      message: "Voce nao possui autorizaçao para realizar essa funçao",
      action: `Verifique se o usuario possui a feature ${features}`,
    });
  };
}

// EXPORTATIONS

const controller = {
  errorHandler: {
    onNoMatch: onNoMAtchHandler,
    onError: onErrorHandler,
  },
  setSessionCookie,
  clearSessionCookie,
  injectAnonymousOrUser,
  canRequest,
};

export default controller;

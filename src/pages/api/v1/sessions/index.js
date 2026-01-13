import { createRouter } from "next-connect";
import controller from "src/infra/controller";
import authorization from "src/models/authorization";
import authentication from "src/models/authentication";
import session from "src/models/session";
import { ForbiddenError } from "src/infra/errors";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.post(controller.canRequest("create:session"), postHandler);
router.delete(deleteHandler);

export default router.handler(controller.errorHandler);

async function postHandler(request, response) {
  // console.log(request.context); // GET THE CONTEXT
  const userInputValues = request.body;

  const authenticationUser = await authentication.getAuthenticateUser(
    userInputValues.email,
    userInputValues.password,
  );

  if (!authorization.can(authenticationUser, "create:session")) {
    throw new ForbiddenError({
      message: "Usuario nao pode criar sessoes",
      action: "Tente usar outro ususario!",
    });
  }

  const newSession = await session.create(authenticationUser.id);

  controller.setSessionCookie(newSession.token, response);

  return response.status(201).json(newSession);
}

async function deleteHandler(request, response) {
  const sessionToken = request.cookies.session_id;

  const sessionObject = await session.findValidSessionByToken(sessionToken);

  const expiredSession = await session.expireById(sessionObject.id);

  await controller.clearSessionCookie(response);
  response.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  return response.status(200).json(expiredSession);
}

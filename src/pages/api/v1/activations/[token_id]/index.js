import activation from "src/models/activation";
import { createRouter } from "next-connect";
import controller from "src/infra/controller";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.patch(controller.canRequest("read:activation_token"), patchHandler);

export default router.handler(controller.errorHandler);

async function patchHandler(request, response) {
  const activationTokenId = request.query.token_id;

  const validActivationToken =
    await activation.findUserByToken(activationTokenId);

  await activation.activateUserByUserId(validActivationToken.user_id);

  const usedActivationToken =
    await activation.markTokenAsUsed(activationTokenId);

  return response.status(200).json(usedActivationToken);
}

import { createRouter } from "next-connect";
import controller from "src/infra/controller";
import user from "src/models/user";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandler);

async function getHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOnByUsername(username);
  return response.status(200).json(userFound);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userInputValues = request.body;

  const updatedUser = await user.update(username, userInputValues);
  return response.status(200).json(updatedUser);
}

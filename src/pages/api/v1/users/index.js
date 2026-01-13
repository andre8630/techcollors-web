import { createRouter } from "next-connect";
import controller from "src/infra/controller";
import user from "src/models/user";
import activation from "src/models/activation";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandler);

async function postHandler(request, response) {
  const userInputValues = request.body;
  console.log("INFO ::", userInputValues);
  const newUser = await user.create(userInputValues);

  const activationToken = await activation.create(newUser.id);
  await activation.sendEmailToUser(newUser, activationToken);
  return response.status(201).json(newUser);
}

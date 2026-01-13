import user from "src/models/user";
import { NotFoundError, UnauthorizedError } from "src/infra/errors";
import password from "src/models/password";

async function getAuthenticateUser(provideEmail, providePassword) {
  try {
    const storedUser = await findUserByEmail(provideEmail);
    await validatePassword(providePassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados invalidos",
        action: "Verifique os dados e tente novamente",
      });
    }
    throw error;
  }

  async function findUserByEmail(provideEmail) {
    let storedUser;
    try {
      storedUser = await user.findOnByEmail(provideEmail);
    } catch (error) {
      throw new UnauthorizedError({
        message: "Dados invalidos",
        action: "Verifique os dados e tente novamente",
      });
    }
    return storedUser;
  }

  async function validatePassword(providePassword, storedPassword) {
    const correctPasswordMatch = await password.compare(
      providePassword,
      storedPassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Dados invalidos",
        action: "Verifique os dados e tente novamente",
      });
    }
  }
}

const authentication = {
  getAuthenticateUser,
};

export default authentication;

import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOnFRounds();
  return await bcryptjs.hash(password, rounds);
}

function getNumberOnFRounds() {
  let rounds = 1;
  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }
  return rounds;
}

async function compare(passwordText, storePassword) {
  return await bcryptjs.compare(passwordText, storePassword);
}

const password = {
  hash,
  compare,
};

export default password;

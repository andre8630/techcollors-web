function getOrigin() {
  if (["test", "development"].includes(process.env.NODE_ENV)) {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_ENV === "preveiw") {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://techcollors.vercel.app";
}

const webserver = {
  origin: getOrigin(),
};

export default webserver;

import jwt from "jsonwebtoken";

const JWT_SECRET = () => {
  const s = process.env.JWT_SECRET?.trim();
  if (!s) {
    throw new Error("JWT_SECRET is not set (required for ATS auth)");
  }
  return s;
};

export function signAtsToken(userId, email) {
  return jwt.sign({ sub: String(userId), email }, JWT_SECRET(), {
    expiresIn: "7d",
  });
}

export function verifyAtsToken(token) {
  return jwt.verify(token, JWT_SECRET());
}

const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET_KEY } = process.env;
const AuthError = require("../errors/authError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new AuthError("Необходимо авторизоваться"));
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET_KEY : "dev-secret"
    );
    console.log(
      "\x1b[31m%s\x1b[0m",
      `
Надо исправить. В продакшне используется тот же
секретный ключ, что и в режиме разработки.
`
    );
  } catch (err) {
    next(new AuthError("Необходимо авторизоваться"));
    if (
      err.name === "JsonWebTokenError" &&
      err.message === "invalid signature"
    ) {
      console.log(
        "\x1b[32m%s\x1b[0m",
        "Всё в порядке. Секретные ключи отличаются"
      );
    } else {
      console.log("\x1b[33m%s\x1b[0m", "Что-то не так", err);
    }
  }
  req.user = payload;
  next();
};

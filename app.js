require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");
const helmet = require("helmet");
const cors = require("cors");

const rateLimiter = require("./middlewares/rateLimit");
const usersRoutes = require("./routes/users");
const moviesRoutes = require("./routes/movies");
const auth = require("./middlewares/auth");
const { apiLogger, errLogger } = require("./middlewares/logger");
const NotFoundError = require("./errors/notFoundError");
const errorHandler = require("./errors/errorHandler");
const router = require("./routes/index");

const app = express();

const { PORT = 3001, MONGO_URL = "mongodb://localhost:27017/bitfilmsdb" } =
  process.env;

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log(error));

const whitelist = [
  "http://localhost:3000",
  "https://movies-explorer-dip.nomoredomains.xyz",
  "http://movies-explorer-dip.nomoredomains.xyz",
];
const corsOptions = {
  origin: whitelist,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(apiLogger);

app.use(rateLimiter);

app.use(helmet());

app.get("/api/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.use("/", router);

app.use("/api/", auth, usersRoutes);
app.use("/api/", auth, moviesRoutes);
app.use("/*", auth, (req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});

app.use(errLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`);
});

import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import router from "./routes";
import helmet from "helmet";
import { createUser, login } from "./controllers/users";
import { auth } from "./middleware/auth";
import { requestLogger, errorLogger } from "./middleware/logger";
import { errorHandler } from "./middleware/error";
import { validateCreateUser, validateLogin } from "./middleware/validator";

const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());
app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(requestLogger);
app.post("/signin", validateLogin, login);
app.post("/signup", validateCreateUser, createUser);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

const connect = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect("mongodb://localhost:27017/mestodb");
    console.log("база данных подключена");
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
};

connect();

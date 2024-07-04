import express, { json, Request, Response, NextFunction } from "express";
import mongoose, { ObjectId } from "mongoose";
import router from "./routes";

import { getCard } from "./controllers/cards";

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string | ObjectId;
      };
    }
  }
}

const { PORT = 3000 } = process.env;

const app = express();

app.use(json());
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: "667a2ab2914439e8a38c4d1a",
  };

  next();
});
app.use(router);

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

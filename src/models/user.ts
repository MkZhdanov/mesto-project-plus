import { Schema, model } from "mongoose";
import validator from "validator";

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Поле обязательно для заполнения"],
      minLength: [2, "Минимальная длина 2 символа"],
      maxLength: [30, "Максимальная длина 30 символов"],
    },
    about: {
      type: String,
      required: [true, "Поле обязательно для заполнения"],
      minLength: [2, "Минимальная длина 2 символа"],
      maxLength: [200, "Максимальная длина 200 символов"],
    },
    avatar: {
      type: String,
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: "Некорректный URL",
      },
      required: [true, "Поле обязательно для заполнения"],
    },
  },
  {
    versionKey: false,
  }
);

export default model<IUser>("user", userSchema);

import mongoose, { Schema, model, Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import UnauthorizedError from "../errors/unauthorized-error";

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      default: "Жак-Ив Кусто",
      minLength: [2, "Минимальная длина 2 символа"],
      maxLength: [30, "Максимальная длина 30 символов"],
    },
    about: {
      type: String,
      default: "Исследователь",
      minLength: [2, "Минимальная длина 2 символа"],
      maxLength: [200, "Максимальная длина 200 символов"],
    },
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: "Некорректный URL",
      },
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Поле обязательно для заполнения"],
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Некорректный email",
      },
    },
    password: {
      type: String,
      required: [true, "Поле обязательно для заполнения"],
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

userSchema.static(
  "findUserByCredentials",
  async function findUserByCredentials(email: string, password: string) {
    const currentUser:
      | (mongoose.Document<unknown, any, IUser> &
          Omit<IUser & { _id: mongoose.Types.ObjectId }, never>)
      | null = await this.findOne({ email }).select("+password");

    if (!currentUser) {
      throw new UnauthorizedError();
    }

    const matched = await bcrypt.compare(password, currentUser.password);

    if (!matched) {
      throw new UnauthorizedError("Некорректный email или пароль");
    }

    return currentUser;
  }
);

export default mongoose.model<IUser, IUserModel>("user", userSchema);

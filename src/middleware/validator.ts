import { celebrate, Joi } from "celebrate";
import { urlRegExp } from "../utils/regexp";

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
});

const validateUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlRegExp),
    password: Joi.string().required().min(6),
    email: Joi.string().email().required(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    about: Joi.string().min(2).max(200).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegExp).required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlRegExp).required(),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

export {
  validateLogin,
  validateUser,
  validateCreateUser,
  validateUpdateUser,
  validateUpdateAvatar,
  validateCardId,
  validateCreateCard,
};

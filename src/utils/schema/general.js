const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const idSchema = Joi.object({
  id: Joi.required().messages({
    "any.required": `ID is a required field`,
  }),
});

const emailSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "any.required": `Email is a required field`,
    "string.empty": `Email cannont be empty`,
    "string.email": `Enter a valid email`,
  }),
});

const passwordResetSchema = Joi.object({
  newPassword: joiPassword
    .string()
    .required()
    .min(8)
    .max(16)
    .minOfSpecialCharacters(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .messages({
      "password.minOfUppercase":
        "Password should contain at least 1 uppercase character",
      "password.minOfSpecialCharacters":
        "Password should contain at least 1 special character",
      "password.minOfNumeric":
        "Password should contain at least 1 numeric character",
      "any.required": `Password is a required field`,
      "string.empty": `Password can not be empty`,
      "string.min": `Password length must be at least 8 characters long`,
      "string.max": `length must be less than or equal to 16 characters long`,
      "string.alphanum": `Password should be a mixture of Alphabets and Numbers`,
    }),
  token: Joi.string().required().messages({
    "any.required": `token is a required field`,
    "string.empty": `token cannont be empty`,
  }),
});

module.exports = {
  idSchema,
  emailSchema,
  passwordResetSchema,
};

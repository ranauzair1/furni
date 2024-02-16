const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const createUserSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "any.required": `Email is a required field`,
    "string.empty": `Email cannont be empty`,
    "string.email": `Enter a valid email`,
  }),
  password: Joi.string().required().min(8).max(16).messages({
    "any.required": `Password is a required field`,
    "string.empty": `Password can not be empty`,
  }),
  firstName: Joi.string().required().messages({
    "any.required": `First name is a required field`,
    "string.empty": `First name can not be empty`,
  }),
  lastName: Joi.string().required().messages({
    "any.required": `Last name is a required field`,
    "string.empty": `Last name can not be empty`,
  }),
  contactNo: Joi.string().required().messages({
    "any.required": `Contact number is a required field`,
    "string.empty": `Contact number can not be empty`,
  }),

  roleId: Joi.string().required().messages({
    "any.required": `role is a required field`,
    "number.base": `roleId must be a number`,
  }),
});



module.exports = {
  createUserSchema,
};

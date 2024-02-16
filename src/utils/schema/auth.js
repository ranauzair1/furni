const Joi = require("joi")
const { joiPasswordExtendCore } = require("joi-password")
const joiPassword = Joi.extend(joiPasswordExtendCore)

const loginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "any.required": `Email is a required field`,
    "string.empty": `Email cannont be empty`,
    "string.email": `Enter a valid email`
  }),
  password: Joi.string().required().min(8).max(16).messages({
    "any.required": `Password is a required field`,
    "string.empty": `Password can not be empty`,
  })
})


module.exports = {
  loginSchema,
}

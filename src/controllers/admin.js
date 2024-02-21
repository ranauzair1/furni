const status = require("http-status");
const { MESSAGES } = require("../utils/constants");
const catchAsync = require("../utils/catchAsync");
const { APIresponse } = require("../utils/APIresponse");
const APIError = require("../utils/APIError");
const dbUtils = require("../utils/database");
const bcrypt = require("bcrypt");
const { sendEmailSendGrid } = require("../utils/email");
require("../config/passport");
const { uploadFile } = require("../utils/fileUpload");
const jwt = require("jsonwebtoken");
const path = require("path");
const { pagination } = require("../utils/pagination");
const { loginSchema } = require("../utils/schema/auth");

const ip = require("ip");
const ForgetPasswordToken = require("../models/forgetPasswordToken");
const { emailSchema, passwordResetSchema } = require("../utils/schema/general");
const { Op } = require("sequelize");
const { User } = require("../models");

const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const loginValidation = loginSchema.validate(req.body);

  if (loginValidation.error) {
    return next(
      new APIError(loginValidation.error.details[0].message, status.BAD_REQUEST)
    );
  }
  const user = await User.findOne({
    where: { email },
  });
  if (!user) {
    return next(new APIError(MESSAGES.CREDENTIALS_NOT_VALID, 400));
  }
  if (password === user.password) {

    const jwtToken = jwt.sign(
      user.get({ plain: true }),
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1 day" }
    );
    return APIresponse(res, MESSAGES.LOGIN_SUCCESS_MESSAGE, {
      user: user,
      token: jwtToken,
    });
  }
  return next(new APIError(MESSAGES.CREDENTIALS_NOT_VALID, 400));
});

const forgetPasswordAdmin = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const emailValidation = emailSchema.validate(req.body);

  if (emailValidation.error) {
    return next(
      new APIError(emailValidation.error.details[0].message, status.BAD_REQUEST)
    );
  }
  const admin = await User.findOne({
  });

  if (!admin) {
    return next(new APIError(MESSAGES.EMAIL_NOT_FOUND, status.BAD_REQUEST));
  }
  const token = await User.generateUnique5DigitNumber();
  const currentDate = addMinutes(new Date(), 30);
  console.log(admin)
  await ForgetPasswordToken.upsert(
    {
      token: token,
      expiresIn: currentDate,
      UserId: admin.id,
    }
    // {
    //   conflictFields: ["UserId"],
    // }
  );

  console.log("email, token", email, token);

  const sendMail = await sendEmailSendGrid(
    admin.email,
    MESSAGES.EMAIL_FOR_FORGET_PASSWORD_RESET,
    MESSAGES.EMAIL_CONTENT(email, token)
  );
  if (sendMail instanceof APIError) {
    return next(sendMail);
  }
  return APIresponse(res, MESSAGES.EMAIL_SUCCESSFUL);
});

const resetPasswordAdmin = catchAsync(async (req, res, next) => {
  const { newPassword, token } = req.body;

  const { error } = passwordResetSchema.validate(req.body);
  if (error) {
    return next(new APIError(error.details[0].message, status.BAD_REQUEST));
  }

  const isVerified = await ForgetPasswordToken.findOne({
    where: {
      [Op.and]: {
        token: token,
        expiresIn: {
          [Op.gte]: new Date(),
        },
      },
    },
  });

  // console.log("isVerified", isVerified);

  if (!isVerified) {
    return next(
      new APIError(
        MESSAGES.EMAIL_VERIFICATION_TOKEN_NOT_VALID,
        status.BAD_REQUEST
      )
    );
  }

  const isExists = await User.findOne({
    where: { id: isVerified.UserId },
  });

  if (!isExists) {
    return next(
      new APIError(MESSAGES.CREDENTIALS_NOT_VALID, status.BAD_REQUEST)
    );
  }
  console.log(isExists.password)

  let matchPassword = await User.hashCompare(newPassword, isExists.password);
  if (matchPassword) {
    return next(
      new APIError(MESSAGES.PASSWORD_CAN_NOT_BE_SAME, status.BAD_REQUEST)
    );
  }

  console.log("im here");
  //creates new token
  isVerified.set({
    expiresIn: addMinutes(new Date(), 60),
  });

  await isVerified.save();

  const passwordUpdate = await User.findOne({
    where: {
      [Op.and]: {
        id: isVerified.UserId,
      },
    },
  });

  passwordUpdate.set({
    password: await User.passwordHash(newPassword),
  });
  await passwordUpdate.save();

  return APIresponse(res, MESSAGES.PASSWORD_UPDATED_SUCCESSFUL);
});

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
async function hashCompare(pass, dbpassword) {
  const unhash = bcrypt.compareSync(pass, dbpassword);
  return unhash;
}
module.exports = {
  adminLogin,
  forgetPasswordAdmin,
  resetPasswordAdmin,
};

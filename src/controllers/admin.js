const status = require("http-status");
const { MESSAGES } = require("../utils/constants");
const catchAsync = require("../utils/catchAsync");
const { APIresponse } = require("../utils/APIresponse");
const APIError = require("../utils/APIError");
const bcrypt = require("bcrypt");
const { sendEmailSendGrid } = require("../utils/email");
require("../config/passport");
const jwt = require("jsonwebtoken");
const { loginSchema } = require("../utils/schema/auth");
const ip = require("ip");
const ForgetPasswordToken = require("../models/forgetPasswordToken");
const { emailSchema, passwordResetSchema } = require("../utils/schema/general");
const { Op } = require("sequelize");
const { User, Gallery } = require("../models");
const { uploadToS3 } = require("../utils/fileUpload");
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
  if (user.fisrtTimeLogin && user.passwordChange) {
    return next(new APIError("Please Reset Password and Than login Again", 400))
  } else {
    let validatePassword = await hashCompare(password, user.password);
    if (validatePassword) {
      const jwtToken = jwt.sign(
        user.get({ plain: true }),
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1 day" }
      );
      if (!user.fisrtTimeLogin && user.passwordChange) {
        const user = await User.update(
          {
            fisrtTimeLogin: true,
          },
          {
            where: {
              email,
            },
            returning: true,
          },
        );
      }
      return APIresponse(res, MESSAGES.LOGIN_SUCCESS_MESSAGE, {
        user: user,
        token: jwtToken,
      });
    }
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
    where: { email },
  });

  if (!admin) {
    return next(new APIError(MESSAGES.EMAIL_NOT_FOUND, status.BAD_REQUEST));
  }
  const token = await User.generateUnique5DigitNumber();
  const currentDate = addMinutes(new Date(), 30);
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

  let matchPassword = await User.hashCompare(newPassword, isExists.password);
  if (matchPassword) {
    return next(
      new APIError(MESSAGES.PASSWORD_CAN_NOT_BE_SAME, status.BAD_REQUEST)
    );
  }

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
  if (isExists.fisrtTimeLogin && isExists.passwordChange) {
    const user = await User.update(
      {
        fisrtTimeLogin: true,
        passwordChange: false
      },
      {
        where: {
          email: isExists.email,
        },
        returning: true,
      },
    );
    console.log(user)

  }
  return APIresponse(res, MESSAGES.PASSWORD_UPDATED_SUCCESSFUL);
});

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
async function hashCompare(pass, dbpassword) {
  const unhash = bcrypt.compareSync(pass, dbpassword);
  return unhash;
}

const AddGallery = catchAsync(async (req, res, next) => {
  const { title, descriptions, } = req.body;
  const numberOfFiles = Object.entries(req.files).length;
  if (numberOfFiles > 0) {
    const files = Array.isArray(req.files.avatar) ? req.files.avatar : [req.files.avatar];
    console.log(files)
    if (files !== undefined) {
      for (const file of files) {
        console.log(file)
        var galleryImage = await uploadToS3(req.files.file)
        console.log("======>file----->", file, galleryImage)
      }
    }
  }
  const gallery = await Gallery.create({
    title,
    descriptions,
    galleryImage
  });
  return APIresponse(res, "image uploaded successfully", {
    gallery,
  });
});

const getAllGallery = catchAsync(async (req, res, next) => {
  const users = await Gallery.findAndCountAll({

  });

  return APIresponse(res, MESSAGES.SUCCESS, {
    users,
  });
});


const getGalleryImage = catchAsync(async (req, res, next) => {
  const { id } = req.query
  const users = await Gallery.findOne({
    where: { id: id }
  });

  return APIresponse(res, MESSAGES.SUCCESS, {
    users,
  });
});
const deleteGallery = catchAsync(async (req, res, next) => {
  const { id } = req.query
  const user = await Gallery.destroy({
    where: {
      id,
    },
  });

  return APIresponse(res, "Gallery Deleted", {
    user,
  });
});
const updateGallery = catchAsync(async (req, res, next) => {
  const { title, descriptions, id } = req.body;
  console.log(req.files)
  if (req.files != null) {
    const numberOfFiles = Object.entries(req.files).length;
    if (numberOfFiles > 0) {
      const files = Array.isArray(req.files.avatar) ? req.files.avatar : [req.files.avatar];
      console.log(files)
      if (files !== undefined) {
        for (const file of files) {
          console.log(file)
          var galleryImage = await uploadToS3(file)
          console.log("======>file----->", file, galleryImage)
        }
      }
      const gallery = await Gallery.update(
        {
          title,
          descriptions,
          galleryImage
        },
        {
          where: {
            id,
          },
          returning: true,
        }
      );



      return APIresponse(res, "Gallery Updated", {
        gallery,
      });
    }
  } else {
    const gallery = await Gallery.update(
      {
        title,
        descriptions,
      },
      {
        where: {
          id,
        },
        returning: true,
      }
    );

    return APIresponse(res, "Gallery Updated", {
      gallery,
    });
  }


})
module.exports = {
  adminLogin,
  forgetPasswordAdmin,
  resetPasswordAdmin,
  AddGallery,
  getAllGallery,
  getGalleryImage,
  deleteGallery,
  updateGallery
};

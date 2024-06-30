const status = require("http-status");
const { MESSAGES } = require("../utils/constants");
const catchAsync = require("../utils/catchAsync");
const { APIresponse } = require("../utils/APIresponse");
const APIError = require("../utils/APIError");
const dbUtils = require("../utils/database");
const bcrypt = require("bcrypt");
const { sendEmailSendGrid } = require("../utils/email");
require("../config/passport");


const { User, Project } = require("../models");
const { createUserSchema } = require("../utils/schema/user");
const { idSchema } = require("../utils/schema/general");
const { Op } = require("sequelize");
const addUser = catchAsync(async (req, res, next) => {
  const { email, firstName, lastName, password, contactNo, roleId } = req.body;
  const createUserValidation = createUserSchema.validate(req.body);
  if (createUserValidation.error) {
    return next(
      new APIError(
        createUserValidation.error.details[0].message,
        status.BAD_REQUEST
      )
    );
  }
  const userExists = await User.findOne({
    where: { email: email },
  });
  if (userExists) {
    return next(new APIError(MESSAGES.USER_ALREADY_EXISTS, status.BAD_REQUEST));
  }
  const userPhone = await User.findOne({
    where: { contactNo: contactNo },
  });
  if (userPhone) {
    return next(new APIError("Contact Number is already exists", status.BAD_REQUEST));
  }
  const user = await User.create({
    email,
    firstName,
    lastName,
    password: await User.passwordHash(password),
    contactNo,
    userStatus: "true",
    roleId
  });
  const sendMail = await sendEmailSendGrid(
    user.email,
    MESSAGES.SIGNUP_MESSAGE,
    MESSAGES.SIGNUP_CONTENT(email, password, firstName)
  )
  return APIresponse(res, MESSAGES.USER_CREATED, {
    user,
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      roleId: {
        [Op.ne]: 1, // [Op.ne] means "not equal to"
      },
    },
  });

  return APIresponse(res, MESSAGES.SUCCESS, {
    users,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { email, firstName, lastName, password, contactNo, userStatus, roleId } =
    req.body;

  const { id } = req.params;
  const userExists = await User.findOne({
    where: { id },
  });

  if (!userExists) {
    return next(new APIError(MESSAGES.USER_NOT_EXISTS, status.BAD_REQUEST));
  }

  const user = await User.update(
    {
      email,
      firstName,
      lastName,
      // password,
      contactNo,
      userStatus,
      roleId
    },
    {
      where: {
        id,
      },

      returning: true,
    },
  );

  return APIresponse(res, MESSAGES.USER_UPDATED, {
    user,
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const idValidation = idSchema.validate(req.params);

  if (idValidation.error) {
    return next(
      new APIError(idValidation.error.details[0].message, status.BAD_REQUEST)
    );
  }

  const userExists = await User.findOne({
    where: { id },
  });

  if (!userExists) {
    return next(new APIError(MESSAGES.USER_NOT_EXISTS, status.BAD_REQUEST));
  }

  const user = await User.destroy({
    where: {
      id,
    },
  });

  return APIresponse(res, MESSAGES.MANAGER_DELETED, {
    user,
  });
});

const getSingleUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ where: { id } });

  if (!user) {
    return next(new APIError(MESSAGES.USER_NOT_EXISTS, status.BAD_REQUEST));
  }

  return APIresponse(res, MESSAGES.SUCCESS, {
    user,
  });
});

const getAllMangers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      roleId: 2
    },
  });

  return APIresponse(res, MESSAGES.SUCCESS, {
    users,
  });
});
const getAllVendors = catchAsync(async (req, res, next) => {
  const vendors = await User.findAll({
    where: {
      roleId: 3
    },
  });

  return APIresponse(res, MESSAGES.SUCCESS, {
    vendors,
  });
});
const getAllClient = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      roleId: 4
    },
  });

  return APIresponse(res, MESSAGES.SUCCESS, {
    users,
  });
});
const getAllWorker = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      roleId: 5
    },
  });

  return APIresponse(res, MESSAGES.SUCCESS, {
    users,
  });
});

const dashboardData = catchAsync(async (req, res, next) => {
  const manger = await User.findAndCountAll({
    where: {
      roleId: 2
    },
  });
  console.log(manger.count)
  const vendor = await User.findAndCountAll({
    where: {
      roleId: 3
    },
  });

  const client = await User.findAndCountAll({
    where: {
      roleId: 4
    },
  });
  const worker = await User.findAndCountAll({
    where: {
      roleId: 5
    },
  });
  const project = await Project.findAndCountAll({

  });

  return APIresponse(res, MESSAGES.SUCCESS, {
    manger: manger.count,
    vendor: vendor.count,
    client: client.count,
    worker: worker.count,
    project: project.count
  });
});
module.exports = {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getSingleUser,
  getAllMangers,
  getAllVendors,
  getAllClient,
  getAllWorker,
  dashboardData
};

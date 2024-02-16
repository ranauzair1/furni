"use strict";
const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const createAdmin = async () => {
  const admin = [
  {
    email: "admin@gmail.com",
    password: "qwerty@1",
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  ];
await User.bulkCreate(admin);
};


const seedDB = async () => {
  try {

    Promise.all
    await createAdmin();
  } catch (error) {
    console.log("There is some error in seeding database", error);
  }
};

seedDB();

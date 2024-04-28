"use strict";
const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const createAdmin = async () => {
  const admin = [
    {
      email: "ranauzair044@gmail.com",
      password: bcrypt.hashSync("Password@1", 8),
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

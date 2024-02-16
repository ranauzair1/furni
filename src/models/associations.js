const ForgetPasswordToken = require("./forgetPasswordToken");
const Role = require("./role")
const User = require("./users");
const Project = require("./project");
const ProjectMember = require("./projectmember");
const ProjectImage = require("./projectImages");
const Post = require("./posts");

ForgetPasswordToken.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: "UserId",
  unique: true,
});
Role.hasMany(User, {
  onDelete: "CASCADE",
  foreignKey: "roleId",
  unique: true,
});
User.belongsTo(Role, {
  onDelete: "CASCADE",
  foreignKey: "roleId",
  unique: true,
});
User.hasMany(Project, {
  onDelete: "CASCADE",
  foreignKey: "id",
  unique: true,
});
Project.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: "id",
  unique: true,
});
Project.hasMany(ProjectMember, {
  onDelete: "CASCADE",
  foreignKey: "projectId",
  unique: true,
});
ProjectMember.belongsTo(Project, {
  onDelete: "CASCADE",
  foreignKey: "projectId",
  unique: true,
});
User.hasMany(ProjectMember, {
  onDelete: "CASCADE",
  foreignKey: "id",
  unique: true,
});
ProjectMember.belongsTo(User, {
  onDelete: "CASCADE",
  foreignKey: "id",
  unique: true,
});

Project.hasMany(ProjectImage, {
  onDelete: "CASCADE",
  foreignKey: "projectId",
  unique: true,
});
ProjectImage.belongsTo(Project, {
  onDelete: "CASCADE",
  foreignKey: "projectId",
  unique: true,
});

Project.hasMany(ProjectImage, {
  onDelete: "CASCADE",
  foreignKey: "projectId",
  unique: true,
});
ProjectImage.belongsTo(Project, {
  onDelete: "CASCADE",
  foreignKey: "projectId",
  unique: true,
});

User.hasMany(ProjectImage, {
  foreignKey: "userId",
});
ProjectImage.belongsTo(User, {
  foreignKey: "userId",
});

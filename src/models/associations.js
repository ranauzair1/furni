const ForgetPasswordToken = require("./forgetPasswordToken");
const Role = require("./role")
const User = require("./users");
const Project = require("./project");
const ProjectMember = require("./projectmember");
// const ProjectImage = require("./projectImages");
const comments = require("./comments")
const Post = require("./posts");
const projectImages = require("./projectImages");

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

Project.hasMany(projectImages, {
  onDelete: "CASCADE",
  foreignKey: "projectId",
  unique: true,
});
projectImages.belongsTo(Project, {
  onDelete: "CASCADE",
  foreignKey: "projectId",
  unique: true,
});

projectImages.belongsTo(Post, {
  
  foreignKey: "postId",
});

Post.hasMany(projectImages, {
  foreignKey: "postId",
});

User.hasMany(comments, {
  foreignKey: "clientId",
});

comments.belongsTo(User, {
  foreignKey: "clientId",
});


Post.hasMany(comments, {
  foreignKey: "postId",
});

comments.belongsTo(Post, {
  foreignKey: "postId",
});


projectImages.hasMany(comments, {
  foreignKey: "postImageId",
});

comments.belongsTo(projectImages, {
  foreignKey: "postImageId",
});
User.hasMany(Post, {
  foreignKey: "clientId",
});
Post.belongsTo(User, {
  foreignKey: "clientId",
});
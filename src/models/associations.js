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
  onDelete: "CASCADE",

  foreignKey: "postId",
});

Post.hasMany(projectImages, {
  foreignKey: "postId",
  onDelete: "CASCADE",

});

User.hasMany(comments, {
  foreignKey: "clientId",
  onDelete: "CASCADE",

});

comments.belongsTo(User, {
  foreignKey: "clientId",
  onDelete: "CASCADE",

});


Post.hasMany(comments, {
  foreignKey: "postId",
  onDelete: "CASCADE",

});

comments.belongsTo(Post, {
  foreignKey: "postId",
  onDelete: "CASCADE",

});


projectImages.hasMany(comments, {
  foreignKey: "postImageId",
  onDelete: "CASCADE",

});

comments.belongsTo(projectImages, {
  foreignKey: "postImageId",
  onDelete: "CASCADE",

});
User.hasMany(Post, {
  foreignKey: "clientId",
  onDelete: "CASCADE",

});
Post.belongsTo(User, {
  foreignKey: "clientId",
  onDelete: "CASCADE",

});
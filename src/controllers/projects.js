const status = require("http-status");
const { MESSAGES } = require("../utils/constants");
const catchAsync = require("../utils/catchAsync");
const { APIresponse } = require("../utils/APIresponse");
const APIError = require("../utils/APIError");
const dbUtils = require("../utils/database");
const { uploadFile } = require("../utils/fileUpload");
const path = require("path");

const { pagination } = require("../utils/pagination");

const ip = require("ip");
const { Op } = require("sequelize");
const { User, Project, ProjectMember, comments } = require("../models");
const ProjectImage = require("../models/projectImages");
const { project } = require(".");
const Post = require("../models/posts");

const addProject = catchAsync(async (req, res, next) => {
  const { title, descriptions, startDate, estimationTime, clientId } = req.body;
  const ipv4Address = ip.address();
  let project = await Project.create({
    title,
    descriptions,
    startDate,
    estimationTime,
    clientId,
  });

  const numberOfFiles = Object.entries(req.files).length;
  console.log("i am here--->", numberOfFiles);
  if (numberOfFiles > 0) {
    const files = Array.isArray(req.files.avatar)
      ? req.files.avatar
      : [req.files.avatar];
    if (files !== undefined) {
      console.log(__dirname);
      const savePath = path.join(__dirname, "../uploads");
      for (const file of files) {
        const fileName = file.name;
        console.log();
        await uploadFile(file, savePath, file.name);
        console.log("===========>", project.id);
        const filepath = `http://${ipv4Address}:4000/uploads/` + fileName;
        const ProjectImages = await ProjectImage.create({
          imageUrl: filepath ?? null,
          projectId: project.id,
        });
      }
    }
  }

  const projects = await Project.findOne({
    include: [
      {
        model: ProjectImage,
      },
    ],
    where: {
      id: project.id,
    },
  });
  project.id = null;

  return APIresponse(res, MESSAGES.USER_CREATED, {
    projects,
  });
});
const asigningProject = catchAsync(async (req, res, next) => {
  const { clientIds, vendorIds, managerIds, workerIds, projectId } = req.body;
  const users = [
    { userType: "Client", userIds: clientIds },
    { userType: "Vendor", userIds: vendorIds },
    { userType: "Manager", userIds: managerIds },
    { userType: "Worker", userIds: workerIds },
  ];
  const projectAssigned = await Promise.all(
    users.map(async ({ userType, userIds }) => {
      return Promise.all(
        userIds.map(async (userId) => {
          return await ProjectMember.create({
            projectId,
            userId,
            userType,
          });
        })
      );
    })
  );
  return APIresponse(res, MESSAGES.USER_CREATED, {
    projectAssigned,
  });
});
const getAllworkerProjects = catchAsync(async (req, res, next) => {
  const { workerIds } = req.query;
  console.log("req.body==========>", workerIds);
  const managerProjects = await ProjectMember.findAll({
    where: {
      userId: workerIds,
      userType: "Worker",
    },
    include: [
      {
        model: Project,
        attributes: [
          "id",
          "title",
          "descriptions",
          "startDate",
          "estimationTime",
          "clientId",
        ],
        foreignKey: "projectId",
      },
    ],
  });
  return APIresponse(res, MESSAGES.USER_CREATED, managerProjects);
});
const getAllmangerprojects = catchAsync(async (req, res, next) => {
  const { managerIds } = req.query;
  const managerProjects = await ProjectMember.findAll({
    where: {
      userId: managerIds,
      userType: "Manager",
    },
    include: [
      {
        model: Project,
        attributes: [
          "id",
          "title",
          "descriptions",
          "startDate",
          "estimationTime",
          "clientId",
        ],
        foreignKey: "projectId",
      },
    ],
  });

  return APIresponse(res, MESSAGES.USER_CREATED, managerProjects);
});
const getAllvenderprojects = catchAsync(async (req, res, next) => {
  const { vendorIds } = req.query;
  const projectsVender = await ProjectMember.findAll({
    where: {
      userId: vendorIds,
      userType: "Vendor",
    },
    include: [
      {
        model: Project,
        attributes: [
          "id",
          "title",
          "descriptions",
          "startDate",
          "estimationTime",
          "clientId",
        ],
        foreignKey: "projectId",
      },
    ],
  });

  return APIresponse(res, MESSAGES.USER_CREATED, projectsVender);
});
const getAllclientprojects = catchAsync(async (req, res, next) => {
  const { clientIds } = req.query;
  const clientprojects = await Project.findAndCountAll({
    where: {
      clientId: clientIds,
    },
  });
  return APIresponse(res, "Success", clientprojects);
});
const creatPost = catchAsync(async (req, res, next) => {
  const { projectId, clientId, description } = req.body;
  const ipv4Address = ip.address();

  const post = await Post.create({
    projectId,
    clientId,
    description,
  });
  console.log("post", post.id, projectId);
  const postImage = await ProjectImage.create({
    postId: post.id,
    projectId: projectId,
  });
  console.log("postImage");
  let postImages = await ProjectImage.findOne({
    where: { postId: post.id, projectId },
  });
  const numberOfFiles = Object.entries(req.files).length;
  if (numberOfFiles > 0) {
    const files = Array.isArray(req.files.avatar)
      ? req.files.avatar
      : [req.files.avatar];
    if (files !== undefined) {
      console.log(__dirname);
      const savePath = path.join(__dirname, "../uploads/");
      for (const file of files) {
        const fileName = file.name;
        console.log();
        await uploadFile(file, savePath, file.name);
        const filepath = `http://${ipv4Address}:4000/uploads/` + fileName;
        if (postImages) {
          console.log("i am here1");

          let ProjectImages = await ProjectImage.update(
            {
              imageUrl: filepath ?? null,
              projectId: projectId,
            },
            {
              where: {
                postId: post.id,
              },
            }
          );
          postImages = null;
        } else {
          console.log("i am heqresssssss1");
          const ProjectImages = await ProjectImage.create({
            imageUrl: filepath ?? null,
            projectId: projectId,
            postId: post.id,
          });
        }
      }
    }
  }

  console.log(post.id);
  const posts = await Post.findAll({
    include: {
      model: ProjectImage,
      where: {
        postId: post.id,
        projectId,
      },
    },
  });

  return APIresponse(res, "Success", posts);
});
const addComments = catchAsync(async (req, res, next) => {
  const { postImageId, clientId, postId, Comment } = req.body;

  console.log(postImageId, clientId, postId, Comment);

  const post = await comments.create({
    postImageId,
    clientId,
    postId,
    Comment,
  });

  return APIresponse(res, "Success", post);
});
const getUserAllPostComments = catchAsync(async (req, res, next) => {
  const { postImageId, clientId, postId, Comment } = req.body;
  // const post = await User.findAndCountAll({
  //   include: {

  //     model: comments,
  //     where: {
  //       postId
  //     },
  //   }
  // });
  const post = await User.findAll({
    where: {
      id: clientId,
    },
    include: {
      model: Post,
      include: {
        model: comments,
        where: {
          postId,
        },
      },
    },
  });
  return APIresponse(res, "Success", post);
});

const getAllPostComments = catchAsync(async (req, res, next) => {
  const { postId, postImageId } = req.body;
  const post = await Post.findAll({
    where: {
      id: postId,
    },
    include: {
      model: comments,
      include: {
        model: User,
      },
      where: {
        postId,
        postImageId,
      },
    },
  });
  return APIresponse(res, "Success", post);
});

const getAllProjectPosts = catchAsync(async (req, res, next) => {
  const { projectId } = req.body;

  const posts = await Post.findAll({
    where: {
      projectId,
    },
    include: [
      {
        model: comments,
        include: [
          {
            model: User,
          },
        ],
      },
      {
        model: ProjectImage,
      },
      { model: User },
    ],
    order: [["id", "DESC"]],
  });

  return APIresponse(res, "Success", posts);
});

const getProjectMemebers = catchAsync(async (req, res, next) => {
  const { projectId } = req.body;

  const members = await ProjectMember.findAll({
    where: {
      projectId,
    },
    include: [
      {
        model: User,
      },
    ],
    order: [["id", "DESC"]],
  });

  return APIresponse(res, "Success", members);
});

module.exports = {
  addProject,
  asigningProject,
  getAllmangerprojects,
  getAllworkerProjects,
  getAllvenderprojects,
  getAllclientprojects,
  creatPost,
  addComments,
  getAllProjectPosts,
  getProjectMemebers,
  getUserAllPostComments,
  getAllPostComments,
};

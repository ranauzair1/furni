const status = require("http-status");
const { MESSAGES } = require("../utils/constants");
const catchAsync = require("../utils/catchAsync");
const { APIresponse } = require("../utils/APIresponse");
const { uploadToS3 } = require("../utils/fileUpload");
const { User, Project, ProjectMember, comments } = require("../models");
const ProjectImage = require("../models/projectImages");
const Post = require("../models/posts");
const addProject = catchAsync(async (req, res, next) => {
  const { title, descriptions, startDate, estimationTime, clientId } = req.body;
  let project = await Project.create({
    title,
    descriptions,
    startDate,
    estimationTime,
    clientId,
  });
  console.log("===", req.files)
  const numberOfFiles = Object.entries(req.files).length;
  if (numberOfFiles > 0) {
    const files = Array.isArray(req.files.avatar)
      ? req.files.avatar
      : [req.files.avatar];
    if (files !== undefined) {
      for (const file of files) {
        const url = await uploadToS3(file)
        console.log("======>file----->", file)

        // const result = await uploadToCloudinary(file.tempFilePath, { public_id: file.originalname });

        // console.log(result?.url)

        const ProjectImages = await ProjectImage.create({
          imageUrl: url ?? null,
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
const getAllprojects = catchAsync(async (req, res, next) => {
  const projectsVender = await Project.findAndCountAll({
  });

  return APIresponse(res, "Success", projectsVender);
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

  const post = await Post.create({
    projectId,
    clientId,
    description,
  });
  const postImage = await ProjectImage.create({
    postId: post.id,
    projectId: projectId,
  });
  let postImages = await ProjectImage.findOne({
    where: { postId: post.id, projectId },
  });
  const numberOfFiles = Object.entries(req.files).length;
  if (numberOfFiles > 0) {
    const files = Array.isArray(req.files.avatar)
      ? req.files.avatar
      : [req.files.avatar];
    if (files !== undefined) {
      for (const file of files) {
        let url = await uploadToS3(file)
        if (postImages) {
          let ProjectImages = await ProjectImage.update(
            {
              imageUrl: url ?? null,
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
          const ProjectImages = await ProjectImage.create({
            imageUrl: url ?? null,
            projectId: projectId,
            postId: post.id,
          });
        }
      }
    }
  }

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
  getAllprojects,
  getProjectMemebers,
  getUserAllPostComments,
  getAllPostComments,
};

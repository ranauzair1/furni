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
const { User, Project, ProjectMember } = require("../models");
const ProjectImage = require("../models/projectImages");
const { project } = require(".");


const addProject = catchAsync(async (req, res, next) => {
    const { title, descriptions, startDate, estimationTime, clientId } = req.body;
    const ipv4Address = ip.address();
    let project = await Project.create({
        title,
        descriptions,
        startDate,
        estimationTime,
        userId: clientId,
    });
    if (req.files !== null) {
        const files = Array.isArray(req.files.avatar) ? req.files.avatar : [req.files.avatar];
        if (files !== undefined) {
            const savePath = path.join(__dirname, "./../uploads/")
            for (const file of files) {
                const fileName = file.name
                console.log()
                await uploadFile(file, savePath, file.name)
                console.log("===========>", project.id)
                const filepath = `http://${ipv4Address}:4000/uploads/` + fileName
                const ProjectImages = await ProjectImage.create({
                    imageUrl: filepath ?? null,
                    projectId: project.id
                })
            }
        }
    }
    const projects = await Project.findOne({
        include: [
            {
                model: ProjectImage
            }],
        where: {
            id: project.id
        }
    })
    project.id = null

    return APIresponse(res, MESSAGES.USER_CREATED, {
        projects,
    });
});
const asigningProject = catchAsync(async (req, res, next) => {
    const { clientIds, vendorIds, managerIds, workerIds, projectId } = req.body;
    const users = [
        { userType: 'Client', userIds: clientIds },
        { userType: 'Vendor', userIds: vendorIds },
        { userType: 'Manager', userIds: managerIds },
        { userType: 'Worker', userIds: workerIds }
    ];
    const projectAssigned = await Promise.all(
        users.map(async ({ userType, userIds }) => {
            return Promise.all(userIds.map(async userId => {
                return await ProjectMember.create({
                    projectId,
                    userId,
                    userType
                });
            }));
        })
    );
    return APIresponse(res, MESSAGES.USER_CREATED, {
        projectAssigned,
    });
});
const getAllworkerProjects = catchAsync(async (req, res, next) => {
    const { workerIds } = req.query;
    console.log("req.body==========>", workerIds)
    const managerProjects = await ProjectMember.findAll({
        where: {
            userId: workerIds,
            userType: "Worker",
        },
        include: [
            {
                model: Project,
                attributes: ['id', 'title', 'descriptions', 'startDate', 'estimationTime', 'userId'],
                foreignKey: 'projectId',
            },
        ],
    });
    return APIresponse(res, MESSAGES.USER_CREATED,
        managerProjects,
    );
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
                attributes: ['id', 'title', 'descriptions', 'startDate', 'estimationTime', 'userId'],
                foreignKey: 'projectId',
            },
        ],
    });


    return APIresponse(res, MESSAGES.USER_CREATED,
        managerProjects,
    );
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
                attributes: ['id', 'title', 'descriptions', 'startDate', 'estimationTime', 'userId'],
                foreignKey: 'projectId',
            },
        ],
    });


    return APIresponse(res, MESSAGES.USER_CREATED,
        projectsVender,
    );
});
const getAllclientprojects = catchAsync(async (req, res, next) => {
    const { clientIds } = req.query;
    const clientprojects = await Project.findAndCountAll({
        where: {
            userId: clientIds,
        },
    });
    return APIresponse(res, "Success",
        clientprojects,
    );
});



module.exports = {
    addProject,
    asigningProject,
    getAllmangerprojects,
    getAllworkerProjects,
    getAllvenderprojects,
    getAllclientprojects
}
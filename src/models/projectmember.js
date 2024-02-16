const { Model, DataTypes } = require('sequelize')
const sequelize = require("../config/db.config"); // If MODELS.ADMIN is defined in a separate file
const { MODELS } = require('../utils/constants');
class ProjectMember extends Model {
}

ProjectMember.init(
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: MODELS.PROJECTS,
                key: "id",
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: MODELS.USER,
                key: "id",
            },
        },
        userType: {
            type: DataTypes.ENUM('Worker', 'Vendor', 'Client', 'Manager'),
        }


    },
    {
        sequelize,
        modelName: MODELS.ProjectMember,
    }
);

module.exports = ProjectMember;

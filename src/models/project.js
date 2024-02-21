const { Model, DataTypes } = require('sequelize')
const sequelize = require("../config/db.config"); // If MODELS.ADMIN is defined in a separate file
const { MODELS } = require('../utils/constants');
class Project extends Model {
}

Project.init(
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        descriptions: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        startDate: {
            type: DataTypes.STRING(255),

        }, estimationTime: {
            type: DataTypes.STRING(255),

        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: MODELS.USER,
                key: "id",
            },
        }

    },
    {
        sequelize,
        modelName: MODELS.PROJECTS,
    }
);

module.exports = Project;

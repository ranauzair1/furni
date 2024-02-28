const { Model, DataTypes } = require('sequelize')
const sequelize = require("../config/db.config"); // If MODELS.ADMIN is defined in a separate file
const { MODELS } = require('../utils/constants');
class Post extends Model {
}

Post.init(
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        description: {
            type: DataTypes.STRING,
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: MODELS.PROJECTS,
                key: "id",
            },
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: MODELS.USER,
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: MODELS.Post,
    }
);

module.exports = Post;

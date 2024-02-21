const { Model, DataTypes } = require('sequelize')
const sequelize = require("../config/db.config"); // If MODELS.ADMIN is defined in a separate file
const { MODELS } = require('../utils/constants');
class Comment extends Model {
}

Comment.init(
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        postId: {
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
        Comment: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        postImageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: MODELS.PROJECTIMAGE,
                key: "id",
            },
        }
    },
    {
        sequelize,
        modelName: MODELS.Comment,
    }
);

module.exports = Comment;

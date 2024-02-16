const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config"); // If MODELS.ADMIN is defined in a separate file
const { MODELS } = require("../utils/constants");
class ProjectImage extends Model {
}
ProjectImage.init(
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: MODELS.PROJECTS,
                key: "id",
            },
        },
        imageUrl: {
            type: DataTypes.STRING(225),
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: MODELS.Post,
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: MODELS.PROJECTIMAGE,
    }
);
module.exports = ProjectImage;

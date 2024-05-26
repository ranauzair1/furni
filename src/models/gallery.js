const { Model, DataTypes } = require('sequelize')
const sequelize = require("../config/db.config"); // If MODELS.ADMIN is defined in a separate file
const { MODELS } = require('../utils/constants');
class Gallery extends Model {
}

Gallery.init(
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
        galleryImage: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        descriptions: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },


    },
    {
        sequelize,
        modelName: MODELS.GALLERY,
    }
);

module.exports = Gallery;

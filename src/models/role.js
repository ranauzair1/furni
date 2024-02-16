const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config"); // If MODELS.ADMIN is defined in a separate file
const { MODELS } = require("../utils/constants");
class Role extends Model {
}

Role.init(
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        role: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: true,
        },

    },
    {
        sequelize,
        modelName: MODELS.ROLE,
    }
);

module.exports = Role;

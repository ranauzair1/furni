const { Model, DataTypes } = require('sequelize')
const sequelize = require("../config/db.config"); // If MODELS.ADMIN is defined in a separate file
const { MODELS } = require('../utils/constants');

const bcrypt = require("bcrypt")
const crypto = require("crypto");


class User extends Model {

    static async passwordHash(pass) {
        const hash = bcrypt.hash(pass, 8)
        return hash
    }
    static async generateForgotPasswordToken() {
        return crypto.randomBytes(16).toString("hex");
    }
    static async hashCompare(pass, dbpassword) {
        const unhash = bcrypt.compareSync(pass, dbpassword)
        return unhash
    }

    static async generateUnique5DigitNumber() {
        const timestamp = new Date().getTime();
        const randomPart = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
        const uniqueNumber = `${timestamp}${randomPart}`;
        const unique5DigitNumber = uniqueNumber.slice(-5);
        return parseInt(unique5DigitNumber, 10); // Convert to integer
    }


}

User.init(
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },

        firstName: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        lastName: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: true,
        },
        contactNo: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: true,
        }, fisrtTimeLogin: {
            type: DataTypes.BOOLEAN,

        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        userStatus: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: MODELS.ROLE,
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: MODELS.USER,
    }
);

module.exports = User;

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const { MODELS } = require("../utils/constants");

class ForgetPasswordToken extends Model {}

ForgetPasswordToken.init(
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    UserId: {
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
    modelName: MODELS.FORGETPASSWORDTOKEN,
  }
);

module.exports = ForgetPasswordToken;

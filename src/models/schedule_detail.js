"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Schedule_detail.init(
    {
      idSchedule: DataTypes.INTEGER,
      idNSD: DataTypes.INTEGER,
      deliveredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Schedule_detail",
    }
  );
  return Schedule_detail;
};

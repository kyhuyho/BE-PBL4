"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Schedule.init(
    {
      image: DataTypes.BLOB("long"),
      title: DataTypes.TEXT,
      desc: DataTypes.TEXT,
      idNVC: DataTypes.INTEGER,
      time: DataTypes.STRING,
      distance: DataTypes.STRING,
      money: DataTypes.STRING,
      startDay: DataTypes.DATE,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );
  return Schedule;
};

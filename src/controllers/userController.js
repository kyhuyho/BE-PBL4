import db from "../models";
import userService from "../services/userService";
import fs from "fs";
let handleLogin = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  }
  let userData = await userService.handleUserLogin(username, password);
  if (userData.errCode === 0) {
    return res.status(200).json(userData.data);
  }
  return res.status(500).json({
    message: userData.errMessage,
  });
};
let handleCreateUsers = async (req, res) => {
  let data = req.body;
  if (!data) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  }
  let userData = await userService.createUsers(data);
  if (userData.errCode === 0) {
    return res.status(200).json(userData.errMessage);
  }
  return res.status(500).json({
    message: userData.errMessage,
  });
};
module.exports = {
  handleLogin: handleLogin,
  handleCreateUsers: handleCreateUsers,
};

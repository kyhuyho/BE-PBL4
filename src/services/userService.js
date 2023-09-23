import db from "../models/index";
import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { DATE } from "sequelize";
const salt = bcrypt.genSaltSync(10);
const GeneralAccessToken = (data) => {
  const access_token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return access_token;
};
let handleUserLogin = async (username, password) => {
  let userData = {};
  try {
    let isExits = await checkUserUsername(username);
    if (isExits) {
      // user already exits
      //compare password
      let user = await db.User.findOne({
        attributes: ["username", "password", "roleID", "id"],
        where: { username: username },
        raw: true,
      });
      if (user) {
        let check = await bcrypt.compareSync(password, user.password);
        if (check) {
          const access_token = GeneralAccessToken({
            id: user.id,
            roleID: user.roleID,
          });
          userData.errCode = 0;
          userData.errMessage = "ok";
          delete user.password;
          userData.data = {
            access_token,
            user,
          };
        } else {
          userData.errCode = 3;
          userData.errMessage = " Wrong password";
        }
      } else {
        userData.errCode = 2;
        userData.errMessage = "User's not found";
      }
    } else {
      userData.errCode = 1;
      userData.errMessage =
        "Your's Username isn't exits in your system. Please try other email! ";
    }
  } catch (e) {
    userData.errCode = 1;
    userData.errMessage = e;
  }
  return userData;
};
let checkUserUsername = (userUsername) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { username: userUsername },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hash = await bcrypt.hashSync(password, salt);
      resolve(hash);
    } catch (e) {
      reject(e);
    }
  });
};
let createUsers = async (data) => {
  let userData = {};
  try {
    let hashPasswordFromBcrypt = await hashUserPassword(data.password);
    await db.User.create({
      username: data.username,
      password: hashPasswordFromBcrypt,
      fullname: data.fullname,
      roleID: "2",
      phonenumber: data.phonenumber,
    });
    userData.errCode = 0;
    userData.errMessage = "Create users succeed";
  } catch (e) {
    userData.errCode = 1;
    userData.errMessage = "Create users failed";
  }
  return userData;
};
module.exports = {
  handleUserLogin: handleUserLogin,
  createUsers: createUsers,
};

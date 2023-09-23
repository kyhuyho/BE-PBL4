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
let getAllSchedules = async () => {
  let data = {};
  try {
    let schedules;
    schedules = await db.Schedule.findAll({});
    schedules = schedules.map((sche) => {
      if (sche.image == null) return sche;
      sche.image = Buffer.from(sche.image).toString("base64");
      return sche;
    });
    data.schedules = schedules;
    data.errCode = 0;
    return data;
  } catch (e) {
    data.errCode = 1;
    data.errMessage = e;
    return data;
  }
};
let createSchedules = async (data, iduser) => {
  let scheduleData = {};
  try {
    let user = await db.User.findOne({
      where: { id: iduser },
    });
    await db.Schedule.create({
      image: data.image,
      title: data.title,
      desc: data.desc,
      idNVC: user.id,
      time: data.time,
      distance: data.distance,
      money: data.money,
      startDay: data.startDay,
      status: "Chưa đặt",
    });
    scheduleData.errCode = 0;
    scheduleData.errMessage = "Create schedules succeed";
  } catch (e) {
    scheduleData.errCode = 1;
    scheduleData.errMessage = "Create schedules failed";
  }
  return scheduleData;
};
let updateSchedules = async (user, data, id) => {
  let scheduleData = {};
  try {
    if (!id) {
      scheduleData.errCode = 2;
      scheduleData.errMessage = "Missing required parameter";
      return scheduleData;
    }
    let schedules = await db.Schedule.findOne({
      where: { id: id },
      raw: false,
    });
    if (schedules.idNVC === user.id || user.roleID === "0") {
      if (schedules) {
        schedules.title = data.title;
        schedules.desc = data.desc;
        schedules.time = data.time;
        schedules.distance = data.distance;
        schedules.money = data.money;
        schedules.startDay = data.startDay;
        await schedules.save();
        scheduleData.errCode = 0;
        scheduleData.errMessage = "Update the schedules succeeds";
      } else {
        scheduleData.errCode = 1;
        scheduleData.errMessage = "Schedules's not found! ";
      }
    } else {
      scheduleData.errCode = 2;
      scheduleData.errMessage = "Missing required parameter";
      return scheduleData;
    }
  } catch (e) {
    console.log(e);
  }
  return scheduleData;
};
let deleteSchedules = async (user, idschedules) => {
  let scheduleData = {};
  let data = await db.Schedule.findOne({
    where: { id: idschedules },
  });
  if (!data) {
    scheduleData.errCode = 1;
    scheduleData.errMessage = "The schedules isn't exits";
    return scheduleData;
  }
  let schedule_detail = await db.Schedule_detail.findOne({
    where: { idSchedule: data.id },
  });
  if (schedule_detail) {
    scheduleData.errCode = 3;
    scheduleData.errMessage = "The schedule has been made, cannot be deleted";
    return scheduleData;
  }
  if (user.id === data.idNVC || user.roleID === "0") {
    await db.Schedule.destroy({
      where: { id: idschedules },
    });
    scheduleData.errCode = 0;
    scheduleData.errMessage = "The schedules is deleted";
  } else {
    scheduleData.errCode = 2;
    scheduleData.errMessage = "Not promission";
  }
  return scheduleData;
};
let getSchedulesByID = async (user, idschedules) => {
  let data = {};
  try {
    let schedulesbyid = await db.Schedule.findOne({
      where: { id: idschedules },
    });
    schedulesbyid.image = Buffer.from(schedulesbyid?.image).toString("base64");
    data.schedules = schedulesbyid;
    data.status = 0;
    data.errCode = 0;
    // 0 chua dang nhap 1 da dat 2 chua dat 3 het han 4 admin
    if (!user) {
      data.status = "CHUADANGNHAP";
      return data;
    }
    if (user.roleID === "0") {
      data.status = "QLXEM";
      return data;
    }
    if (new Date(schedulesbyid.startDay).getTime() < new Date().getTime()) {
      data.status = "HETHAN";
      return data;
    }
    if (schedulesbyid.idNVC === user.id) {
      let id = await db.Schedule_detail.findOne({
        where: { idSchedule: idschedules },
      });
      if (id) {
        data.status = "NVCXEM1";
      } else {
        data.status = "NVCXEM0";
      }
      return data;
    }
    let id = await db.Schedule_detail.findOne({
      where: { idNSD: user.id, idSchedule: idschedules },
    });
    if (!id) {
      data.status = "CHUADAT";
    } else {
      data.status = "DADAT";
    }
    return data;
  } catch (e) {
    data.errCode = 1;
    data.errMessage = e;
    console.log(e);
    return data;
  }
};
let scheduled = async (idLT, idnsd) => {
  let data = {};
  try {
    if (!idLT || !idnsd) {
      data.errCode = 2;
      data.errMessage = "Missing required parameter";
      return data;
    }
    let schedules = await db.Schedule.findOne({
      where: { id: idLT },
      raw: false,
    });
    let user = await db.User.findOne({
      where: { id: idnsd },
    });
    if (!schedules || !user) {
      data.errCode = 1;
      data.errMessage = "Not exits";
      return data;
    }
    let check = await db.Schedule_detail.findOne({
      where: { idSchedule: schedules.id, idNSD: user.id },
    });
    if (check) {
      data.errCode = 2;
      data.errMessage = "Bạn đã bấm đặt . Xin vui lòng kiểm tra lại";
      return data;
    }
    if (schedules) {
      schedules.status = 1;
      await schedules.save();
      await db.Schedule_detail.create({
        idSchedule: schedules.id,
        idNSD: user.id,
      });
      data.errCode = 0;
      data.errMessage = "Đặt lịch thành công";
    } else {
      data.errCode = 1;
      data.errMessage = "Đặt lịch thất bại";
    }
  } catch (e) {
    console.log(e);
  }
  return data;
};
let cancelScheduled = async (idLT, idnsd) => {
  let data = {};
  try {
    if (!idLT || !idnsd) {
      data.errCode = 2;
      data.errMessage = "Missing required parameter";
      return data;
    }
    let scheduled_detail = await db.Schedule_detail.findOne({
      where: { idSchedule: idLT, idNSD: idnsd },
      raw: false,
    });
    if (!scheduled_detail) {
      data.errCode = 1;
      data.errMessage = "User not exits";
      return data;
    }
    await db.Schedule_detail.destroy({
      where: { idSchedule: idLT, idNSD: idnsd },
    });
    let schedule = await db.Schedule.findOne({
      where: { id: idLT },
      raw: false,
    });
    if (schedule) {
      schedule.status = "Chưa đặt";
      await schedule.save();
    }
    data.errCode = 0;
    data.errMessage = "Cancel successfully ";
    return data;
  } catch (e) {
    console.log(e);
  }
  return data;
};
let GetSchedulesByIDNVC = async (iduser) => {
  let data = {};
  try {
    let schedules = await db.Schedule.findAll({
      where: { idNVC: iduser },
    });
    schedules = schedules.map((sche) => {
      if (sche.image == null) return sche;
      sche.image = Buffer.from(sche.image).toString("base64");
      return sche;
    });
    data.schedules = schedules;
    data.errCode = 0;
  } catch (error) {
    data.errCode = 1;
    data.errMessage = error;
  }
  return data;
};
let GetSchedulesByIDNSD = async (iduser) => {
  let data = {};
  try {
    let schedules_detail = await db.Schedule_detail.findAll({
      where: { idNSD: iduser },
    });
    let schedule = [];
    for (let i = 0; i < schedules_detail.length; i++) {
      let kq = await db.Schedule.findOne({
        where: { id: schedules_detail[i].idSchedule },
      });
      schedule.push(kq);
    }
    data.schedule = schedule;
    data.errCode = 0;
    return data;
  } catch (error) {
    data.errCode = 1;
    data.message = error;
    return data;
  }
};
let GetPeopleScheduled = async (iduser, idschedules) => {
  let data = {};
  try {
    let schedules = await db.Schedule.findOne({
      where: { id: idschedules },
    });
    if (iduser === schedules.idNVC) {
      let listschedule_detail = await db.Schedule_detail.findAll({
        where: { idSchedule: idschedules },
      });
      for (let i = 0; i < listschedule_detail.length; i++) {
        let user = await db.User.findOne({
          where: { id: listschedule_detail[i].idNSD },
        });
        listschedule_detail[i].User = user;
      }
      data.listschedule_detail = listschedule_detail;
      data.errCode = 0;
      data.errMessage = "Succeed";
      return data;
    }
  } catch (error) {
    data.errCode = 1;
    data.errMessage = error;
  }
  return data;
};
let AddCommentByID = async (nd, idnv, idSchedule) => {
  let data = {};
  try {
    await db.Evaluate.create({
      idSchedule: idSchedule,
      idNV: idnv,
      content: nd,
    });
    data.errCode = 0;
    data.errMessage = "AddComment succeed";
    return data;
  } catch (error) {
    data.errCode = 1;
    data.errMessage = "Add Comment failed";
  }
  return data;
};
let GetCommentByIDLT = async (idSchedule) => {
  let data = {};
  try {
    let listcomment = await db.Evaluate.findAll({
      where: { idSchedule: idSchedule },
    });
    for (let i = 0; i < listcomment.length; i++) {
      let user = await db.User.findOne({
        where: { id: listcomment[i].idNV },
      });
      listcomment[i].User = user;
    }
    data.listcomment = listcomment;
    data.errCode = 0;
    data.errMessage = "Succeed";
    return data;
  } catch (error) {
    data.errCode = 1;
    data.errMessage = error;
  }
  return data;
};
let ConfirmSchedule = async (idSchedule) => {
  let data = {};
  const deliveryAt = new Date();
  try {
    let schedules = await db.Schedule_detail.findAll({
      where: { idSchedule: idSchedule },
    });
    for (let i = 0; i < schedules.length; i++) {
      let schedule = await db.Schedule_detail.findOne({
        where: { idSchedule: schedules[i].idSchedule },
        raw: false,
      });
      schedule.deliveredAt = deliveryAt;
      await schedule.save();
    }
    data.errCode = 0;
    data.errMessage = "Update the schedules succeeds";
  } catch (e) {
    console.log(e);
  }
  return data;
};
let getTimeDeleveryByIdSchedule = async (idSchedule) => {
  let data = {};
  try {
    let schedules = await db.Schedule_detail.findOne({
      where: { idSchedule: idSchedule },
    });
    if (!schedules) {
      data.errCode = 1;
      data.deliveredAt = null;
      data.errMessage = "The order has not been delivered yet";
    }
    data.deliveredAt = schedules.deliveredAt;
    data.errCode = 0;
    data.errMessage = "Update the schedules succeeds";
    return data;
  } catch (e) {
    console.log(e);
  }
  return data;
};
module.exports = {
  getAllSchedules: getAllSchedules,
  createSchedules: createSchedules,
  updateSchedules: updateSchedules,
  deleteSchedules: deleteSchedules,
  getSchedulesByID: getSchedulesByID,
  scheduled: scheduled,
  cancelScheduled: cancelScheduled,
  GetSchedulesByIDNVC: GetSchedulesByIDNVC,
  GetSchedulesByIDNSD: GetSchedulesByIDNSD,
  GetPeopleScheduled: GetPeopleScheduled,
  AddCommentByID: AddCommentByID,
  GetCommentByIDLT: GetCommentByIDLT,
  ConfirmSchedule: ConfirmSchedule,
  getTimeDeleveryByIdSchedule: getTimeDeleveryByIdSchedule,
};

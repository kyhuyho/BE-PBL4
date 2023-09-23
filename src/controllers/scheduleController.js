import db from "../models";
import userService from "../services/scheduleService";
import fs from "fs";
let handleGetAllSchedules = async (req, res) => {
  //all, id
  let data = await userService.getAllSchedules();
  if (data.errCode === 0) return res.status(200).json(data.schedules);
  return res.status(500).json({ message: data.errMessage });
};
function getByteArray(filePath) {
  let fileData = fs.readFileSync(filePath);
  return fileData;
}
let handleCreateSchedules = async (req, res) => {
  const file = Object.values(req.files).flat()[0];
  let data = req.body;
  if (file) {
    data.image = getByteArray(file.tempFilePath);
  } else data.image = null;
  const user = req.User;
  if (!data) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  }
  let schedulesData = await userService.createSchedules(data, user.id);
  if (schedulesData.errCode === 0) {
    return res.status(200).json(schedulesData.errMessage);
  }
  return res.status(500).json({
    message: schedulesData.errMessage,
  });
};
let handleEditSchedules = async (req, res) => {
  const user = req.User;
  const id = req.params.id;
  let data = req.body;
  let message = await userService.updateSchedules(user, data, id);
  return res.status(200).json(message);
};
let handleDeleteSchedules = async (req, res) => {
  const user = req.User;
  if (!req.params.id) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Missing required parameters",
    });
  }
  let data = await userService.deleteSchedules(user, req.params.id);
  return res.status(200).json(data.errMessage);
};
let handleGetSchedulesByID = async (req, res) => {
  let idschedules = req.params.id;
  let user = req.User;
  let data = await userService.getSchedulesByID(user, idschedules);
  if (data.errCode === 0)
    return res
      .status(200)
      .json({ schedules: data.schedules, status: data.status });
  return res.status(500).json({ message: data.errMessage });
};
let handleScheduled = async (req, res) => {
  let idnsd = req.User.id;
  let idLT = req.params.id;
  if (!idLT || !idnsd) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Missing required parameters",
    });
  }
  let data = await userService.scheduled(idLT, idnsd);
  if (data.errCode === 0) return res.status(200).json(data.errMessage);
  return res.status(500).json({ message: data.errMessage });
};
let handleCancelScheduled = async (req, res) => {
  let idnsd = req.User.id;
  let idLT = req.params.id;
  if (!idLT || !idnsd) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Missing required parameters",
    });
  }
  let schedule = await db.Schedule_detail.findOne({
    where: {
      idNSD: idnsd,
      idSchedule: idLT,
    },
  });
  let timeStart = await db.Schedule.findOne({
    where: {
      id: idLT,
    },
  });
  if (schedule.deliveredAt) {
    if (schedule.deliveredAt.getTime() < timeStart.startDay.getTime())
      return res.status(500).json({ message: data.errMessage });
  }
  let data = await userService.cancelScheduled(idLT, idnsd);
  if (data.errCode === 0) return res.status(200).json(data.errMessage);
  return res.status(500).json({ message: data.errMessage });
};
let handleGetSchedulesByIDNVC = async (req, res) => {
  let iduser = req.User.id;
  if (!iduser) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  }
  let data = await userService.GetSchedulesByIDNVC(iduser);
  if (data.errCode === 0) {
    return res.status(200).json(data.schedules);
  }
  return res.status(500).json({
    message: data.errMessage,
  });
};
let handleGetSchedulesByIDNSD = async (req, res) => {
  let iduser = req.User.id;
  if (!iduser) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  }
  let data = await userService.GetSchedulesByIDNSD(iduser);
  if (data.errCode === 0) {
    return res.status(200).json(data.schedule);
  }
  return res.status(500).json({
    message: data.errMessage,
  });
};
let handleGetPeopleScheduled = async (req, res) => {
  let idschedules = req.params.id;
  let iduser = req.User.id;
  if (!idschedules) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  }
  let data = await userService.GetPeopleScheduled(iduser, idschedules);
  if (data.errCode === 0) {
    return res.status(200).json(data.listschedule_detail);
  }
  return res.status(500).json({
    message: data.errMessage,
  });
};
let handleCommentSchuduleByID = async (req, res) => {
  let idschedules = req.params.id;
  let idnv = req.User.id;
  let nd = req.body.nd;
  if (!idschedules || !idnv) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  }
  let data = await userService.AddCommentByID(nd, idnv, idschedules);
  if (data.errCode === 0) {
    return res.status(200).json(data.errMessage);
  }
  return res.status(500).json({
    message: data.errMessage,
  });
};
let handleGetcommentSchuduleByID = async (req, res) => {
  let idschedules = req.params.id;
  if (!idschedules) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  }
  let data = await userService.GetCommentByIDLT(idschedules);
  if (data.errCode === 0) {
    return res.status(200).json(data.listcomment);
  }
  return res.status(500).json({
    message: data.errMessage,
  });
};
let handleConfirmSchedule = async (req, res) => {
  let idschedules = req.params.id;
  if (!idschedules) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  }
  let data = await userService.ConfirmSchedule(idschedules);
  if (data.errCode === 0) {
    return res.status(200).json(data.errMessage);
  } else {
    return res.status(500).json({
      message: data.errMessage,
    });
  }
};
let handleGetTimeDelivery = async (req, res) => {
  let idschedules = req.params.id;
  if (!idschedules) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter",
    });
  }
  let data = await userService.getTimeDeleveryByIdSchedule(idschedules);
  if (data.errCode === 0) {
    return res.status(200).json(data.deliveredAt);
  }
  return res.status(500).json({
    message: data.errMessage,
  });
};
module.exports = {
  handleGetAllSchedules: handleGetAllSchedules,
  handleCreateSchedules: handleCreateSchedules,
  handleEditSchedules: handleEditSchedules,
  handleDeleteSchedules: handleDeleteSchedules,
  handleGetSchedulesByID: handleGetSchedulesByID,
  handleScheduled: handleScheduled,
  handleCancelScheduled: handleCancelScheduled,
  handleGetSchedulesByIDNVC: handleGetSchedulesByIDNVC,
  handleGetSchedulesByIDNSD: handleGetSchedulesByIDNSD,
  handleGetPeopleScheduled: handleGetPeopleScheduled,
  handleCommentSchuduleByID: handleCommentSchuduleByID,
  handleGetcommentSchuduleByID: handleGetcommentSchuduleByID,
  handleConfirmSchedule: handleConfirmSchedule,
  handleGetTimeDelivery: handleGetTimeDelivery,
};

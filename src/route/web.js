import express from "express";
import userController from "../controllers/userController";
import scheduleController from "../controllers/scheduleController";
import middleware from "../ulils/middleware";
let router = express.Router();
let initWebRoutes = (app) => {
  router.post("/api/login", userController.handleLogin);
  router.get(
    "/api/get-all-schedules",
    scheduleController.handleGetAllSchedules
  );
  router.get(
    "/api/get-schedules-byid/:id",
    middleware.tokenToUser,
    scheduleController.handleGetSchedulesByID
  );
  router.post(
    "/api/create-schedules",
    middleware.authMiddleWare,
    scheduleController.handleCreateSchedules
  );
  router.put(
    "/api/edit-schedules/:id",
    middleware.authMiddleWare,
    scheduleController.handleEditSchedules
  );
  router.delete(
    "/api/delete-schedules/:id",
    middleware.authMiddleWare,
    scheduleController.handleDeleteSchedules
  );
  router.post("/api/create-users", userController.handleCreateUsers);
  router.put(
    "/api/scheduled/:id",
    middleware.authMiddleWare,
    scheduleController.handleScheduled
  );
  router.delete(
    "/api/cancel_scheduled/:id",
    middleware.authMiddleWare,
    scheduleController.handleCancelScheduled
  );
  router.get(
    "/api/NVC",
    middleware.authMiddleWare,
    scheduleController.handleGetSchedulesByIDNVC
  );
  router.get(
    "/api/NSD",
    middleware.authMiddleWare,
    scheduleController.handleGetSchedulesByIDNSD
  );
  router.get(
    "/api/people/:id",
    middleware.authMiddleWare,
    scheduleController.handleGetPeopleScheduled
  );
  router.post(
    "/api/comment/:id",
    middleware.authMiddleWare,
    scheduleController.handleCommentSchuduleByID
  );
  router.get(
    "/api/getcomment/:id",
    scheduleController.handleGetcommentSchuduleByID
  );
  router.put(
    "/api/confirm/:id",
    middleware.authMiddleWare,
    scheduleController.handleConfirmSchedule
  );
  router.get(
    "/api/getTimeDelivery/:id",
    middleware.authMiddleWare,
    scheduleController.handleGetTimeDelivery
  );
  return app.use("/", router);
};

module.exports = initWebRoutes;

// npx sequelize-cli db:migrate
// npx sequelize-cli db:seed:all

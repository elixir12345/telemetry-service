const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middlewares/auth");
const telemetryController = require("../../controllers/telemetryController");

router.post("/", telemetryController.insertQecho);
router.get("/", telemetryController.getQecho);

module.exports = router;

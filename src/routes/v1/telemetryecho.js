const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middlewares/auth");
const telemetryController = require("../../controllers/telemetryController");

router.post("/", authenticateToken, telemetryController.insertQecho);
router.get("/", authenticateToken, telemetryController.getQecho);

module.exports = router;

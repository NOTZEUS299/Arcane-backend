const express = require("express");
const { initialData } = require("../../controller/admin/initialData");
const {
  requireSignin,
  adminMiddleware,
} = require("../../middleware/middleware");
const router = express.Router();

router.post("/initialData", requireSignin, adminMiddleware, initialData);

module.exports = router;

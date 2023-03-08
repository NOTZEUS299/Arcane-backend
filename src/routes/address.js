const express = require("express");
const { requireSignin, userMiddleware } = require("../middleware/middleware");
const { addAddress, getAddress } = require("../controller/address");
const router = express.Router();

router.post("/user/address/create", requireSignin, userMiddleware, addAddress);
router.get("/user/getaddress", requireSignin, userMiddleware, getAddress);

module.exports = router;

const express = require("express");
const { signup, signin, signout } = require("../controller/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validators/auth");
const { requireSignin } = require("../middleware/middleware");
const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/signout", requireSignin, signout);

module.exports = router;

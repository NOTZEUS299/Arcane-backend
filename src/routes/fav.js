const express = require("express");
const {
  createFav,
  updateFav,
  deleteFav,
  findAllFav,
  findByUser,
} = require("../controller/fav");
const { requireSignin } = require("../middleware/middleware");
const router = express.Router();

router.post("/fav/create", requireSignin, createFav); // user login and token require
router.post("/fav/update/:id", updateFav);
router.delete("/fav/delete/:id", deleteFav);
router.get("/fav/getAll", findAllFav); // you get all fav item
router.get("/fav/getByUser", requireSignin, findByUser); // user login and token require

module.exports = router;

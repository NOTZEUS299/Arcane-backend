const express = require("express");
const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategories,
} = require("../controller/category");
const { requireSignin, adminMiddleware, upload } = require("../middleware/middleware");
const router = express.Router();

router.post(
  "/category/create",
  requireSignin,
  adminMiddleware,
  upload.single("categoryImage"),
  addCategory
);
router.get("/category/getcategory", getCategories);
router.post("/category/update", upload.single("categoryImage"), updateCategory);
router.post("/category/delete", deleteCategories);

module.exports = router;

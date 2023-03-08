const express = require("express");
const router = express.Router();
const { upload, requireSignin, adminMiddleware } = require("../../middleware/middleware");
const { createPage, getPage, deletePage } = require("../../controller/admin/page");

router.post(
  `/page/create`,
  requireSignin,
  adminMiddleware,
  upload.fields([{ name: "banners" }, { name: "products" }]),
  createPage
);

router.get(`/page/:category/:type`, getPage);

router.delete(`/page/:id`, deletePage);

module.exports = router;

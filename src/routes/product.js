const express = require("express");
const {
  createProduct,
  getProductsBySlug,
  getProductDetailsById,
  deleteProductById,
  getProducts,
  searchProduct,
} = require("../controller/product");
const { requireSignin, adminMiddleware, upload } = require("../middleware/middleware");
const router = express.Router();

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  createProduct
);
router.get("/product/search", searchProduct);

router.get("/products/:slug", getProductsBySlug);
router.get("/product/:productId", getProductDetailsById);

router.delete("/product/deleteProductById", requireSignin, adminMiddleware, deleteProductById);

router.post(
  "/product/getProducts",
  // requireSignin,
  // adminMiddleware,
  getProducts
);

module.exports = router;

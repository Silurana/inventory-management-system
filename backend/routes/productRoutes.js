import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  getProductByBarcode,
  deleteProduct,
  updateProduct,
  createProduct,
  sellProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, createProduct);
router.route("/sell").post(protect, sellProducts);
router.route("/barcode/:barcode").get(getProductByBarcode);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, deleteProduct)
  .put(protect, updateProduct);

export default router;

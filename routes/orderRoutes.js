import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  deleteOrder,
  updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;

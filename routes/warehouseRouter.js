import express from "express";
import {
  getImports,
  getImportById,
  createImport,
  deleteImport,
  getExports,
  getExportById,
  createExport,
  deleteExport,
  getStats,
} from "../controllers/warehouseController.js";

const router = express.Router();

// Dashboard stats
router.get("/stats", getStats);

// Import routes
router.get("/imports", getImports);
router.get("/imports/:id", getImportById);
router.post("/imports", createImport);
router.delete("/imports/:id", deleteImport);

// Export routes
router.get("/exports", getExports);
router.get("/exports/:id", getExportById);
router.post("/exports", createExport);
router.delete("/exports/:id", deleteExport);

export default router;

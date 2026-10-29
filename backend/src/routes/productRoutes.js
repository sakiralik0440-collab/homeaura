

import express from "express";

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";

import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// GET all admin products
router.get("/", adminAuthMiddleware, getProducts);

// CREATE product
router.post("/", adminAuthMiddleware, createProduct);

// UPDATE product
router.put("/:id", adminAuthMiddleware, updateProduct);

// DELETE product
router.delete("/:id", adminAuthMiddleware, deleteProduct);

export default router;

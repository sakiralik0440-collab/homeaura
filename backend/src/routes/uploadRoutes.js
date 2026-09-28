import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {
    uploadProductImage,
} from "../controllers/uploadController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/product-image",
    authMiddleware,
    upload.single("image"),
    uploadProductImage
);

export default router;

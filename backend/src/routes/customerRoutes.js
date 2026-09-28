import express from "express";

import {
    getCustomers,
    getCustomerById,
} from "../controllers/customerController.js";

import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/", getCustomers);

router.get("/:id", getCustomerById);

export default router;
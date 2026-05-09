import express from "express";

import { createUser, getAll, toggleActive } from "./user.controller.js";

const router = express.Router();

// Get users
router.get("/get-all", getAll);

// Create user
router.post("/create", createUser);

// Toggle active
router.patch("/:id", toggleActive);

export default router;

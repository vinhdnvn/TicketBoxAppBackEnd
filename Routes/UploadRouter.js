import express from "express";
import { uploadFile } from "../Controllers/UploadFile.js";
import { protect, admin } from "../middlewares/Auth.js";
import multer from "multer";

const router = express.Router();

// setting  up multer as a middleware to grab photo uploads
const upload = multer({
	storage: multer.memoryStorage(),
});

// ADMIN ROUTES
router.post("/", upload.single("file"), uploadFile);

// export
export default router;

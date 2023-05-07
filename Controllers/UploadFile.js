// async handler
import asyncHandler from "express-async-handler";
import {
	ref,
	uploadBytes,
	getStorage,
	getDownloadURL,
	uploadBytesResumable,
} from "firebase/storage";
import { v4 } from "uuid";
// import { storage } from "../config/firebase.js";
import multer from "multer";
import express from "express";
import { initializeApp } from "firebase/app";
import config from "../config/firebase.js";
// constant router
const router = express.Router();

// initialize a firebase application
initializeApp(config.firebase);

// initialize cloud storage  and get the reference  to the service
const storage = getStorage();

// define storage
// const bucket = storage.bucket();

// const Uploadrouter = express.Router();

// define upload multer
// const upload = multer({
// 	storage: multer.memoryStorage(),
// });

// @desc Upload file
// @route POST /api/upload
// @access Private
const uploadFile = asyncHandler(async (req, res) => {
	const file = req.file;
	const imageListRef = ref(storage, "images");

	try {
		if (file) {
			const dateTime = giveCurrentDateTime();
			const storageRef = ref(storage, `images/${dateTime}_${file.name}`);

			const metadata = {
				contentType: file.mimetype,
			};
			const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
			const downloadURL = await getDownloadURL(snapshot.ref);
			console.log("Uploaded a blob or file!", downloadURL);
			res.status(201).json({
				message: "Upload file success",
				name: req.file.originalname,
				type: req.file.mimetype,
				url: downloadURL,
			});
		} else {
			res.status(400);
			throw new Error("Invalid file data");
		}

		// if (file) {
		// 	const timestamp = Date.now();
		// 	const filename = `${timestamp}_${file.name}`;
		// 	const fileref = bucket.file(filename);
		// 	const metadata = {
		// 		contentType: file.mimetype,
		// 		metadata: {
		// 			timestamp: timestamp.toString(),
		// 		},
		// 	};

		// 	await uploadBytes(fileref, file.buffer, metadata)
		// 		.then((snapshot) => {
		// 			console.log("Uploaded a blob or file!");
		// 			// res with url file
		// 			res.status(201).json({
		// 				message: "Upload file success",
		// 				url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${filename}?alt=media`,
		// 			});
		// 		})
		// 		.catch((error) => {
		// 			console.error(error);
		// 			res.status(400).json({ message: error.message });
		// 		});
		// } else {
		// 	res.status(400).json({ message: "File not found" });
		// }
	} catch (error) {
		res.status(400).json({ message: error.message, error: "dcmm" });
	}
});

const giveCurrentDateTime = () => {
	const today = new Date();
	const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
	const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	const dateTime = date + " " + time;
	return dateTime;
};

export { uploadFile };
// export { uploadFile, upload };

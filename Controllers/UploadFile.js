import express from "express";
import multer from "multer";
import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import storage from "../config/firebaseStorage.js";
// import firebase admin
import firebase from "firebase-admin";
import dotenv from "dotenv";
// import file concac.json in folder config
import serviceAccount from "../config/admin2.json" assert { type: "json" };

// import serviceAccount from "../config/admin.json" assert { type: "json" };

// import multer upload with desc /uploads
dotenv.config();

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// Define storage bucket
const bucket = firebase.storage().bucket();

const Uploadrouter = express.Router();

const upload = multer({
	storage: multer.memoryStorage(),
	// limit size <50mb
	limits: {
		fileSize: 50 * 1024 * 1024,
	},
});

Uploadrouter.post("/", upload.single("file"), async (req, res) => {
	try {
		// get file from request
		const file = req.file;
		// upload file to firebase storage
		if (file) {
			const timestamp = Date.now();
			const filename = `${timestamp}_${file.originalname}`;
			const fileRef = bucket.file(filename);
			const metadata = {
				contentType: file.mimetype,
				metadata: {
					timestamp: timestamp.toString(),
				},
			};
			await fileRef.save(file.buffer, { metadata });
			// save file meata data to firestore
			const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
			res.status(200).json({
				success: true,
				message: "File uploaded successfully",
				fileUrl,
			});
		} else {
			res.status(400).json({
				success: false,
				message: "File not found",
			});
		}

		// // create new file name
		// if (file) {
		// 	const fileName = `${uuidv4()}${path.extname(file.originalname)}`;

		// 	const blob = storage.file(fileName);
		// 	const blobStream = blob.createWriteStream({
		// 		resumable: false,
		// 		metadata: {
		// 			contentType: file.mimetype,
		// 		},
		// 	});
		// 	// if success
		// 	blobStream.on("finish", () => {
		// 		const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.name}/o/${fileName}?alt=media`;
		// 		res.status(200).json(publicUrl);
		// 	});
		// 	// if error
		// 	blobStream.on("error", (error) => {
		// 		res.status(400).json({ message: error.message, succes: "dcmm" });
		// 	});
		// 	blobStream.end(file.buffer);
		// 	// when there is no file
		// } else {
		// 	res.status(400).json({ message: "No file found, please upload file !" });
		// }
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Wrong key", failed: "dcmm" });
	}
});

export default Uploadrouter;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import mongoose from "mongoose";
import userRouters from "./Routes/UserRouter.js";
import movieRouters from "./Routes/MovieRouter.js";
import gerneRouters from "./Routes/GerneRouter.js";
import cinemaRouters from "./Routes/CinemaRouter.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import uploadRouters from "./Routes/UploadRouter.js";
import bookingRouters from "./Routes/BookingRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// connect DB mongoose
mongoose.connect("mongodb+srv://vinh120203:120203@ticketbox.uscvniq.mongodb.net/test");
mongoose.connection.on("connected", () => {
	console.log("connected");
});

// MAIN ROUTES
app.get("/", (req, res) => {
	res.send("Hello World!");
});
// ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

// OTHER ROUTES
app.use("/api/users", userRouters);
app.use("/api/movies", movieRouters);
app.use("/api/gernes", gerneRouters);
app.use("/api/upload", uploadRouters);
app.use("/api/cinemas", cinemaRouters);
app.use("/api/bookings", bookingRouters);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

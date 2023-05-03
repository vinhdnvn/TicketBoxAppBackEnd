// connect MongoDb with mongoose
import mongoose from "mongoose";
export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.DB, {
			// to avoid warnings
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		mongoose.connection.on("connected", () => {
			console.log("Mongoose is connected!!!");
		});
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (err) {
		console.error(`Error: ${err.message}`);
		// exit with failure
		process.exit(1);
	}
};

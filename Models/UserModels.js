import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a name"],
		},
		email: {
			type: String,
			required: [true, "Please provide a email"],
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
			minlength: [6, "Password must be at least 6 characters"],
		},
		image: {
			type: String,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		bookingInformation: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Booking",
			},
		],
		likedMovies: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Movies",
			},
		],
	},
	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;

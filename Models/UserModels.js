import mongoose from "mongoose";
const bookingSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		movie: {
			type: String,
			required: true,
		},
		gerne: {
			type: String,
			required: true,
		},
		cinema: {
			type: String,
			required: true,
		},
		date: {
			type: String,
			required: true,
		},
		time: {
			type: String,
			required: true,
		},
		seat: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

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
		bookingInformation: [[bookingSchema]],
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

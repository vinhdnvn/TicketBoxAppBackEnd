import mongoose from "mongoose";

// create seats model
const seatSchema = mongoose.Schema({
	name: {
		type: String,
	},
	isBooked: {
		type: Boolean,
		default: false,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	cinmea: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Cinema",
	},
});

const cinemaSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		cinemaImage: {
			type: String,
			required: true,
		},
		address: {
			type: String,
		},
		// movies field with array of movie id from movie model
		movies: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Movie",
			},
		],
		// seats field with array of seat id from seat model
		seats: [seatSchema],
	},
	{ timestamps: true }
);

// export
const Cinema = mongoose.model("Cinema", cinemaSchema);
export default Cinema;

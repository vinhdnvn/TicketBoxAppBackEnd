import mongoose from "mongoose";

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
	},
	{ timestamps: true }
);

// export
const Cinema = mongoose.model("Cinema", cinemaSchema);
export default Cinema;

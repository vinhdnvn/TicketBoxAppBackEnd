import mongoose from "mongoose";
const reviewSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		userImage: {
			type: String,
		},
		rating: {
			type: Number,
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

const movieSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		nameMovie: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
		rottenTomatoes: {
			type: Number,
			required: true,
		},
		ign: {
			type: Number,
			required: true,
		},
		// movies can have many gerne
		gerne: {
			type: String,
			required: true,
		},

		stars: {
			type: Number,
			required: true,
		},
		year: {
			type: Number,
			required: true,
			default: 2023,
		},
		time: {
			type: Number,
			required: true,
		},
		video: {
			type: String,
			required: true,
		},
		numberOfReviews: {
			type: Number,
			required: true,
			default: 0,
		},
		isPopular: {
			type: Boolean,
			default: false,
		},
		reviews: [reviewSchema],
		// add 1 field show that movie belong to cinema model
		cinema: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Cinema",
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				unique: true,
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Movies", movieSchema);

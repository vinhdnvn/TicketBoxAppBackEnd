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

		// seats is array like ["A1", "A2", "A3"]
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

// export model
const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;

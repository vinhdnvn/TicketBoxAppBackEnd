import mongoose from "mongoose";

const gerneSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Gerne", gerneSchema);

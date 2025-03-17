import mongoose, { Document, Schema } from "mongoose";

interface TimeInterface extends Document {
	userId: number;
	checkInTime: Date;
	checkOutTime: Date;
	checkedInDate: Date;
	checkedIn: boolean;
}

const AttendanceSchema: Schema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Users",
		requried: true,
	},
	checkInTime: {
		type: Date,
		required: false,
	},
	checkOutTime: {
		type: Date,
		required: false,
	},
	checkInDate: {
		type: Date,
		required: true,
	},
	checkedIn: {
		type: Boolean,
		default: false,
	}

})

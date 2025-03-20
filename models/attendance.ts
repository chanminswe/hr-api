import mongoose, { Document, Schema } from "mongoose";

interface TimeInterface extends Document {
	userId: number;
	checkInTime: Date;
	checkOutTime: Date;
	checkedInDate: string;
	checkedIn: boolean;
}

const AttendanceSchema: Schema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Users",
		required: true,
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
		type: String,
		required: true,
	},
	checkedIn: {
		type: Boolean,
		default: false,
	},
})

AttendanceSchema.index({ userId: 1, checkInDate: 1 }, { unique: true });

const Attendance = mongoose.model<TimeInterface>("Attendance", AttendanceSchema);

export default Attendance;

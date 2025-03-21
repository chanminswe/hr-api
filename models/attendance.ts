import { Document, Schema, model } from "mongoose";

interface TimeInterface extends Document {
	userId: Schema.Types.ObjectId;
	checkInTime: Date;
	checkOutTime: Date;
	checkedInDate: string;
	checkedIn: boolean;
}

const AttendanceSchema: Schema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
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
	checkedInDate: {
		type: String,
		required: true,
	},
	checkedIn: {
		type: Boolean,
		default: false,
	},
}, { timestamps: true });

AttendanceSchema.index({ userId: 1, checkedInDate: 1 }, { unique: true });

const Attendance = model<TimeInterface>("Attendance", AttendanceSchema);

export default Attendance;

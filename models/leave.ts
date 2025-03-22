import { Schema, Document, model } from 'mongoose';

interface LeaveType {
	userId: Schema.Types.ObjectId,
	annual: number,
	casual: number,
	unpaid: number,
	medical: number,
}

const LeaveSchema: Schema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "Users",
		required: true
	},
	annual: {
		type: Number,
		default: 10
	},
	casual: {
		type: Number,
		default: 6
	},
	unpaid: {
		type: Number,
		default: 30
	},
	medical: {
		type: Number,
		default: 10
	}
}, { timestamps: true });


const Leave = model<LeaveType>('Leave', LeaveSchema);

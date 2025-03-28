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
		default: parseInt(process.env.ANNUAL_LEAVE)
	},
	casual: {
		type: Number,
		default: parseInt(process.env.CASUAL_LEAVE)
	},
	unpaid: {
		type: Number,
		default: parseInt(process.env.UNPAID_LEAVE)
	},
	medical: {
		type: Number,
		default: parseInt(process.env.MEDICAL_LEAVE)
	}
}, { timestamps: true });


const LeaveAvailable = model<LeaveType>('LeaveAvailable', LeaveSchema);
export default LeaveAvailable;

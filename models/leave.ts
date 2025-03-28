import { Schema, Document, model } from 'mongoose';

interface LeaveType extends Document {
	userId: Schema.Types.ObjectId;
	annual: number;
	casual: number;
	unpaid: number;
	medical: number;
}

const convertToNumber = (envValue: string | undefined, defaultValue: number): number => {
	if (envValue === undefined || envValue.trim() === '') return defaultValue;
	const num = Number(envValue);
	return isNaN(num) ? defaultValue : num;
};

const LeaveSchema: Schema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "Users",
		required: true
	},
	annual: {
		type: Number,
		default: convertToNumber(process.env.ANNUAL_LEAVE, 10),
		min: 0
	},
	casual: {
		type: Number,
		default: convertToNumber(process.env.CASUAL_LEAVE, 10),
		min: 0
	},
	unpaid: {
		type: Number,
		default: convertToNumber(process.env.UNPAID_LEAVE, 30),
		min: 0
	},
	medical: {
		type: Number,
		default: convertToNumber(process.env.MEDICAL_LEAVE, 10),
		min: 0
	}
}, { timestamps: true });

const LeaveAvailable = model<LeaveType>('LeaveAvailable', LeaveSchema);
export default LeaveAvailable;

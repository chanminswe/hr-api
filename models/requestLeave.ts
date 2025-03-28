import { Schema, Document, model } from 'mongoose';

export interface RequestLeaveType {
	userId: number;
	status: string;
	requestedDates: string[];
	approvedBy: string;
	department: string;
}

const RequestSchema: Schema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "Users",
		required: true
	},
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected'],
		required: true
	},
	requestedDates: {
		type: [String],
		required: true
	},
	approvedBy: {
		type: String,
	},
	department: {
		type: String,
		required: true
	}
}, { timestamps: true })

const LeaveRequest = model<RequestLeaveType>('LeaveRequest', RequestSchema);

export default LeaveRequest;

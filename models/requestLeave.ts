import { Schema, Document, model } from 'mongoose';

interface RequestLeaveType {
	userId: number;
	status: string;
	requestedDates: string;
	approvedBy: string;
}

const RequestSchema: Schema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "Users",
		required: true
	},
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected']
	},
	requestedDates: {
		type: String,
	},
	approvedBy: {
		type: String,
	}
}, { timestamps: true })

const Request = model<RequestLeaveType>('Request', RequestSchema);

export default Request;

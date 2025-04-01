import mongoose, { Schema } from "mongoose";
import Users from "./users";

interface InboxSchemaType {
	userId: number,
	message: string,
}

const InboxSchema: Schema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: Users,
		required: true
	},
	message: {
		type: String,
		required: true
	}
}, { timestamps: true });

const Inbox = mongoose.model<InboxSchemaType>('Inbox', InboxSchema);
export { Inbox };

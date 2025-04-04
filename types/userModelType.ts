import { Document } from "mongoose";

export interface UserModelType extends Document {
	email: string;
	password: string;
	fullname: string;
	role: string;
	department: string;
	canEdit: boolean;
}

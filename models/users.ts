import mongoose, { Schema, Document } from "mongoose";
import { UserModelType } from "../types/userModelType";


const UserSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["employee", "management", "head", "executive"],
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

const Users = mongoose.model<UserModelType>("Users", UserSchema);

export default Users;

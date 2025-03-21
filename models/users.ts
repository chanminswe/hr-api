import mongoose, { Schema, Document } from "mongoose";

interface UserDatabase extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  department: string;
  canEdit: boolean;
}

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
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["head", "employee"],
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

const Users = mongoose.model<UserDatabase>("Users", UserSchema);

export default Users;

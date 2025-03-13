import mongoose from "mongoose"

interface UserDatabase{
  email : string,
  password : string,
  role : string,
  department : string,
  canEdit : true,
}

const UserSchema = new mongoose.Schema({
  email : {
    type : String,
    unique : true
  },
  password : {
    type : String,
  },
  role : {
    enum : ['head' , 'employee'],
  },
  department : {
    type : String,
  },
  canEdit : {
    type : Boolean,
  }
})

const Users = mongoose.model("Users" , UserSchema);
export default Users;
import mongoose from "mongoose";

const dbConnection = async () => {
  try{
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo Db Database Connected !")
  }
  catch(error){
    console.error("Error Occured while trying to connect to hr database" , error.message)
  }
}

export default dbConnection;
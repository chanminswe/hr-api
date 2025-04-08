import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      // poolSize: 10,           // Number of sockets in the connection pool
      socketTimeoutMS: 30000, // Close sockets after 30s of inactivity
      connectTimeoutMS: 30000, // Fail fast if connection takes >30s
      serverSelectionTimeoutMS: 5000, // Retry connection for 5s
      maxPoolSize: 50,        // Maximum connections (adjust for production)
      minPoolSize: 5,
    });
    console.log("Mongo Db Database Connected !")
  }
  catch (error) {
    console.error("Error Occured while trying to connect to hr database", error.message)
  }
}

export default dbConnection;

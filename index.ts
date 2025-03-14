import express from "express";
import dotenv from 'dotenv';
import authRouter from "./routes/authenticationRoutes";
import activityRouter from "./routes/userActivityRoutes";
import cors from 'cors';
import dbConnection from "./db/dbConnections";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || "8080"

app.get('/' , (req , res) => {
  res.json({message : "Hello , the server is working!"});
})

app.use('/user/auth' , authRouter);

app.use('/user/informations/' , activityRouter);

app.listen(parseInt(PORT) , () => {
  console.log(`The Server has Started on ${PORT} `);
  dbConnection();
})



import express from "express";
import dotenv from 'dotenv';
import authRouter from "./routes/authenticationRoutes";
import activityRouter from "./routes/userActivityRoutes";
import cors from 'cors';
import dbConnection from "./db/dbConnections";
import holidaysRouter from "./routes/holidaysAuth";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


const PORT = process.env.PORT || "8080"

app.get('/', (req, res) => {
  res.json({ message: "Hello , the server is working!" });
})

//for authentication
app.use('/user/auth', authRouter);

//for information about user
app.use('/user/informations/', activityRouter);

//for management
app.use('/admin/holidays/', holidaysRouter);

app.listen(parseInt(PORT), () => {
  console.log("Raw process.env.PORT:", process.env.PORT);
  dbConnection();
})



import express from "express";
import dotenv from 'dotenv';
//database
import dbConnection from "./db/dbConnections";
//my pth routers
import authRouter from "./routes/authenticationRoutes";
import activityRouter from "./routes/userActivityRoutes";
import holidaysRouter from "./routes/holidaysAuth";
//security
import rateLimit from 'express-rate-limit';
import helmet from "helmet";
import cors from 'cors';


dotenv.config();
const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: "Too many requests , please try again later!" });
app.use(limiter);

const PORT = process.env.PORT || "8080"

app.get('/health', (req, res) => {
  res.json({ status: "Healthy!", timeStamp: new Date().toISOString() });
})

//APIs
app.use('/api/user/auth', authRouter);
app.use('/api/user/informations/', activityRouter);
app.use('/api/admin/holidays/', holidaysRouter);

app.listen(parseInt(PORT), () => {
  console.log("Raw process.env.PORT:", process.env.PORT);
  dbConnection()
    .then(() => console.log("Database is running properly!"))
    .catch(err => {
      console.error("Database connection failed", err);
      process.exit(1);
    })
});



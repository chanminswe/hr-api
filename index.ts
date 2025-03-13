import express from "express";
import dotenv from 'dotenv';
import router from "./routes/authenticationRoutes";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || "8080"

app.get('/' , (req , res) => {
  res.json({message : "Hello , the server is working!"});
})

app.use('/user/auth' , router)

app.listen(parseInt(PORT) , () => {
  console.log(`The Server has Started on ${PORT} `);
})



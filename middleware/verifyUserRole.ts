import { Request , Response , NextFunction } from "express";
import jwt from 'jsonwebtoken';


declare module 'express' {
  interface Request {
    email?: string;
  }
}

const verifyingUser = (req : Request , res : Response , next : NextFunction):Promise <void> => {
  try{
    const unsplitToken = req.header('Authorization');

    
    if(!unsplitToken || !unsplitToken.startsWith('Bearer')){
      res.status(403).json({message : "Token Invalid or Expired!"});
      return;
    }

    const token = unsplitToken.split(' ')[1];

    console.log(token);

    const decoded = jwt.verify(token , process.env.SECRET_TOKEN);
    req.email = decoded.email;
    next();
  }
  catch(error){
    console.log("Error Occured While Getting User Informations!" , error.message);
    res.status(400).json({message : "Internal Server Error"});
    return;
  }
}

export default verifyingUser;
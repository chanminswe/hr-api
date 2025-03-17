import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    email?: string;
    userId?: number;
  }
}

const verifyingUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const unsplitToken = req.header('Authorization');
    console.log("Received Authorization Header: ", unsplitToken);

    if (!unsplitToken || !unsplitToken.startsWith('Bearer')) {
      res.status(403).json({ message: "Token Invalid or Expired!" });
      return;
    }

    const token = unsplitToken.split(' ')[1];
    console.log("Token: ", token);

    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    console.log("Decoded Token: ", decoded);

    req.email = decoded.email;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error verifying token: ", error);
    res.status(401).json({ message: "Unauthorized! Invalid or expired token." });
  }
};

export default verifyingUser;

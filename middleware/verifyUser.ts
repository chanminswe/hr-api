import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { TokenPayload } from "../types/returnTokenType";

interface UserAuthReq extends Request {
  user?: { userId: number, fullname: string, role: string, department: string }
};


const verifyingUser = (req: UserAuthReq, res: Response, next: NextFunction): void => {
  try {
    const unsplitToken = req.header('Authorization');

    if (!unsplitToken || !unsplitToken.startsWith('Bearer')) {
      res.status(403).json({ message: "Token Invalid or Expired!", success: false });
      return;
    }

    const token = unsplitToken.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as TokenPayload;

    if (!decoded || !decoded.fullname || !decoded.userId || !decoded.department || !decoded.role) {
      res.status(400).json({ message: "Couldn't get the necessary data from token!", success: false });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token: ", error.message);
    res.status(401).json({ message: "Unauthorized! Invalid or expired token.", success: false });
    return;
  }
};

export default verifyingUser;

import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface UserAuthReq extends Request {
  user?: { userId: number, full: string, role: string, department: string }
}

const verifyingUser = (req: UserAuthReq, res: Response, next: NextFunction): void => {
  try {
    const unsplitToken = req.header('Authorization');
    console.log("requested");
    if (!unsplitToken || !unsplitToken.startsWith('Bearer')) {
      res.status(403).json({ message: "Token Invalid or Expired!" });
      return;
    }

    const token = unsplitToken.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
    if (!decoded || !decoded.fullname || !decoded.userId || !decoded.department || !decoded.role) {
      res.status(400).json({ message: "Couldn't get the necessary data from token!" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token: ", error);
    res.status(401).json({ message: "Unauthorized! Invalid or expired token." });
  }
};

export default verifyingUser;

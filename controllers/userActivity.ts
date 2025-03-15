import { Request, Response } from "express";
import Users from '../models/users';


declare module 'express' {
  interface Request {
    email?: string;
  }
}

const gettingUserInformations = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.email;

    if (!email) {
      res.status(500).json({ message: "Couldn't get User Information!" });
      return;
    }

    const userInformation = await Users.findOne({ email });

    if (!userInformation) {
      res.status(400).json({ message: "Couldn't find the User Informations try again later!" });
      return;
    }
    res.status(200).json({ message: "User Informations Sucessfully Retrieved", userInformation });
    return;
  }
  catch (error) {
    console.error("Error Occured While Getting User Informations ", error.message);
    res.status(500).json({ message: "Internal Server Error Occured!" });
  }
}

export { gettingUserInformations };

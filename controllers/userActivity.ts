import { Request, Response } from "express";
import Users from '../models/users';
import Attendance from "../models/attendance";


declare module 'express' {
  interface Request {
    email?: string;
    userId?: number;
  }
}

const gettingUserInformations = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.email;
    const userId = req.id;

    if (!email || !userId) {
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
};


const checkIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.id;

    if (!userId) {
      res.status(400).json({ message: "Something went wrong while trying to check in" });
    }

    const date = new Date();
    const today = date.getDate();

    const existingCheckInRecord = await Attendance.findOne({ userId, checkedInDate: today });

    if (existingCheckInRecord) {
      res.status(400).json({ message: "You have already checked in today" });
      return;
    }

    if (existingCheckInRecord.checkedIn === true) {
      res.status(400).json({ message: "You hav already checked in today" });
    }

    const newCheckIn = await Attendance.create({
      userId,
      checkedInTime: new Date(),
      checkInDate: today,
      checkedIn: true
    });

    if (!newCheckIn) {
      res.status(400).json({ message: "Something went wrong while creating check in data" });
      return;
    }

    res.status(201).json({ message: "Checked In Sucessfully!" });
    return;
  }
  catch (error) {
    console.error("Error Occured While Checking In");
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

const checkOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(403).json({ message: "Unauthorized acton" });
      return;
    }

    const today = new Date().getDate();

    const findExistingUser = await Attendance.findOne({ userId, checkedInDate: today });

    if (!findExistingUser) {
      res.status(400).json({ message: "You haven't checked in today!" });
      return;
    }

    if (findExistingUser.checkedIn === false) {
      res.status(400).json({ message: "You have checked in today!" });
      return;
    }
    else {
      findExistingUser.checkOutTime = new Date();
      res.status(400).json({ message: "Checked Out Sucessfully!" });
      return;
    }

  }
  catch (error) {
    console.error("Error Occured While Trying to check out");
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export { gettingUserInformations, checkIn, checkOut };

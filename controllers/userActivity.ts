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
    const userId = req.userId;

    if (!email || !userId) {
      res.status(500).json({ message: "Couldn't get User Information!" });
      return;
    }

    const userInformation = await Users.findOne({ email });

    if (!userInformation) {
      res.status(400).json({ message: "Couldn't find the User Informations try again later!" });
      return;
    }

    res.status(200).json({ message: "User Information Successfully Retrieved", userInformation });
  } catch (error) {
    console.error("Error Occurred While Getting User Information:", error.message);
    res.status(500).json({ message: "Internal Server Error Occurred!" });
  }
};

const checkIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({ message: "Something went wrong while trying to check in" });
      return;
    }

    const today = new Date();
    const checkInDate = new Date(today.setHours(0, 0, 0, 0));

    const existingCheckInRecord = await Attendance.findOne({ userId, checkInDate });

    if (existingCheckInRecord) {
      res.status(400).json({ message: "You have already checked in today" });
      return;
    }

    const newCheckIn = await Attendance.create({
      userId,
      checkInTime: today,
      checkInDate: checkInDate,
      checkedIn: true
    });

    if (!newCheckIn) {
      res.status(400).json({ message: "Something went wrong while creating check-in data" });
      return;
    }

    res.status(201).json({ message: "Checked In Successfully!" });
  } catch (error) {
    console.error("Error Occurred While Checking In:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(403).json({ message: "Unauthorized action" });
      return;
    }

    const today = new Date();
    const checkInDate = new Date(today.setHours(0, 0, 0, 0));

    const findExistingUser = await Attendance.findOne({ userId, checkInDate });

    if (!findExistingUser) {
      res.status(400).json({ message: "You haven't checked in today!" });
      return;
    }

    if (!findExistingUser.checkedIn) {
      res.status(400).json({ message: "You have not checked in yet!" });
      return;
    }

    findExistingUser.checkOutTime = new Date();
    await findExistingUser.save();

    res.status(200).json({ message: "Checked Out Successfully!" });
  } catch (error) {
    console.error("Error Occurred While Trying to Check Out:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { gettingUserInformations, checkIn, checkOut };


import { Request, Response } from "express";
import Attendance from "../models/attendance";

declare module 'express' {
  interface Request {
    email?: string;
    userId?: number;
  }
}


const gettingAttendanceInformation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ message: "Invalid or Expired Token!" });
      return;
    }

    const today = new Date().toDateString();

    const findTodayCheckIn = await Attendance.findOne({ userId, checkedInDate: today });

    if (!findTodayCheckIn) {
      res.status(200).json({ message: "Haven't Checked In Today!" });
      return;
    }
    const checkInTime = findTodayCheckIn.checkInTime;
    const checkOutTime = findTodayCheckIn.checkOutTime ?? null;
    console.log(checkOutTime);
    res.status(200).json({ message: "Success", checkInTime, checkOutTime });

  } catch (error) {
    console.error("Error Occurred While Getting User Information:", String(error));
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
    const checkedInDate = `${today.toDateString()}`

    const findExistingCheckIn = await Attendance.findOne({ userId, checkedInDate });

    if (findExistingCheckIn?.checkedIn === true) {
      res.status(400).json({ message: "You have already created the data!" });
      return;
    }

    const createNewCheckIn = await Attendance.create({
      userId,
      checkInTime: today,
      checkedInDate,
      checkedIn: true
    });

    if (!createNewCheckIn) {
      res.status(400).json({ message: "Something went wrong while checking in !" });
    };

    res.status(201).json({ message: "Checked In Successfully!" });
    return;
  } catch (error) {
    console.error("Error Occurred While Checking In:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req;

    if (!userId) {
      res.status(403).json({ message: "Unauthorized action" });
      return;
    }

    const today = new Date();
    const checkedInDate = today.toDateString();

    const findExistingCheckIn = await Attendance.findOne({ userId, checkedInDate });

    if (!findExistingCheckIn) {
      res.status(400).json({ message: "You haven't checked in yet!" });
      return;
    }

    if (!findExistingCheckIn.checkedIn) {
      res.status(400).json({ message: "You haven't checked in yet!" });
      return;
    }

    findExistingCheckIn.checkOutTime = today;
    await findExistingCheckIn.save();

    res.status(200).json({ message: "Checked Out Successfully!" });

  } catch (error) {
    console.error("Error Occurred While Trying to Check Out:", String(error));
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const requestingLeave = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body);
    const { selected, leaveType } = req.body;
    const typesOfLeaves = ['annual', 'casual', 'unpaid', 'medical'];

    if (!leaveType || !typesOfLeaves.includes(leaveType)) {
      res.status(400).json({ message: "Bad Request! leave type is necessary to request for leave" });
      return;
    }

    res.status(200).json({ message: "Sucessfully requested leave" });
    return;
  }
  catch (error: any) {
    console.log("Error Occured while requesting leave", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }

}

export { gettingAttendanceInformation, checkIn, checkOut, requestingLeave };


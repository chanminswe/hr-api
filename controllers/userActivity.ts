import { Request, Response } from "express";
import Attendance from "../models/attendance";
import Holidays from '../models/holidays';
import LeaveRequest, { RequestLeaveType } from "../models/requestLeave";
import { HolidaysSchemaType } from "../models/holidays";
import LeaveAvaiable from '../models/leave';

interface AuthRequest extends Request {
  user?: { role: string, department: string, userId: number, fullname: string }
};

const gettingAttendanceInformation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(403).json({ message: "Invalid or Expired Token!" });
      return;
    };

    const today = new Date().toDateString();

    const findTodayCheckIn = await Attendance.findOne({ userId, checkedInDate: today });

    if (!findTodayCheckIn) {
      res.status(200).json({ message: "Haven't Checked In Today!" });
      return;
    }

    const checkInTime = findTodayCheckIn.checkInTime ?? null;
    const checkOutTime = findTodayCheckIn.checkOutTime ?? null;

    res.status(200).json({ message: "Success", checkInTime, checkOutTime });
    return;
  } catch (error) {
    console.error("Error Occurred While Getting User Information:", String(error));
    res.status(500).json({ message: "Internal Server Error Occurred!" });
    return;
  }
};

const checkIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(400).json({ message: "Something went wrong while trying to check in" });
      return;
    }

    const today = new Date();
    const checkedInDate = `${today.toDateString()}`;

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

const checkOut = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.user || {};

    if (!userId) {
      res.status(403).json({ message: "Unauthorized action" });
      return;
    };

    const today = new Date();
    const checkedInDate = today.toDateString();

    const findExistingCheckIn = await Attendance.findOne({ userId, checkedInDate });

    if (!findExistingCheckIn) {
      res.status(400).json({ message: "You haven't checked in yet!" });
      return;
    };

    if (!findExistingCheckIn.checkedIn) {
      res.status(400).json({ message: "You haven't checked in yet!" });
      return;
    };

    findExistingCheckIn.checkOutTime = today;
    await findExistingCheckIn.save();

    res.status(200).json({ message: "Checked Out Successfully!" });

  } catch (error) {
    console.error("Error Occurred While Trying to Check Out:", String(error));
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const requestingLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, department } = req.user;
    const { selected, leaveType } = req.body;

    const typesOfLeaves = ['annual', 'casual', 'unpaid', 'medical'];

    if (!selected || !leaveType || Array.isArray(selected)) {
      res.status(400).json({ message: "Please Recheck your data!" });
    }

    if (!leaveType || !typesOfLeaves.includes(leaveType)) {
      res.status(400).json({ message: "Bad Request! leave type is necessary to request for leave" });
      return;
    };

    console.log("Selected ", selected, "leavetype", leaveType);
    const holidays = await Holidays.find();
    let throwError = false;

    holidays.map((date: HolidaysSchemaType, index) => {
      let splitDate = date.holidays.toISOString().split('T');
      let time = splitDate[0];
      if (selected.includes(time)) {
        throwError = true;
      }
    });

    if (throwError) {
      res.status(200).json({ message: "Please don't select holidays as leave date!" });
      return;
    };

    const findIfRequestedDateAvailable = await LeaveAvaiable.findOne({ userId });

    if (!findIfRequestedDateAvailable) {
      const createUserLeave = await LeaveAvaiable.create({ userId });

      if (!createUserLeave) {
        res.status(400).json({ message: "Something went wrong while creating the database!" });
        return;
      }
    };

    if (findIfRequestedDateAvailable[leaveType] <= selected.length()) {
      res.status(400).json({ message: "Don't Have enough leave date!" });
      return;
    };

    const createRequestStatus = LeaveRequest.create({ userId, status: 'pending', requestedDates: selected, department });

    if (!createRequestStatus) {
      res.status(400).json({ message: "Something went wrong while trying to create request status!" });
      return;
    }

    res.status(200).json({ message: "Sucessfully requested leave please wait for your supervisor to approve" });
    return;
  }
  catch (error: any) {
    console.log("Error Occured while requesting leave", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
}

export { gettingAttendanceInformation, checkIn, checkOut, requestingLeave };

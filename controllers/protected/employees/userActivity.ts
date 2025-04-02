import { Request, Response } from "express";
import Attendance from "../../../models/attendance";

interface AuthRequest extends Request {
  user?: { role: string, department: string, userId: number, fullname: string }
};

const gettingAttendanceInformation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(403).json({ message: "Invalid or Expired Token!", success: false });
      return;
    };

    const today = new Date().toDateString();

    const findTodayCheckIn = await Attendance.findOne({ userId, checkedInDate: today });

    if (!findTodayCheckIn) {
      res.status(200).json({ message: "Haven't Checked In Today!", success: true });
      return;
    }

    const checkInTime = findTodayCheckIn.checkInTime ?? null;
    const checkOutTime = findTodayCheckIn.checkOutTime ?? null;

    res.status(200).json({ message: "Successful!", checkInTime, checkOutTime, success: true });
    return;
  } catch (error) {
    console.error("Error Occurred While Getting User Information:", String(error));
    res.status(500).json({ message: "Internal Server Error Occurred!", success: false });
    return;
  }
};

const checkIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(400).json({ message: "Something went wrong while trying to check in", success: false });
      return;
    }

    const today = new Date();
    const checkedInDate = `${today.toDateString()}`;

    const findExistingCheckIn = await Attendance.findOne({ userId, checkedInDate });

    if (findExistingCheckIn?.checkedIn === true) {
      res.status(400).json({ message: "You have already created the data!", success: false });
      return;
    }

    const createNewCheckIn = await Attendance.create({
      userId,
      checkInTime: today,
      checkedInDate,
      checkedIn: true
    });

    if (!createNewCheckIn) {
      res.status(400).json({ message: "Something went wrong while checking in !", success: false });
      return;
    };

    res.status(200).json({ message: "Checked In Successfully!", success: true });
    return;
  } catch (error) {
    console.error("Error Occurred While Checking In:", error.message);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const checkOut = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.user;

    if (!userId) {
      res.status(403).json({ message: "Unauthorized action", success: false });
      return;
    };

    const today = new Date();
    const checkedInDate = today.toDateString();

    const findExistingCheckIn = await Attendance.findOne({ userId, checkedInDate });

    if (!findExistingCheckIn) {
      res.status(400).json({ message: "You haven't checked in yet!", success: false });
      return;
    };

    if (!findExistingCheckIn.checkedIn) {
      res.status(400).json({ message: "You haven't checked in yet!", success: false });
      return;
    };

    if (findExistingCheckIn.checkOutTime) {
      res.status(400).json({ message: "You have already checked out today!", success: false })
    }
    findExistingCheckIn.checkOutTime = today;
    await findExistingCheckIn.save();

    res.status(200).json({ message: "Checked Out Successfully!", success: true });

  } catch (error) {
    console.error("Error Occurred While Trying to Check Out:", String(error));
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export { gettingAttendanceInformation, checkIn, checkOut };

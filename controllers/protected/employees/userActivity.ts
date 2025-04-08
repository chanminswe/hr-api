import { Request, Response } from "express";
import Attendance from "../../../models/attendance";
import { createErrorResponse } from "../../../types/errorType";
import { createSuccessResponse } from "../../../types/successType";
import redis from "../../../utils/redis";

interface AuthRequest extends Request {
  user?: { role: string, department: string, userId: number, fullname: string }
};

const gettingAttendanceInformation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(403).json(createErrorResponse("Invalid or Expired Token!", 403, "Unauthorized"));
      return;
    };

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Check Redis cache first
    const redisKey = `attendance:${userId}:${startOfDay.toISOString().split('T')[0]}`; // Unique key for today
    const cachedAttendance = await redis.get(redisKey);

    if (cachedAttendance) {
      console.log('Returning cached attendance data');
      // Parse the cached data into an object
      const attendanceData = JSON.parse(cachedAttendance);
      console.log(attendanceData);
      res.status(200).json({
        message: "Successful!",
        checkInTime: attendanceData.checkInTime,
        checkOutTime: attendanceData.checkOutTime,
        success: true
      });
      return;
    }


    const findTodayCheckIn = await Attendance.findOne({
      userId, checkedInDate: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    },
      { checkInTime: 1, checkOutTime: 1, _id: 0 }

    ).lean();

    if (!findTodayCheckIn) {
      res.status(200).json(createSuccessResponse("Haven't checked in today!", 200));
      return;
    }

    const checkInTime = findTodayCheckIn.checkInTime ?? null;
    const checkOutTime = findTodayCheckIn.checkOutTime ?? null;
    const attendanceData = { checkInTime, checkOutTime };
    await redis.set(redisKey, JSON.stringify(attendanceData), 'EX', 1000 * 60); // Cache for 24 hours

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
  } catch (error: any) {
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

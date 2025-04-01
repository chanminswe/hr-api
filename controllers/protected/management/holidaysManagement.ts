import { Request, Response } from "express";
import Holidays from "../../models/holidays";

interface UserRequest extends Request {
	user?: { role: string, department: string, userId: number, fullname: string };
}

interface HolidayType {
	year: number,
	month: number,
	date: number,
	nameOfHoliday: string,
}

const addingHolidays = async (req: UserRequest, res: Response): Promise<void> => {
	try {
		const adminInfo = req.user;
		const { year, month, date, nameOfHoliday }: HolidayType = req.body;

		if (!adminInfo || !date || !month || !year || !nameOfHoliday) {
			res.status(400).json({ message: "Bad Request! All fields are required." });
			return;
		}

		const storingDate = new Date(Date.UTC(year, month - 1, date));
		storingDate.setUTCHours(0, 0, 0, 0);

		console.log("Storing Date", storingDate.toISOString());

		if (!(storingDate instanceof Date) || isNaN(storingDate.getTime())) {
			res.status(400).json({ message: "Bad Request! Invalid date format." });
			return;
		}

		const addHolidays = await Holidays.create({
			holidays: storingDate,
			nameOfHoliday,
		});

		if (!addHolidays) {
			res.status(400).json({ message: "Failed to add holiday. Please try again." });
			return;
		}

		res.status(200).json({ message: "Holiday added successfully!" });
	} catch (error: any) {
		console.error("Error in addingHolidays controller:", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export { addingHolidays };

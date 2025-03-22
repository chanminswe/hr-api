import { Request, Response } from "express";
import Holidays from "../models/holidays";

interface UserRequest extends Request {
	user?: { role: string, department: string, userId: number, fullname: string };
}

const addingHolidays = async (req: UserRequest, res: Response) => {
	try {
		const adminInfo = req.user;
		const { year, month, date, nameOfHoliday } = req.body;

		if (!adminInfo || !date || !month! || !year || !nameOfHoliday) {
			res.status(400).json({ message: "Couldn't get necessary user info" });
			return;
		}

		const storingDate = new Date(`${year}-${month}-${date}`);

		if (!(storingDate instanceof Date) || isNaN(storingDate.getTime())) {
			res.status(400).json({ message: "Your date time is invalid" });
			return;
		};

		console.log(storingDate);

		const addHolidays = await Holidays.create({
			holidays: storingDate,
			nameOfHoliday
		});

		if (!addHolidays) {
			res.status(400).json({ message: "Something went wrong while adding holiday!" });
			return;
		}

		res.status(200).json({ message: "Added Holidays Sucessfully!" });
		return;
	}
	catch (error: any) {
		console.log("Error Occured at add holiday controller ", error.message);
		res.status(500).json({ message: "Internal Server Error" });
		return;
	}
}

export { addingHolidays };

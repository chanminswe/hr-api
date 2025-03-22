import { Request, Response } from "express"

interface UserRequest extends Request {
	user?: { role: string, department: string, userId: number, fullname: string };
}

const addingHolidays = (req: UserRequest, res: Response) => {
	try {
		const adminInfo = req.user;
		const { date } = req.body;

		if (!adminInfo || !date) {
			res.status(400).json({ message: "Couldn't get necessary user info" });
		}

		console.log(adminInfo, date);
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

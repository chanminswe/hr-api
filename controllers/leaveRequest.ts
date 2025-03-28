import { Request, Response } from "express";
import Holidays from '../models/holidays';
import LeaveRequest from "../models/requestLeave";
import { HolidaysSchemaType } from "../models/holidays";
import LeaveAvaiable from '../models/leave';

interface TokenType extends Request {
	user: { role: string, department: string, userId: number, fullname: string }
}

const checkIfInputsAreValid = (selected: string[], leaveType: string): { valid: boolean, message?: string } => {
	const typesOfLeaves = ['annual', 'casual', 'unpaid', 'medical'];

	if (!selected || !Array.isArray(selected) || selected.length === 0) {
		return { valid: false, message: "Please select at least one date" };
	}

	if (!leaveType || !typesOfLeaves.includes(leaveType)) {
		return { valid: false, message: "Bad Request! leave type is necessary to request for leave" };
	}

	return { valid: true };
};

const checkIfRequestedDatePartOfHolidays = (holidays: HolidaysSchemaType[], selected: string[]): boolean => {
	return holidays.some((date: HolidaysSchemaType) => {
		const splitDate = date.holidays.toISOString().split('T');
		const time = splitDate[0];
		return selected.includes(time);
	});
};

const requestingLeave = async (req: TokenType, res: Response): Promise<void> => {
	try {
		const { userId, department } = req.user;
		const { selected, leaveType } = req.body;

		// Validate inputs
		const inputValidation = checkIfInputsAreValid(selected, leaveType);
		if (!inputValidation.valid) {
			res.status(400).json({ message: inputValidation.message });
			return;
		}

		console.log("Selected ", selected, "leavetype", leaveType);

		// Check holidays
		const holidays = await Holidays.find();
		if (checkIfRequestedDatePartOfHolidays(holidays, selected)) {
			res.status(400).json({ message: "Please don't select holidays as leave date!" });
			return;
		}

		// Get or create leave balance
		let findIfRequestedDateAvailable = await LeaveAvaiable.findOne({ userId });
		if (!findIfRequestedDateAvailable) {
			findIfRequestedDateAvailable = await LeaveAvaiable.create({ userId });
			if (!findIfRequestedDateAvailable) {
				res.status(400).json({ message: "Something went wrong while creating the database!" });
				return;
			}
		}

		console.log(findIfRequestedDateAvailable);

		// Check leave balance
		if (findIfRequestedDateAvailable[leaveType] < selected.length) {
			res.status(400).json({ message: "Don't have enough leave days!" });
			return;
		}

		// Create leave request
		const createRequestStatus = await LeaveRequest.create({
			userId,
			status: 'pending',
			requestedDates: selected,
			department
		});

		res.status(200).json({ message: "Successfully requested leave please wait for your supervisor to approve" });
	}
	catch (error: any) {
		console.log("Error Occured while requesting leave", error.message);
		if (!res.headersSent) {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
}

export { requestingLeave };

import { Request, Response } from 'express';
import { Inbox } from '../../../models/inbox';

interface AuthRequest extends Request {
	user?: { role: string, department: string, userId: number, fullname: string }
};

const getUserInbox = async (req: AuthRequest, res: Response): Promise<void> => {

	try {
		const { userId } = req.user;

		if (!userId) {
			res.status(403).json({ message: "Couldn't get user id !", success: false });
		};

		const findInbox = await Inbox.find({ userId });

		if (!findInbox) {
			res.status(200).json({ message: "Couldn't get any inbox!", findInbox: {}, success: true });
			return;
		};

		res.status(200).json({ message: "Sucessfully retrieved !", findInbox, success: true });
		return;
	}
	catch (error: any) {
		console.log("Error Occured at get User Inbox Controller", error.message);
		res.status(500).json({ message: "Internal Server Error", success: false });
		return;
	}
}

export { getUserInbox };

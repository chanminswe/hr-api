import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
	user?: { role: string, department: string, userId: number, fullname: string }
}

const verifyHrRole = (req: AuthRequest, res: Response, next: NextFunction): void => {
	try {
		const unsplitToken = req.header('Authorization');

		if (!unsplitToken || !unsplitToken.startsWith('Bearer')) {
			res.status(403).json({ message: "Couldn't Contain Headers", success: false });
			return;
		}

		const token = unsplitToken.split(" ")[1];

		if (!token) {
			res.status(400).json({ message: "Couldn't Contain the token!", success: false });
			return;
		}

		const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

		if (!decodedToken || !decodedToken.role || !decodedToken.department || !decodedToken.userId || !decodedToken.fullname) {
			res.status(400).json({ message: "token Doesn't included required information!", success: false });
			return;
		}

		if (decodedToken.role !== 'management' && decodedToken.department !== 'HumanResource') {
			res.status(403).json({ message: "You are UnAuthorized to update holidays", success: false });
			return;
		}

		req.user = decodedToken;
		next();
	}
	catch (error) {
		console.log("Error Occured At Verifying the HR Role", error.message);
		res.status(500).json({ message: "Internal Server Error", success: false });
		return;
	}
}

export default verifyHrRole;

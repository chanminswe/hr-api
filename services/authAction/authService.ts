import { UserModelType } from "../../types/userModelType";
import { ErrorType } from "../../types/errorType";
import Users from "../../models/users";


const registerService = async ({ email, password, role, department, canEdit, fullname }: UserModelType): Promise<UserModelType | ErrorType> => {
	try {
		const registerUserInDB = await Users.create({ email, password, role, department, canEdit, fullname });

		if (!registerUserInDB) {
			throw new Error("Something went wrong!");
		}
		else {
			return registerUserInDB;
		}
	}
	catch (error: any) {
		console.error("Error Occured At Register Service", error.message);

		return {
			message: "Registration Failed",
			code: 500,
			type: 'database'
		}
	}
}

export { registerService }

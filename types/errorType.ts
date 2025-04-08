export interface ErrorType {
	message: string,
	code: number,
	type: string,
	sucess?: boolean,

}

export function createErrorResponse(message: string, code: number, type: string): ErrorType {
	return { message, code, type, sucess: false };
}



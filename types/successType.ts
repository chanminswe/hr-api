import { TokenPayload } from "./returnTokenType";

export interface SuccessType {
	message: string;
	code: number;
	data?: any;
	token?: string;
	success?: boolean;
}

export function createSuccessResponse(message: string, code: number, options?: {
	data?: any,
	token?: string
}): SuccessType {
	return { message, code, success: true, ...options }
}

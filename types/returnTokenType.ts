export interface TokenPayload {
	userId: number;
	fullname: string;
	role: string;
	department: string;
	iat?: number;
	exp?: number;
}

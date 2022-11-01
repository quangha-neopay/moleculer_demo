import { Role } from '../constants/user-role';

export class RegisterDto {
	username: string;
	password: string;
	fullName: string;
	role?: Role;
}

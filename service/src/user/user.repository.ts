import mongoose, { UpdateWriteOpResult } from 'mongoose';
import { User } from './model/user.model';
import { JwtPayload } from 'jsonwebtoken';

export interface IUserRepo {
	register(
		username: string,
		password: string,
		fullName: string,
	): Promise<User>;
	login(username: string, password: string): Promise<string>;
	update(
		userId: mongoose.Types.ObjectId,
		fullName: string,
	): Promise<UpdateWriteOpResult>;
	changePassword(
		userId: mongoose.Types.ObjectId,
		oldPassword: string,
		newPassword: string,
	): Promise<string>;
	// checkUserExist(userId: string): Promise<boolean>;
	getUserById(userId: mongoose.Types.ObjectId): Promise<User>;
	getAllUsers(): Promise<User[]>;
	verifyToken(token: string): JwtPayload | string;
}

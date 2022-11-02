import mongoose from 'mongoose';
import { User } from './model/user.model';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from './constants/user-role';

export interface IUserRepo {
	register(
		username: string,
		password: string,
		fullName: string,
		role?: Role,
	): Promise<User | string>;
	login(username: string, password: string): Promise<string>;
	update(
		userId: mongoose.Types.ObjectId,
		fullName: string,
	): Promise<User | string>;
	changePassword(
		userId: mongoose.Types.ObjectId,
		oldPassword: string,
		newPassword: string,
	): Promise<string>;
	getUserById(userId: mongoose.Types.ObjectId): Promise<User | string>;
	getOtherUserById(userId: mongoose.Types.ObjectId): Promise<User | string>;
	getAllUsers(): Promise<User[]>;
	verifyToken(token: string): JwtPayload | string;
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash, compare } from 'bcryptjs';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Role } from './constants/user-role';
import { User } from './model/user.model';
import { IUserRepo } from './user.repository';

@Injectable()
export class UserHandler implements IUserRepo {
	constructor(
		@InjectModel(User.name) private userModel: mongoose.Model<User>,
	) {}

	public async register(
		username: string,
		password: string,
		fullName: string,
		role?: Role,
	): Promise<User | string> {
		try {
			const user = await this.userModel
				.findOne({ username })
				.select('-password');

			if (user) {
				return 'User already exist';
			}

			const hashedPassword = await hash(password, 10);

			const newUser = await this.userModel.create({
				username,
				password: hashedPassword,
				fullName,
				role,
			});
			await newUser.save();

			return newUser;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async login(username: string, password: string): Promise<string> {
		try {
			const user = await this.userModel.findOne({ username });
			const isMatchedPassword = await this.checkPassword(
				password,
				user.password,
			);

			if (!user || !isMatchedPassword) {
				return 'Invalid username or password';
			}

			const { _id } = user;

			const accessToken = sign(
				{ _id, username },
				process.env.SECRET_KEY,
				{ expiresIn: '5h' },
			);
			return accessToken;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async update(
		userId: mongoose.Types.ObjectId,
		fullName: string,
	): Promise<User | string> {
		try {
			const updatedUser = await this.userModel.findByIdAndUpdate(
				{ _id: userId },
				{
					fullName,
				},
			);
			if (!updatedUser) {
				return 'User not found';
			}

			return updatedUser;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async changePassword(
		userId: mongoose.Types.ObjectId,
		oldPassword: string,
		newPassword: string,
	): Promise<string> {
		try {
			const user = await this.userModel.findById(userId);
			const isMatchedPassword = await this.checkPassword(
				oldPassword,
				user.password,
			);

			if (!user || !isMatchedPassword) {
				return 'Invalid username or password';
			}

			const hashedPassword = await hash(newPassword, 10);

			const result = await this.userModel.updateOne(
				{ _id: userId },
				{ password: hashedPassword },
			);

			return result.matchedCount !== 0
				? 'Update password success'
				: '_id not match';
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	// public async checkUserExist(userId: string): Promise<boolean> {
	//     const isUserExist = await this.userModel.findOne({ _id: userId }).select("_id").lean();

	//     return isUserExist ? true : false;
	// }

	public async getUserById(
		userId: mongoose.Types.ObjectId,
	): Promise<User | string> {
		try {
			const user = await this.userModel
				.findById({ _id: userId })
				.select('-password -refreshToken');

			if (!user) {
				return 'User not found';
			}

			return user;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async getAllUsers(
		_id: mongoose.Types.ObjectId,
	): Promise<User[] | string> {
		try {
			const user = await this.userModel.findById({ _id });
			if (user.role !== Role.ADMIN) {
				return 'You are not admin';
			}
			const users = await this.userModel.find();

			return users;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public verifyToken(token: string): JwtPayload | string {
		const decoded = verify(token, process.env.SECRET_KEY);
		return decoded;
	}

	public async checkPassword(
		inputPassword: string,
		userPassword: string,
	): Promise<boolean> {
		try {
			const check = await compare(inputPassword, userPassword);

			return check ? true : false;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}
}

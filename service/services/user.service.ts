import { Service, ServiceBroker } from 'moleculer';
import { NestFactory } from '@nestjs/core';
import { UserModule } from '../src/user/user.module';
import { UserHandler } from '../src/user/user.handler';
import { RegisterDto } from '../src/user/dto/register.dto';
import { LoginDto } from '../src/user/dto/login.dto';
import mongoose from 'mongoose';

export default class UserService extends Service {
	private userHandler: UserHandler;

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'user',

			hooks: {
				before: {
					getAllUsers: [this.isAdminHook],
					getOtherUserById: [this.isAdminHook],
				},
			},

			actions: {
				register: {
					rest: {
						method: 'POST',
						path: '/register',
					},
					params: {
						username: 'string',
						password: { type: 'string', min: 6 },
						fullName: 'string',
					},
					handler: this.register,
				},
				login: {
					rest: {
						method: 'POST',
						path: '/login',
					},
					params: {
						username: 'string',
						password: 'string',
					},
					handler: this.login,
				},
				update: {
					rest: {
						method: 'POST',
						path: '/update',
					},
					params: {
						fullName: 'string',
					},
					handler: this.update,
				},
				changePassword: {
					rest: {
						method: 'PUT',
						path: '/change-password',
					},
					params: {
						oldPassword: 'string',
						newPassword: { type: 'string', min: 6 },
					},
					handler: this.changePassword,
				},
				getUserById: {
					rest: {
						method: 'GET',
						path: '/get-user-by-id',
					},
					handler: this.getUserById,
				},
				getOtherUserById: {
					rest: {
						method: 'GET',
						path: '/get-user-by-id/:userId',
					},
					params: {
						userId: 'string',
					},
					handler: this.getOtherUserById,
				},
				getAllUsers: {
					rest: {
						method: 'GET',
						path: '/get-all-users',
					},
					handler: this.getAllUsers,
				},
				verifyToken: {
					handler: this.verifyToken,
				},
				checkUserExist: {
					handler: this.checkUserExist,
				},
				isAdmin: {
					handler: this.isAdmin,
				},
			},

			started: this.bootstrap,
		});
	}

	// Action
	public async register(ctx: any) {
		const { username, password, fullName, role }: RegisterDto = ctx.params;
		const user = await this.userHandler.register(
			username,
			password,
			fullName,
			role,
		);
		return user;
	}

	public async login(ctx: any) {
		const { username, password }: LoginDto = ctx.params;
		const user = await this.userHandler.login(username, password);
		return user;
	}

	public async update(ctx: any) {
		const { _id } = ctx.meta.user;
		const { fullName } = ctx.params;

		const user = await this.userHandler.update(
			new mongoose.Types.ObjectId(_id),
			fullName,
		);
		return user;
	}

	public async changePassword(ctx: any) {
		const { _id } = ctx.meta.user;
		const { oldPassword, newPassword } = ctx.params;

		const result = await this.userHandler.changePassword(
			new mongoose.Types.ObjectId(_id),
			oldPassword,
			newPassword,
		);
		return result;
	}

	public async getUserById(ctx: any) {
		const { _id } = ctx.meta.user;

		const user = await this.userHandler.getUserById(
			new mongoose.Types.ObjectId(_id),
		);
		return user;
	}

	public async getOtherUserById(ctx: any) {
		const { userId } = ctx.params;

		const user = await this.userHandler.getOtherUserById(
			new mongoose.Types.ObjectId(userId),
		);
		return user;
	}

	public async getAllUsers(ctx: any) {
		const users = await this.userHandler.getAllUsers();
		return users;
	}

	public async isAdminHook(ctx: any) {
		const { _id } = ctx.meta.user;
		const result = await this.userHandler.isAdmin(
			new mongoose.Types.ObjectId(_id),
		);
		if (!result) {
			throw new Error('You are not admin');
		}
	}

	public async verifyToken(ctx: any) {
		const { token } = ctx.params;
		const res = await this.userHandler.verifyToken(token);
		return res;
	}

	public async checkUserExist(ctx: any) {
		const { userId } = ctx.params;
		const result = await this.userHandler.checkUserExist(
			new mongoose.Types.ObjectId(userId),
		);
		return result;
	}

	public async isAdmin(ctx: any) {
		const { _id } = ctx.meta.user;
		const result = await this.userHandler.isAdmin(
			new mongoose.Types.ObjectId(_id),
		);
		return result ? true : false;
	}

	async bootstrap() {
		const app = await NestFactory.createApplicationContext(UserModule);
		this.userHandler = app.get(UserHandler);
	}
}

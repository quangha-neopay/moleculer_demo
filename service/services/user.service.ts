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

			hooks: {},

			actions: {
				register: {
					rest: {
						method: 'POST',
						path: '/register',
					},
					params: {
						username: 'string',
						password: { type: 'string', min: 6 },
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
			},

			started: this.bootstrap,
		});
	}

	// Action
	public async register(ctx: any) {
		const { username, password, fullName }: RegisterDto = ctx.params;
		const user = await this.userHandler.register(
			username,
			password,
			fullName,
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

	public async getAllUsers(ctx: any) {
		const users = await this.userHandler.getAllUsers();
		return users;
	}

	public async verifyToken(ctx: any) {
		const { token } = ctx.params;
		const res = await this.userHandler.verifyToken(token);
		return res;
	}

	async bootstrap() {
		const app = await NestFactory.createApplicationContext(UserModule);
		this.userHandler = app.get(UserHandler);
	}
}

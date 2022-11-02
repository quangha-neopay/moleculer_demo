import { UserTaskManagementHandler } from '../src/user-task-management/user-task-management.handler';
import { NestFactory } from '@nestjs/core';

import { Service, ServiceBroker } from 'moleculer';
import { UserTaskManagementModule } from '../src/user-task-management/user-task-management.module';
import mongoose from 'mongoose';

export default class UserTaskManagementService extends Service {
	private userTaskManagementHandler: UserTaskManagementHandler;

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'task-management',

			hooks: {
				before: {
					assignTask: [this.assignTaskHook],
					markTaskDone: [
						this.checkUserTaskManagementExist,
						this.isTaskOwnerHook,
					],
				},
			},

			actions: {
				assignTask: {
					rest: {
						method: 'POST',
						path: '/assign',
					},
					params: {
						userId: 'string',
						taskId: 'string',
					},
					handler: this.assignTask,
				},
				getTaskListByUserId: {
					rest: {
						method: 'GET',
						path: '/get-task-list/:userId',
					},
					params: {
						userId: 'string',
					},
					handler: this.getTaskListByUserId,
				},
				markTaskDone: {
					rest: {
						method: 'PUT',
						path: '/mark-task-done',
					},
					params: {
						userTaskManagementId: 'string',
					},
					handler: this.markTaskDone,
				},
			},

			started: this.bootstrap,
		});
	}

	public async assignTask(ctx: any) {
		const { userId, taskId } = ctx.params;
		const result = await this.userTaskManagementHandler.assignTask(
			new mongoose.Types.ObjectId(taskId),
			new mongoose.Types.ObjectId(userId),
		);
		return result;
	}

	private async assignTaskHook(ctx: any) {
		const { _id } = ctx.meta.user;
		const { userId, taskId } = ctx.params;

		const isTaskManager = await ctx.call('task.isTaskManager', {
			taskId,
			_id,
		});
		const isUserExist = await ctx.call('user.checkUserExist', ctx.params);
		const isTaskExist = await ctx.call('task.checkTaskExist', ctx.params);
		const isTaskManagementExist =
			await this.userTaskManagementHandler.isTaskAssigned(
				new mongoose.Types.ObjectId(userId),
				new mongoose.Types.ObjectId(taskId),
			);

		if (!isTaskManager) {
			throw new Error('You are not task manager');
		}

		if (!isUserExist || !isTaskExist) {
			throw new Error('USer or Task not found');
		}

		if (isTaskManagementExist) {
			throw new Error('User is already assigned this task');
		}
	}

	public async getTaskListByUserId(ctx: any) {
		const { userId } = ctx.params;
		const result = await this.userTaskManagementHandler.getTaskListByUserId(
			new mongoose.Types.ObjectId(userId),
		);
		return result;
	}

	public async markTaskDone(ctx: any) {
		const { userTaskManagementId } = ctx.params;
		const result = await this.userTaskManagementHandler.markTaskDone(
			new mongoose.Types.ObjectId(userTaskManagementId),
		);
		return result;
	}

	public async isTaskOwnerHook(ctx: any) {
		const { userTaskManagementId } = ctx.params;
		const { _id } = ctx.meta.user;
		const result = await this.userTaskManagementHandler.isTaskOwner(
			new mongoose.Types.ObjectId(userTaskManagementId),
			new mongoose.Types.ObjectId(_id),
		);
		if (!result) {
			throw new Error('You are not task owner');
		}
	}

	public async checkUserTaskManagementExist(ctx: any) {
		const { userTaskManagementId } = ctx.params;
		const result =
			await this.userTaskManagementHandler.checkUserTaskManagementExist(
				new mongoose.Types.ObjectId(userTaskManagementId),
			);
		if (!result) {
			throw new Error('Task management not found');
		}
	}

	async bootstrap() {
		const app = await NestFactory.createApplicationContext(
			UserTaskManagementModule,
		);
		this.userTaskManagementHandler = app.get(UserTaskManagementHandler);
	}
}

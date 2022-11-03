import { Service, ServiceBroker } from 'moleculer';
import { NestFactory } from '@nestjs/core';
import { TaskHandler } from '../src/task/task.handler';
import { TaskModule } from '../src/task/task.module';
import { CreateTaskDto } from '../src/task/dto/create-task.dto';
import mongoose from 'mongoose';
import { UpdateTaskDto } from '../src/task/dto/update-task.dto';

export default class TaskService extends Service {
	private taskHandler: TaskHandler;

	constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: 'task',

			hooks: {
				before: {
					create: [this.createTaskHook],
					update: [this.checkTaskExistHook, this.isTaskManagerHook],
					getTaskById: [
						this.checkTaskExistHook,
						this.isTaskManagerHook,
					],
					getAllTasks: [this.isTaskManagerHook],
				},
			},

			actions: {
				create: {
					rest: {
						method: 'POST',
						path: '/create',
					},
					params: {
						name: 'string',
						description: 'string',
					},
					handler: this.create,
				},
				getTaskById: {
					rest: {
						method: 'GET',
						path: '/',
					},
					handler: this.getTaskById,
				},
				update: {
					rest: {
						method: 'PUT',
						path: '/update/:taskId',
					},
					params: {
						taskId: 'string',
						name: 'string',
						description: 'string',
					},
					handler: this.update,
				},
				getAllTasks: {
					rest: {
						method: 'GET',
						path: '/get-all-tasks',
					},
					handler: this.getAllTasks,
				},
				checkTaskExist: {
					handler: this.checkTaskExist,
				},
				isTaskManager: {
					handler: this.isTaskManager,
				},
			},

			started: this.bootstrap,
		});
	}

	private async create(ctx: any) {
		const { name, description }: CreateTaskDto = ctx.params;
		const { _id } = ctx.meta.user;
		const result = await this.taskHandler.create(
			name,
			description,
			new mongoose.Types.ObjectId(_id),
		);
		return result;
	}

	private async createTaskHook(ctx: any) {
		const isAdmin = await ctx.call('user.isAdmin', ctx.meta.user);
		if (!isAdmin) {
			throw new Error('You are not admin');
		}
	}

	private async getTaskById(ctx: any) {
		const { id } = ctx.params;
		const result = await this.taskHandler.getTaskById(
			new mongoose.Types.ObjectId(id),
		);
		return result;
	}

	private async update(ctx: any) {
		const { taskId, name, description }: UpdateTaskDto = ctx.params;
		const result = await this.taskHandler.update(
			new mongoose.Types.ObjectId(taskId),
			name,
			description,
		);
		return result;
	}

	private async isTaskManagerHook(ctx: any) {
		const { taskId } = ctx.params;
		const { _id } = ctx.meta.user;
		const result = await this.taskHandler.isTaskManager(
			new mongoose.Types.ObjectId(taskId),
			new mongoose.Types.ObjectId(_id),
		);
		if (!result) {
			throw new Error('You are not task manager');
		}
	}

	private async checkTaskExistHook(ctx: any) {
		const { taskId } = ctx.params;
		const result = await this.taskHandler.checkTaskExist(
			new mongoose.Types.ObjectId(taskId),
		);
		if (!result) {
			throw new Error('Task not found');
		}
	}

	private async checkTaskExist(ctx: any) {
		const { taskId } = ctx.params;
		const result = await this.taskHandler.checkTaskExist(
			new mongoose.Types.ObjectId(taskId),
		);
		return result;
	}

	private async isTaskManager(ctx: any) {
		const { taskId } = ctx.params;
		const { _id } = ctx.meta.user;
		const result = await this.taskHandler.isTaskManager(
			new mongoose.Types.ObjectId(taskId),
			new mongoose.Types.ObjectId(_id),
		);
		return result;
	}

	private async getAllTasks(ctx: any) {
		const { _id } = ctx.meta.user;
		const result = await this.taskHandler.getAllTasks(
			new mongoose.Types.ObjectId(_id),
		);
		return result;
	}

	private async bootstrap() {
		const app = await NestFactory.createApplicationContext(TaskModule);
		this.taskHandler = app.get(TaskHandler);
	}
}

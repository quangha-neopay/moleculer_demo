import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Task } from './model/task.model';
import { ITaskRepo } from './task.repository';

@Injectable()
export class TaskHandler implements ITaskRepo {
	constructor(
		@InjectModel(Task.name) private taskModel: mongoose.Model<Task>,
	) {}

	public async create(
		name: string,
		description: string,
		managerId: mongoose.Types.ObjectId,
	): Promise<Task | string> {
		try {
			if (!name || !description || !managerId) {
				return 'Fill out all the fields';
			}
			const newTtask = await this.taskModel.create({
				name,
				description,
				managerId,
			});
			await newTtask.save();
			return newTtask;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async getTaskById(
		taskId: mongoose.Types.ObjectId,
	): Promise<Task | string> {
		try {
			const task = await this.taskModel.findById({ _id: taskId });
			if (!task) {
				return 'Task not found';
			}
			return task;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async update(
		taskId: mongoose.Types.ObjectId,
		name: string,
		description: string,
	): Promise<Task | string> {
		try {
			const updatedTask = await this.taskModel.findByIdAndUpdate(
				{ _id: taskId },
				{ name, description },
			);
			if (!updatedTask) {
				return 'Task not found';
			}
			const task = await this.taskModel.findById({ _id: taskId });
			return task;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async getAllTasks(
		managerId: mongoose.Types.ObjectId,
	): Promise<Task[]> {
		try {
			const tasks = await this.taskModel.find({ managerId });
			return tasks;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async isManager(
		taskId: mongoose.Types.ObjectId,
		managerId: mongoose.Types.ObjectId,
	): Promise<boolean> {
		try {
			const task = await this.taskModel.findOne({
				_id: taskId,
				managerId,
			});
			return task ? true : false;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async checkTaskExist(
		taskId: mongoose.Types.ObjectId,
	): Promise<boolean> {
		try {
			const check = await this.taskModel
				.findOne({ _id: taskId })
				.select('_id')
				.lean();
			return check ? true : false;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}
}

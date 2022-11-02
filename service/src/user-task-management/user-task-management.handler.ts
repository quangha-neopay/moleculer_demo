import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TaskStatus } from './constants/task.status';
import { UserTaskManagement } from './model/user-task-manament.model';
import { IUserTaskManagementRepo } from './user-task-management.repository';

@Injectable()
export class UserTaskManagementHandler implements IUserTaskManagementRepo {
	constructor(
		@InjectModel(UserTaskManagement.name)
		private userTaskManagementModel: mongoose.Model<UserTaskManagement>,
	) {}

	public async assignTask(
		taskId: mongoose.Types.ObjectId,
		userId: mongoose.Types.ObjectId,
	): Promise<UserTaskManagement> {
		const task = await this.userTaskManagementModel.create({
			taskId,
			userId,
		});
		await task.save();
		return task;
	}

	public async getTaskListByUserId(
		userId: mongoose.Types.ObjectId,
	): Promise<UserTaskManagement[]> {
		try {
			const taskList = await this.userTaskManagementModel
				.find({
					userId,
				})
				.select('-createdAt -updatedAt -__v');
			return taskList;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async markTaskDone(
		userTaskManagementId: mongoose.Types.ObjectId,
	): Promise<UserTaskManagement> {
		const task = await this.userTaskManagementModel.findById({
			_id: userTaskManagementId,
		});
		if (task.status === TaskStatus.DONE) {
			return task;
		}
		try {
			const task = await this.userTaskManagementModel
				.findByIdAndUpdate(
					{ _id: userTaskManagementId },
					{ status: TaskStatus.DONE },
					{ new: true },
				)
				.select('-createdAt -updatedAt -__v')
				.lean();

			return task;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async isTaskOwner(
		userTaskManagementId: mongoose.Types.ObjectId,
		userId: mongoose.Types.ObjectId,
	): Promise<boolean> {
		try {
			const check = await this.userTaskManagementModel
				.findOne({
					_id: userTaskManagementId,
					userId,
				})
				.lean();
			return check ? true : false;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async checkUserTaskManagementExist(
		userTaskManagementId: mongoose.Types.ObjectId,
	): Promise<boolean> {
		try {
			const check = await this.userTaskManagementModel
				.findOne({ _id: userTaskManagementId })
				.lean();
			return check ? true : false;
		} catch (err) {
			throw new InternalServerErrorException(err.messages);
		}
	}

	public async isTaskAssigned(
		taskId: mongoose.Types.ObjectId,
		userId: mongoose.Types.ObjectId,
	): Promise<boolean> {
		const check = await this.userTaskManagementModel.findOne({
			userId,
			taskId,
		});
		return check ? true : false;
	}
}

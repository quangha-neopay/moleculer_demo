import mongoose from 'mongoose';
import { Task } from '../task/model/task.model';
import { UserTaskManagement } from './model/user-task-manament.model';

export interface IUserTaskManagementRepo {
	assignTask(
		taskId: mongoose.Types.ObjectId,
		userId: mongoose.Types.ObjectId,
	): Promise<UserTaskManagement>;
	// remove(taskManagId: )
	getTaskListByUserId(
		userId: mongoose.Types.ObjectId,
	): Promise<UserTaskManagement[]>;
	markTaskDone(
		userTaskManagementId: mongoose.Types.ObjectId,
	): Promise<UserTaskManagement>;
}

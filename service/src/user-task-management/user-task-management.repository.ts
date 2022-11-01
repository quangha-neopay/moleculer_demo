import mongoose from 'mongoose';
import { UserTaskManagement } from './model/user-task-manament.model';

export interface IUserTaskManagementRepo {
	assign(
		taskId: mongoose.Types.ObjectId,
		userId: mongoose.Types.ObjectId,
	): Promise<UserTaskManagement>;
	// remove(taskManagId: )
	getTaskListByUserId(
		userId: mongoose.Types.ObjectId,
	): Promise<UserTaskManagement[]>;
}

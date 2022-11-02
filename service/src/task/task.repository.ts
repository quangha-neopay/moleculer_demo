import mongoose from 'mongoose';
import { Task } from './model/task.model';

export interface ITaskRepo {
	create(
		name: string,
		detail: string,
		managerId: mongoose.Types.ObjectId,
	): Promise<Task | string>;

	getTaskById(taskId: mongoose.Types.ObjectId): Promise<Task | string>;

	update(
		taskId: mongoose.Types.ObjectId,
		name: string,
		detail: string,
	): Promise<Task | string>;

	getAllTasks(userId: mongoose.Types.ObjectId): Promise<Task[]>;
}

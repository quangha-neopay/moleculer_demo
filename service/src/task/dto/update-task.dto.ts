import mongoose from 'mongoose';

export class UpdateTaskDto {
	taskId: mongoose.Types.ObjectId;
	name?: string;
	description?: string;
}

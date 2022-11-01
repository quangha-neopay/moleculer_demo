import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TaskStatus } from '../constants/task.status';

export type UserTaskManagementDocument = UserTaskManagement & Document;

@Schema({ timestamps: true })
export class UserTaskManagement {
	@Prop({ required: true })
	taskId: mongoose.Types.ObjectId;

	@Prop({ required: true })
	userId: mongoose.Types.ObjectId;

	@Prop({ enum: TaskStatus, default: TaskStatus.UNDONE })
	status: TaskStatus;
}

export const UserTaskManagementSchema =
	SchemaFactory.createForClass(UserTaskManagement);

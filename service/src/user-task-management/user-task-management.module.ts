import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
	UserTaskManagement,
	UserTaskManagementSchema,
} from './model/user-task-manament.model';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGODB_URL),
		MongooseModule.forFeature([
			{ name: UserTaskManagement.name, schema: UserTaskManagementSchema },
		]),
	],
	providers: [],
})
export class TaskManagerModule {}

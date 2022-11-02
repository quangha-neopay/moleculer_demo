import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
	UserTaskManagement,
	UserTaskManagementSchema,
} from './model/user-task-manament.model';
import { UserTaskManagementHandler } from './user-task-management.handler';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGODB_URL),
		MongooseModule.forFeature([
			{ name: UserTaskManagement.name, schema: UserTaskManagementSchema },
		]),
	],
	providers: [UserTaskManagementHandler],
})
export class UserTaskManagementModule {}

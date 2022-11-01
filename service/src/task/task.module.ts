import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './model/task.model';
import { TaskHandler } from './task.handler';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGODB_URL),
		MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
	],
	providers: [TaskHandler],
})
export class TaskModule {}

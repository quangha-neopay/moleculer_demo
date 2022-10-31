import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
import { UserHandler } from './user.handler';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGODB_URL),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	providers: [UserHandler],
})
export class UserModule {}

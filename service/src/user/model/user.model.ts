import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../constants/user-role';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true, unique: true })
	username: string;

	@Prop({ required: true })
	password: string;

	@Prop({ default: '' })
	fullName: string;

	@Prop({ default: Role.USER })
	role?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

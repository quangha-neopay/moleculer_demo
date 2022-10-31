import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true, unique: true })
	username: string;

	@Prop({ required: true })
	password: string;

	@Prop({ default: '' })
	fullName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

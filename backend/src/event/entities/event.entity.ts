import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IUser, User } from '@/user/entities/user.entity';

interface IEvent {
  name: string;
  description: string;
  location: string;
  date: Date;
  creator: Types.ObjectId;
  participants: Types.ObjectId[];
}

@Schema({ timestamps: true, autoCreate: true, collection: 'events' })
export class Event implements IEvent {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  creator: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: User.name, default: [] })
  participants: Types.ObjectId[];
}

export const EventSchema = SchemaFactory.createForClass(Event);

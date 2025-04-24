import mongoose, { Document } from 'mongoose';
import { IUser } from './User';

interface IEvent extends Document {
  name: string;
  description: string;
  location: string;
  date: Date;
  creator: IUser;
  participants: IUser[];
}

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Event = mongoose.model<IEvent>('Event', eventSchema);
export default Event;

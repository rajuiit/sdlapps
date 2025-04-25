import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';

import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

export type EventDocument = Event & Document;

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  private mapFlags(event: EventDocument, userId: string) {
    const obj = event.toObject();
    const creatorId =
      event.creator instanceof Types.ObjectId
        ? event.creator.toString()
        : (event.creator as any).id;
    const participantIds = (event.participants as Types.ObjectId[]).map((p) =>
      p.toString(),
    );
    return {
      ...obj,
      isEditable: creatorId === userId,
      isRegistered: creatorId === userId || participantIds.includes(userId),
    };
  }

  async findAll(userId: string) {
    const events = await this.eventModel
      .find()
      .populate('creator participants', 'name email')
      .exec();
    return events.map((evt) => this.mapFlags(evt, userId));
  }

  async create(createDto: CreateEventDto, userId: string) {
    const created = new this.eventModel({
      ...createDto,
      creator: new Types.ObjectId(userId),
    });
    await created.save();
    await created.populate('creator', 'name email');
    return {
      ...created.toObject(),
      isEditable: true,
      isRegistered: false,
    };
  }

  async update(id: string, updateDto: UpdateEventDto, userId: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    if (event.creator.toString() !== userId) {
      throw new ForbiddenException('Not authorised to update this event');
    }
    const updated = await this.eventModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('creator', 'name email');
    return this.mapFlags(updated!, userId);
  }

  async remove(id: string, userId: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    if (event.creator.toString() !== userId) {
      throw new ForbiddenException('Not authorised to delete this event');
    }
    await event.deleteOne();
    return { message: 'Event deleted' };
  }

  async register(id: string, userId: string) {
    const event = await this.eventModel
      .findById(id)
      .populate('creator participants', 'name email');
    if (!event) throw new NotFoundException('Event not found');

    const pid = userId;
    if (
      (event.participants as Types.ObjectId[])
        .map((p) => p.toString())
        .includes(pid)
    ) {
      throw new BadRequestException('Already registered');
    }

    event.participants.push(new Types.ObjectId(pid));
    await event.save();
    await event.populate('creator participants', 'name email');
    return this.mapFlags(event, userId);
  }

  async unregister(id: string, userId: string) {
    const event = await this.eventModel
      .findById(id)
      .populate('creator participants', 'name email');
    if (!event) throw new NotFoundException('Event not found');

    const pid = userId;
    if (
      !(event.participants as Types.ObjectId[])
        .map((p) => p.toString())
        .includes(pid)
    ) {
      throw new BadRequestException('Not registered');
    }

    event.participants = (event.participants as Types.ObjectId[]).filter(
      (p) => p.toString() !== pid,
    );
    await event.save();
    await event.populate('creator participants', 'name email');
    return this.mapFlags(event, userId);
  }
}

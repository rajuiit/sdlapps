import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import Event from '../models/Event';
import { Types } from 'mongoose';
import { User } from 'src/models/User';

// DTOs
interface CreateEventDto {
  name: string;
  description: string;
  location: string;
  date: string;
}

interface UpdateEventDto {
  name: string;
  description: string;
  location: string;
  date: string;
}

interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller('api/events')
export class EventController {
  @Get()
  async getEvents(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const events = await Event.find().populate(
        'creator participants',
        'name email',
      );
      return res.json(
        events.map((event) => ({
          ...event.toObject(),
          isEditable: event.creator.id === req.user.id.toString(),
          isRegistered:
            event.creator.id === req.user.id ||
            event.participants.some(
              (participant) => participant.id === req.user.id,
            ),
        })),
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching events',
        error: errorMessage,
      });
    }
  }

  @Post()
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      const id = new Types.ObjectId().toString();
      const event = await Event.create({
        id,
        ...createEventDto,
        creator: req.user.id,
      });
      const savedEvent = await event.populate('creator', 'name email');
      return res.status(HttpStatus.CREATED).json({
        ...savedEvent.toObject(),
        isEditable: true,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating event', error: errorMessage });
    }
  }

  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      const event = await Event.findById(id);
      if (!event) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Event not found' });
      }

      if (event.creator.id !== req.user.id) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: 'Not authorized to update this event' });
      }

      const updatedEvent = await Event.findByIdAndUpdate(id, updateEventDto, {
        new: true,
      }).populate('creator', 'name email');

      return res.json(updatedEvent);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating event',
        error: errorMessage,
      });
    }
  }

  @Delete(':id')
  async deleteEvent(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      const event = await Event.findById(id);
      if (!event) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Event not found' });
      }

      if (event.creator.id !== req.user.id) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: 'Not authorized to delete this event' });
      }

      await event.deleteOne();
      return res.json({ message: 'Event deleted' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error deleting event',
        error: errorMessage,
      });
    }
  }

  @Post('/register/:id')
  async register(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      const event = await Event.findById(id).populate(
        'creator participants',
        'name email',
      );
      if (!event) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Event not found' });
      }

      if (
        event.participants.some((participant) => participant.id === req.user.id)
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Already registered for this event' });
      }

      event.participants.push(new User(req.user.id));
      await event.save();

      const updatedEvent = await event.populate(
        'creator participants',
        'name email',
      );
      return res.json({
        ...updatedEvent.toObject(),
        isEditable: updatedEvent.creator.id === req.user.id,
        isRegistered: true,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error registering for event',
        error: errorMessage,
      });
    }
  }

  @Delete('/unregister/:id')
  async unregister(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      const event = await Event.findById(id).populate(
        'creator participants',
        'name email',
      );
      if (!event) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Event not found' });
      }

      if (
        !event.participants.some(
          (participant) => participant.id === req.user.id,
        )
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Not registered for this event' });
      }

      event.participants = event.participants.filter(
        (participant) => participant.id !== req.user.id,
      );
      await event.save();

      const updatedEvent = await event.populate(
        'creator participants',
        'name email',
      );
      return res.json({
        ...updatedEvent.toObject(),
        isEditable: updatedEvent.creator.id === req.user.id,
        isRegistered: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error unregistering from event',
        error: errorMessage,
      });
    }
  }
}

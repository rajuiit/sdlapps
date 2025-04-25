// src/events/events.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.eventsService.findAll(req.user.id);
  }

  @Post()
  create(@Body() dto: CreateEventDto, @Request() req: any) {
    return this.eventsService.create(dto, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Request() req: any,
  ) {
    return this.eventsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.remove(id, req.user.id);
  }

  @Post('register/:id')
  register(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.register(id, req.user.id);
  }

  @Delete('unregister/:id')
  unregister(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.unregister(id, req.user.id);
  }
}

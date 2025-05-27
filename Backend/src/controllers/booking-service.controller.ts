import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BookingServiceService } from '../services/booking-service.service';
import { CreateBookingServiceDto } from '../dto/booking-service.dto';
import { UpdateBookingServiceDto } from '../dto/booking-service.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('booking-services')
@UseGuards(JwtAuthGuard)
export class BookingServiceController {
    constructor(private readonly bookingServiceService: BookingServiceService) { }

    @Post()
    create(@Request() req, @Body() createBookingServiceDto: CreateBookingServiceDto) {
        return this.bookingServiceService.create(req.user.id, createBookingServiceDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.bookingServiceService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingServiceService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBookingServiceDto: UpdateBookingServiceDto) {
        return this.bookingServiceService.update(id, updateBookingServiceDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingServiceService.remove(id);
    }
} 
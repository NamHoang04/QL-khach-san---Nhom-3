import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FavoriteRoomService } from '../services/favorite-room.service';
import { CreateFavoriteRoomDto } from '../dto/favorite-room.dto';
import { UpdateFavoriteRoomDto } from '../dto/favorite-room.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('favorite-rooms')
@UseGuards(JwtAuthGuard)
export class FavoriteRoomController {
    constructor(private readonly favoriteRoomService: FavoriteRoomService) { }

    @Post()
    create(@Request() req, @Body() createFavoriteRoomDto: CreateFavoriteRoomDto) {
        return this.favoriteRoomService.create(req.user.id, createFavoriteRoomDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.favoriteRoomService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.favoriteRoomService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFavoriteRoomDto: UpdateFavoriteRoomDto) {
        return this.favoriteRoomService.update(id, updateFavoriteRoomDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.favoriteRoomService.remove(id);
    }
} 
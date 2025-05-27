import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FavoriteServiceService } from '../services/favorite-service.service';
import { CreateFavoriteServiceDto } from '../dto/favorite-service.dto';
import { UpdateFavoriteServiceDto } from '../dto/favorite-service.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('favorite-services')
@UseGuards(JwtAuthGuard)
export class FavoriteServiceController {
    constructor(private readonly favoriteServiceService: FavoriteServiceService) { }

    @Post()
    create(@Request() req, @Body() createFavoriteServiceDto: CreateFavoriteServiceDto) {
        return this.favoriteServiceService.create(req.user.id, createFavoriteServiceDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.favoriteServiceService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.favoriteServiceService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFavoriteServiceDto: UpdateFavoriteServiceDto) {
        return this.favoriteServiceService.update(id, updateFavoriteServiceDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.favoriteServiceService.remove(id);
    }
} 
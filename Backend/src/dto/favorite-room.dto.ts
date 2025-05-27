import { IsMongoId, IsOptional, IsBoolean } from 'class-validator';

export class CreateFavoriteRoomDto {
    @IsMongoId()
    room: string;
}

export class UpdateFavoriteRoomDto {
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
} 
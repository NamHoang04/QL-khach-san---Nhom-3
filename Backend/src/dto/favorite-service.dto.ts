import { IsMongoId, IsOptional, IsBoolean } from 'class-validator';

export class CreateFavoriteServiceDto {
    @IsMongoId()
    service: string;
}

export class UpdateFavoriteServiceDto {
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
} 
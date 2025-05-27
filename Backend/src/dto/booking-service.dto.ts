import { IsMongoId, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookingServiceDto {
    @IsMongoId()
    service: string;

    @IsMongoId()
    booking: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsString()
    note?: string;
}

export class UpdateBookingServiceDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    quantity?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    note?: string;
} 
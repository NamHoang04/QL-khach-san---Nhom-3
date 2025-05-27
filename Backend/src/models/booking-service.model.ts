import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.model';
import { Service } from './service.model';
import { Booking } from './booking.model';

@Schema({ timestamps: true })
export class BookingService extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Service', required: true })
    service: Service;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Booking', required: true })
    booking: Booking;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    price: number;

    @Prop({ default: 'pending' })
    status: string;

    @Prop()
    note: string;
}

export const BookingServiceSchema = SchemaFactory.createForClass(BookingService); 
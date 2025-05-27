import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.model';
import { Service } from './service.model';

@Schema({ timestamps: true })
export class FavoriteService extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Service', required: true })
    service: Service;

    @Prop({ default: true })
    isActive: boolean;
}

export const FavoriteServiceSchema = SchemaFactory.createForClass(FavoriteService); 
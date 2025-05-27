import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.model';
import { Room } from './room.model';

@Schema({ timestamps: true })
export class FavoriteRoom extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room', required: true })
    room: Room;

    @Prop({ default: true })
    isActive: boolean;
}

export const FavoriteRoomSchema = SchemaFactory.createForClass(FavoriteRoom); 
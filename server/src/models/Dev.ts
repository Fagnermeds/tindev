import { Schema, Document, model } from 'mongoose';

export interface IDevSchema extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  user: string;
  bio: string;
  avatar: string;
  likes: Schema.Types.ObjectId[];
  dislikes: Schema.Types.ObjectId[];
  talks: Schema.Types.ObjectId[];
}

const DevSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    bio: String,
    avatar: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Dev',
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Dev',
      },
    ],
    talks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Talk',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default model<IDevSchema>('Dev', DevSchema);

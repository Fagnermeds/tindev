import { Schema, Document, model } from 'mongoose';

interface IMessageSchema extends Document {
  content: string;
  author: {
    type: Schema.Types.ObjectId;
  };
  talk_id: Schema.Types.ObjectId;
  createdAt?: string;
}

const MessageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Dev',
    },
    talk_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Talk',
    },
  },
  {
    timestamps: true,
  },
);

export default model<IMessageSchema>('Message', MessageSchema);

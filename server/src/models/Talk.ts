import { Schema, Document, model } from 'mongoose';

export interface ITalkSchema extends Document {
  users: [{ _id: Schema.Types.ObjectId }];
  last_msg?: Schema.Types.ObjectId;
}

const TalkSchema = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Dev',
        required: true,
      },
    ],
    last_msg: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ITalkSchema>('Talk', TalkSchema);

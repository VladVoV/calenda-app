import { Schema, model, Document, Types } from 'mongoose';

export interface ITask extends Document {
  _id: Types.ObjectId;
  text: string;
  color: string;
  dateKey: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    color: {
      type: String,
      default: '#0052cc',
      match: /^#[0-9a-fA-F]{6}$/,
    },
    dateKey: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TaskSchema.index({ dateKey: 1, order: 1 });

export const Task = model<ITask>('Task', TaskSchema);

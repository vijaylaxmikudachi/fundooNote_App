import mongoose, { Schema, model } from 'mongoose';
import { INote } from '../interfaces/note.interface';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    color: {
      type: String
    },
    isArchive: {
      type: Boolean,
      default: false,
      index: true
    },
    isTrash: {
      type: Boolean,
      default: false,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    expiresAt:{
      type:Date,
      default:():Date => new Date(Date.now()+7 * 24 * 60 * 60 * 1000),
    }
  },
  {
    timestamps: true
  }
);
noteSchema.index({expireAt:1},{ expireAfterSeconds: 0})

export default model<INote>('Note', noteSchema);

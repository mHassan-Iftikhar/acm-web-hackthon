import mongoose, { Schema, Document } from 'mongoose';

export type CompetitionStatus = 'draft' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed' | 'cancelled';

export interface ICompetition extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: mongoose.Types.ObjectId;
  shortDescription: string;
  bannerUrl?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  maxParticipants: number;
  registeredCount: number;
  entryFee: number;
  venue: string;
  organizer: mongoose.Types.ObjectId;
  status: CompetitionStatus;
  rules?: string;
  prizes?: string;
  coordinators: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const competitionSchema = new Schema<ICompetition>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a competition title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide a short description'],
      trim: true,
      maxlength: [200, 'Short description cannot be more than 200 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please specify a category'],
    },
    bannerUrl: {
      type: String,
      default: null,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide end date'],
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Please provide registration deadline'],
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Please provide maximum participants'],
      min: [1, 'Max participants must be at least 1'],
      default: 100,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    entryFee: {
      type: Number,
      default: 0,
      min: [0, 'Entry fee cannot be negative'],
    },
    venue: {
      type: String,
      required: [true, 'Please provide venue information'],
      trim: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'registration_open', 'registration_closed', 'ongoing', 'completed', 'cancelled'],
      default: 'draft',
    },
    rules: {
      type: String,
      trim: true,
      default: null,
    },
    prizes: {
      type: String,
      trim: true,
      default: null,
    },
    coordinators: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICompetition>('Competition', competitionSchema);

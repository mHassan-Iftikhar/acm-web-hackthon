import mongoose, { Schema, Document } from 'mongoose';

export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export interface IRegistration extends Document {
  _id: mongoose.Types.ObjectId;
  competition: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  teamName?: string;
  memberNames: string[];
  registrationNumber: string;
  status: RegistrationStatus;
  approvedBy?: mongoose.Types.ObjectId;
  approvalDate?: Date;
  rejectionReason?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    competition: {
      type: Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    teamName: {
      type: String,
      trim: true,
      default: null,
    },
    memberNames: {
      type: [String],
      required: [true, 'Please provide at least one member name'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one member is required',
      },
    },
    registrationNumber: {
      type: String,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'withdrawn'],
      default: 'pending',
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvalDate: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate registration number
registrationSchema.pre('save', async function (next) {
  if (!this.registrationNumber) {
    const count = await mongoose.model<IRegistration>('Registration').countDocuments();
    this.registrationNumber = `REG${Date.now()}${count + 1}`;
  }
  next();
});

export default mongoose.model<IRegistration>('Registration', registrationSchema);

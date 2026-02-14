import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a category description'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    icon: {
      type: String,
      default: '📚',
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICategory>('Category', categorySchema);

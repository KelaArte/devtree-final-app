import mongoose, { Schema, Document } from 'mongoose'

export interface IVisit extends Document {
  user: mongoose.Types.ObjectId // referencia a User
  ip?: string
  userAgent?: string
  createdAt: Date
}

const visitSchema = new Schema<IVisit>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ip: { type: String },
  userAgent: { type: String }
}, { timestamps: { createdAt: true, updatedAt: false } })

export default mongoose.model<IVisit>('Visit', visitSchema)
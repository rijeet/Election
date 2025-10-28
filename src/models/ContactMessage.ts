import mongoose, { Schema, Model, models } from 'mongoose';

export interface IContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
  service: string;
  createdAt?: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: false, trim: true },
  message: { type: String, required: true, trim: true },
  service: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const ContactMessage: Model<IContactMessage> =
  (models.ContactMessage as Model<IContactMessage>) ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);

export default ContactMessage;




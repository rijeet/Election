import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
  verification_tokens?: {
    token: string;
    expires_at: Date;
    used: boolean;
  }[];
  login_attempts?: {
    ip_address: string;
    user_agent: string;
    success: boolean;
    timestamp: Date;
  }[];
}

const AdminSchema = new Schema<IAdmin>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  permissions: [{
    type: String,
    enum: [
      'manage_elections',
      'manage_candidates',
      'manage_constituencies',
      'manage_newsfeed',
      'view_analytics',
      'manage_users',
      'system_settings'
    ]
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  last_login: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  verification_tokens: [{
    token: String,
    expires_at: Date,
    used: {
      type: Boolean,
      default: false
    }
  }],
  login_attempts: [{
    ip_address: String,
    user_agent: String,
    success: Boolean,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  collection: 'admins',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Prevent model recompilation
if (mongoose.models.Admin) {
  delete mongoose.models.Admin;
}

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

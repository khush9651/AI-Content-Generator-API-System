const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    tone: {
      type: String,
      enum: ['professional', 'casual', 'technical'],
      default: 'professional',
    },
    blog: {
      type: String,
      required: true,
    },
    linkedin_post: {
      type: String,
      required: true,
    },
    summary: {
      type: [String],
      required: true,
    },
    generated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster history queries
contentSchema.index({ generated_at: -1 });

module.exports = mongoose.model('Content', contentSchema);

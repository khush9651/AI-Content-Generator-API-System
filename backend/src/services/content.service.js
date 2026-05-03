const groqService = require('./groq.service');
const Content = require('../models/Content');
const mongoose = require('mongoose');

const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * Generate content and optionally persist to MongoDB
 */
const generateContent = async (topic, tone) => {
  const result = await groqService.generateContent(topic, tone);

  // Save to MongoDB if connected
  if (isMongoConnected()) {
    try {
      const doc = new Content({
        topic: result.topic,
        tone: result.tone,
        blog: result.blog,
        linkedin_post: result.linkedin_post,
        summary: result.summary,
        generated_at: result.generated_at,
      });
      await doc.save();
      result._id = doc._id.toString();
    } catch (err) {
      console.warn('⚠️  Failed to save to MongoDB:', err.message);
    }
  }

  return result;
};

/**
 * Fetch history from MongoDB (or empty array if not connected)
 */
const getHistory = async () => {
  if (!isMongoConnected()) return [];
  return await Content.find().sort({ generated_at: -1 }).limit(50).lean();
};

/**
 * Delete a history item by ID
 */
const deleteHistoryItem = async (id) => {
  if (!isMongoConnected()) return;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Object.assign(new Error('Invalid ID'), { status: 400 });
  }
  const result = await Content.findByIdAndDelete(id);
  if (!result) throw Object.assign(new Error('Item not found'), { status: 404 });
};

module.exports = { generateContent, getHistory, deleteHistoryItem };

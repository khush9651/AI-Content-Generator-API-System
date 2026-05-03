const contentService = require('../services/content.service');
const { validateTopic } = require('../utils/validator');

/**
 * POST /api/content/generate
 * Body: { topic: string, tone?: 'professional' | 'casual' | 'technical' }
 */
const generate = async (req, res, next) => {
  try {
    const { topic, tone = 'professional' } = req.body;

    // Validate input
    const validationError = validateTopic(topic);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const validTones = ['professional', 'casual', 'technical'];
    const selectedTone = validTones.includes(tone) ? tone : 'professional';

    const result = await contentService.generateContent(topic.trim(), selectedTone);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/content/history
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await contentService.getHistory();
    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/content/history/:id
 */
const deleteHistoryItem = async (req, res, next) => {
  try {
    await contentService.deleteHistoryItem(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'History item deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generate, getHistory, deleteHistoryItem };

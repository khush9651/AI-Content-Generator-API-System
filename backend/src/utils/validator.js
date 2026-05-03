/**
 * Validates the topic input field.
 * Returns an error string or null if valid.
 */
const validateTopic = (topic) => {
  if (!topic) return 'Topic is required.';
  if (typeof topic !== 'string') return 'Topic must be a string.';

  const trimmed = topic.trim();
  if (trimmed.length < 3) return 'Topic must be at least 3 characters long.';
  if (trimmed.length > 500) return 'Topic must not exceed 500 characters.';

  // Block suspiciously empty or whitespace-only input
  if (!/\S/.test(trimmed)) return 'Topic cannot be blank.';

  return null;
};

module.exports = { validateTopic };

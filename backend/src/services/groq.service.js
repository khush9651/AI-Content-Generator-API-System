// ─── Groq API Service ─────────────────────────────────────────────────────────
// Uses Groq's OpenAI-compatible REST endpoint (no extra SDK needed — native fetch).
// Model: llama-3.1-8b-instant
// Docs:  https://console.groq.com/docs/openai
// ─────────────────────────────────────────────────────────────────────────────

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

// ─── API usage logger ─────────────────────────────────────────────────────────
let _usageStats = { requests: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0 };

const logUsage = (usage, topic) => {
  if (!usage) return;
  _usageStats.requests       += 1;
  _usageStats.promptTokens   += usage.prompt_tokens     || 0;
  _usageStats.completionTokens += usage.completion_tokens || 0;
  _usageStats.totalTokens    += usage.total_tokens       || 0;

  console.log(
    `[Groq] ✅ "${topic}" | ` +
    `prompt=${usage.prompt_tokens} completion=${usage.completion_tokens} ` +
    `total=${usage.total_tokens} | ` +
    `cumulative_requests=${_usageStats.requests} cumulative_tokens=${_usageStats.totalTokens}`
  );
};

// Export so /api/status can include it
const getUsageStats = () => ({ ..._usageStats });

// ─── Key validation helper ────────────────────────────────────────────────────
const getApiKey = () => {
  const key = process.env.GROQ_API_KEY;
  if (!key || key.trim() === '' || key.startsWith('your_')) {
    throw Object.assign(
      new Error(
        'Groq API key is missing or still a placeholder. ' +
        'Add a valid GROQ_API_KEY to backend/.env and restart.'
      ),
      { status: 503, isConfigError: true }
    );
  }
  return key.trim();
};

// ─── Tone descriptions ────────────────────────────────────────────────────────
const TONE_DESCRIPTIONS = {
  professional: 'formal, authoritative, and business-oriented',
  casual:       'friendly, conversational, and approachable',
  technical:    'detailed, precise, and technical with industry terminology',
};

// ─── Main generation function ─────────────────────────────────────────────────
/**
 * Generate blog, LinkedIn post, and key summary for a given topic + tone.
 * @param {string} topic
 * @param {'professional'|'casual'|'technical'} tone
 * @returns {Promise<Object>} { topic, tone, blog, linkedin_post, summary, generated_at }
 */
const generateContent = async (topic, tone = 'professional') => {
  const apiKey   = getApiKey();
  const toneDesc = TONE_DESCRIPTIONS[tone] || TONE_DESCRIPTIONS.professional;

  const systemMessage = {
    role: 'system',
    content:
      'You are an expert content strategist. ' +
      'Always respond with ONLY a valid raw JSON object — no markdown fences, no backticks, no prose before or after.',
  };

  const userMessage = {
    role: 'user',
    content: `Generate content about: "${topic}"
Tone: ${toneDesc}

Return ONLY a JSON object with exactly these fields:
{
  "blog": "A full blog article 700-1000 words using markdown ## headings, bold text, intro, 3-4 sections, and a conclusion.",
  "linkedin_post": "An engaging LinkedIn post under 200 words. Hook on first line, 3-4 short paragraphs, call-to-action at end.",
  "summary": ["key insight 1", "key insight 2", "key insight 3", "key insight 4", "key insight 5"]
}`,
  };

  console.log(`[Groq] Generating content for topic: "${topic}" | tone: ${tone} | model: ${GROQ_MODEL}`);

  // ─── API call ───────────────────────────────────────────────────────────────
  let response;
  try {
    response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        messages:    [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens:  3000,
      }),
    });
  } catch (networkErr) {
    console.error('[Groq] Network error:', networkErr.message);
    throw Object.assign(
      new Error('Could not reach the Groq API. Check your internet connection.'),
      { status: 503 }
    );
  }

  // ─── HTTP-level error handling ──────────────────────────────────────────────
  if (!response.ok) {
    let errBody = {};
    try { errBody = await response.json(); } catch (_) { /* ignore */ }

    const errMsg = errBody?.error?.message || response.statusText || 'Unknown error';
    console.error(`[Groq] HTTP ${response.status}: ${errMsg}`);

    if (response.status === 401) {
      throw Object.assign(
        new Error('Your Groq API key is invalid or revoked. Update GROQ_API_KEY in backend/.env.'),
        { status: 401 }
      );
    }
    if (response.status === 429) {
      throw Object.assign(
        new Error('Groq rate limit exceeded. Please wait a moment and try again.'),
        { status: 429 }
      );
    }
    if (response.status === 400) {
      throw Object.assign(
        new Error(`Bad request to Groq API: ${errMsg}`),
        { status: 400 }
      );
    }
    if (response.status >= 500) {
      throw Object.assign(
        new Error('Groq service is temporarily unavailable. Please try again shortly.'),
        { status: 503 }
      );
    }
    throw Object.assign(new Error(`Groq API error (${response.status}): ${errMsg}`), { status: response.status });
  }

  // ─── Parse JSON body ────────────────────────────────────────────────────────
  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    console.warn('[Groq] JSON parse failed — using fallback mode');
  
    // ✅ Fallback: treat response as plain text
    return {
      topic,
      tone,
      blog: cleaned,
      linkedin_post: cleaned.slice(0, 200),
      summary: cleaned
        .split('\n')
        .filter(line => line.trim() !== '')
        .slice(0, 5),
      generated_at: new Date().toISOString(),
      model: GROQ_MODEL,
      fallback: true,
    };
  }

  // Log usage metrics
  logUsage(body.usage, topic);

  const rawText = body?.choices?.[0]?.message?.content;
  if (!rawText || rawText.trim() === '') {
    console.error('[Groq] Empty content in response:', JSON.stringify(body));
    throw new Error('Groq returned an empty response. Please try again.');
  }

  console.log('[Groq] Raw response length:', rawText.length);

  // ─── Strip stray markdown fences (model sometimes ignores instructions) ─────
  let cleaned = rawText.trim();
  cleaned = cleaned
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/g, '')
    .trim();

  // ─── JSON parse ─────────────────────────────────────────────────────────────
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseErr) {
    console.error('[Groq] JSON parse failed. First 500 chars:', cleaned.slice(0, 500));
    throw new Error('AI returned an unexpected format. Please try again.');
  }

  // ─── Field validation ────────────────────────────────────────────────────────
  if (!parsed.blog || !parsed.linkedin_post || !Array.isArray(parsed.summary)) {
    console.error('[Groq] Missing fields. Keys present:', Object.keys(parsed));
    throw new Error('AI response was incomplete. Please try again.');
  }

  console.log('[Groq] Content generated successfully.');

  return {
    topic,
    tone,
    blog:          parsed.blog,
    linkedin_post: parsed.linkedin_post,
    summary:       parsed.summary.slice(0, 5),
    generated_at:  new Date().toISOString(),
    model:         GROQ_MODEL,
  };
};

module.exports = { generateContent, getUsageStats };

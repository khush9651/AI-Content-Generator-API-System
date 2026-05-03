/**
 * Quick smoke-test for the Groq API integration.
 * Run: node test-groq.js
 */
require('dotenv').config();

async function testGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  const model  = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

  console.log('GROQ_API_KEY length:', apiKey?.length, '| Starts:', apiKey?.slice(0, 8));
  console.log('Model:', model);

  if (!apiKey || apiKey.startsWith('your_')) {
    console.error('❌ GROQ_API_KEY not set. Add it to backend/.env and retry.');
    process.exit(1);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
        max_tokens: 50,
      }),
    });

    const body = await response.json();

    if (!response.ok) {
      console.error('❌ HTTP', response.status, body?.error?.message);
      process.exit(1);
    }

    const text = body?.choices?.[0]?.message?.content;
    console.log('✅ SUCCESS:', text);
    console.log('📊 Usage:', body.usage);
  } catch (err) {
    console.error('❌ Network error:', err.message);
    process.exit(1);
  }
}

testGroq();

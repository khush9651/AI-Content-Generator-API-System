import { useState, useCallback } from 'react';
import { contentApi } from '../services/api';

const useContentGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);
  const [result, setResult]       = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const generate = useCallback(async (topic, tone) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(1);

    // Simulate step progression for UX
    const t1 = setTimeout(() => setLoadingStep(2), 2500);
    const t2 = setTimeout(() => setLoadingStep(3), 6000);

    try {
      // axios interceptor returns response.data (the full body: { success, data })
      const body = await contentApi.generate(topic, tone);
      // body = { success: true, data: { topic, tone, blog, linkedin_post, summary, … } }
      if (!body?.data) throw new Error('Unexpected response format from server.');
      setResult(body.data);
    } catch (err) {
      // Friendly fallback message if err.message is empty
      const msg = err?.message?.trim() ||
        'Content generation failed. Please check your API key and try again.';
      setError(msg);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsLoading(false);
      setLoadingStep(0);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { isLoading, error, result, loadingStep, generate, clearResult };
};

export default useContentGenerator;

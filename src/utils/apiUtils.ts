import { supabase } from "@/lib/supabase";

export const checkRateLimit = async (
  userId: string,
  actionType: string,
  maxRequests: number = 100,
  windowMinutes: number = 15
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('voucher_rate_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('action_type', actionType)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Rate limit check error:', error);
    return true; // Allow operation on error to prevent blocking legitimate requests
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - (windowMinutes * 60 * 1000));

  if (!data || new Date(data.window_start) < windowStart) {
    // Reset or create new rate limit window
    await supabase
      .from('voucher_rate_limits')
      .upsert({
        user_id: userId,
        action_type: actionType,
        request_count: 1,
        window_start: now.toISOString()
      });
    return true;
  }

  if (data.request_count >= maxRequests) {
    return false;
  }

  // Increment request count
  await supabase
    .from('voucher_rate_limits')
    .update({ request_count: data.request_count + 1 })
    .eq('user_id', userId)
    .eq('action_type', actionType);

  return true;
};

export const withRetry = async <T,>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
};
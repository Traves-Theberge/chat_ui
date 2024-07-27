export const apiRequest = async (url, method, body) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(body),
      });
      return response.json();
    } catch (error) {
      console.error('API request error:', error);
      return { error: 'An error occurred. Please try again.' };
    }
  };
  
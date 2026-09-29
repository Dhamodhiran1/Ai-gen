/**
 * Robust API Client for EduGenie
 * Protects against non-JSON (HTML 404/503) responses, handles route fallbacks,
 * and guarantees clean user-facing error messages.
 */

export async function safePost<T = any>(endpoint: string, payload: any): Promise<T> {
  const endpointsToTry = [
    endpoint,
    endpoint.startsWith('/api') ? endpoint.replace('/api', '') : `/api${endpoint}`,
  ];

  let lastError: Error | null = null;

  for (const url of endpointsToTry) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      const rawText = await res.text();

      // Check if response is HTML (e.g. <!doctype html> from SPA fallback)
      if (rawText.trim().startsWith('<') || (!contentType.includes('application/json') && rawText.includes('<!doctype'))) {
        throw new Error(`API endpoint ${url} returned HTML instead of JSON (${res.status})`);
      }

      let parsed: any;
      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        throw new Error(`Invalid JSON received from ${url}`);
      }

      if (!res.ok || parsed.error) {
        throw new Error(parsed?.error || `Request to ${url} failed with status ${res.status}`);
      }

      return parsed as T;
    } catch (err: any) {
      lastError = err;
      // Continue to next endpoint alternative if HTML was returned
      if (err.message && err.message.includes('returned HTML')) {
        continue;
      }
      // If it's a genuine API error message from backend, rethrow it
      throw err;
    }
  }

  throw lastError || new Error(`Failed to communicate with ${endpoint}. Please try again.`);
}

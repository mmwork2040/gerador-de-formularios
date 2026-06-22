export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, apikey, Prefer'
  );

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, method = 'POST', headers = {}, body } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // For Google Apps Script URLs, use a GET with query params approach
  // because Apps Script Web Apps redirect POST requests
  const isAppsScript = url.includes('script.google.com');

  try {
    let finalResponse;

    if (isAppsScript) {
      // Google Apps Script Web Apps: first attempt with POST following redirects manually
      // Apps Script redirects to a final URL — we need to follow it
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        redirect: 'follow', // Follow redirects automatically
        body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined
      };

      finalResponse = await fetch(url, fetchOptions);

      // If we got a redirect response (shouldn't happen with redirect:follow, but just in case)
      if (finalResponse.status === 302 || finalResponse.status === 301) {
        const location = finalResponse.headers.get('location');
        if (location) {
          finalResponse = await fetch(location, fetchOptions);
        }
      }
    } else {
      // Standard proxy for webhooks and other endpoints
      const fetchOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        redirect: 'follow'
      };

      if (body) {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      finalResponse = await fetch(url, fetchOptions);
    }

    const contentType = finalResponse.headers.get('content-type');

    let responseData;
    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = await finalResponse.json();
        return res.status(finalResponse.status).json(responseData);
      } catch (e) {
        responseData = await finalResponse.text();
        return res.status(finalResponse.status).send(responseData);
      }
    } else {
      responseData = await finalResponse.text();
      // Consider HTML responses from Apps Script as success if status is 200
      const status = finalResponse.status >= 200 && finalResponse.status < 400 ? 200 : finalResponse.status;
      return res.status(status).send(responseData);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

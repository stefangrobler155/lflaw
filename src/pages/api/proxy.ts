import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST, GET, PUT, DELETE methods
  if (!['POST', 'GET', 'PUT', 'DELETE'].includes(req.method || '')) {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract the target URL from the query parameters
    const { url } = req.query;
    
    if (!url || Array.isArray(url)) {
      return res.status(400).json({ message: 'URL parameter is required and must be a string' });
    }

    // Decode the URL if it's encoded
    const targetUrl = decodeURIComponent(url);
    
    console.log(`Proxy: Forwarding ${req.method} request to ${targetUrl}`);
    
    // Prepare headers to forward
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Forward all CoCart related headers
    Object.keys(req.headers).forEach(key => {
      if (key.toLowerCase().includes('cocart') || key.toLowerCase().includes('cart-key')) {
        headers[key] = req.headers[key] as string;
      }
    });
    
    console.log('Proxy: Forwarding headers:', headers);
    
    // Forward the request to the target URL
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      // Include credentials for cookie persistence
      credentials: 'include',
      // Forward the request body for POST, PUT methods
      ...(req.method !== 'GET' && { body: JSON.stringify(req.body) }),
    });
    
    // Log response status and headers
    console.log(`Proxy: Received response with status ${response.status}`);
    console.log('Proxy: Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Get the response data
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Proxy: Response data:', data);
    } else {
      data = await response.text();
      console.log('Proxy: Response is not JSON, received text of length:', data.length);
      // Try to parse as JSON anyway in case the content-type is wrong
      try {
        data = JSON.parse(data);
        console.log('Proxy: Successfully parsed text as JSON:', data);
      } catch (e) {
        console.log('Proxy: Could not parse response as JSON');
      }
    }
    
    // Forward all headers from the response
    response.headers.forEach((value, key) => {
      // Skip headers that can't be set by user code
      if (!['content-length', 'connection', 'content-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });
    
    // Explicitly check for and forward the cart key header
    // Check both possible header names
    const cartKey = response.headers.get('x-cocart-cart-key') || response.headers.get('cocart-api-cart-key');
    if (cartKey) {
      console.log('Proxy: Forwarding cart key header:', cartKey);
      // Set both header formats to ensure compatibility
      res.setHeader('x-cocart-cart-key', cartKey);
      res.setHeader('cocart-api-cart-key', cartKey);
    }
    
    // Return the response
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}
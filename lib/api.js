
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : '');

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers['Content-Type']
  ) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}/api${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';

  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `Request failed (${response.status})`
    );
  }

  return data;
}

export function money(v) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(v || 0));
}

export function dateLabel(value) {
  return new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString(
    'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );
}

export const categories = [
  'Photo Studio',
  'Film Stage',
  'Podcast Lounge',
  'Music Suite',
  'Art Workshop',
];

export const placeholder =
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&q=80';

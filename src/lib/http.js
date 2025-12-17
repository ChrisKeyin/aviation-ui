export async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const msg =
      typeof data === "string"
        ? data
        : (data && (data.message || data.error)) || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

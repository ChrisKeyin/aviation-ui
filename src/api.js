const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      typeof data === "string"
        ? data
        : (data && (data.message || data.error)) || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}

export const api = {
  getAirports: () => request("/api/airports"),
  getFlights: () => request("/api/flights"),

  getArrivals: (airport) => request(`/api/flights/search/arrivals?airport=${encodeURIComponent(airport)}`),
  getDepartures: (airport) => request(`/api/flights/search/departures?airport=${encodeURIComponent(airport)}`),

  createFlight: (payload) =>
    request("/api/flights", { method: "POST", body: JSON.stringify(payload) }),
};

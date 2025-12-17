import { useEffect, useState } from "react";
import { API_BASE } from "../lib/config";
import { fetchJson } from "../lib/http";
import { formatDateTime, normalizeForInput } from "../lib/dates";

export default function AdminFlights() {
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [gates, setGates] = useState([]);

  const [loadingRefs, setLoadingRefs] = useState(false);

  const [flightNumber, setFlightNumber] = useState("");
  const [status, setStatus] = useState("ON_TIME");
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [scheduledDeparture, setScheduledDeparture] = useState("");
  const [scheduledArrival, setScheduledArrival] = useState("");
  const [airlineId, setAirlineId] = useState("");
  const [gateId, setGateId] = useState("");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [creating, setCreating] = useState(false);

  const [flights, setFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({
    flightNumber: "",
    status: "ON_TIME",
    departureAirport: "",
    arrivalAirport: "",
    scheduledDeparture: "",
    scheduledArrival: "",
    airlineId: "",
    gateId: "",
  });
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    async function loadRefs() {
      try {
        setErr("");
        setMsg("");
        setLoadingRefs(true);

        const [airportsData, airlinesData, gatesData] = await Promise.all([
          fetchJson(`${API_BASE}/api/airports`),
          fetchJson(`${API_BASE}/api/airlines`),
          fetchJson(`${API_BASE}/api/gates`),
        ]);

        setAirports(Array.isArray(airportsData) ? airportsData : []);
        setAirlines(Array.isArray(airlinesData) ? airlinesData : []);
        setGates(Array.isArray(gatesData) ? gatesData : []);

        const firstAirportCode = Array.isArray(airportsData) && airportsData[0] ? airportsData[0].code : "";
        setDepartureAirport((p) => p || firstAirportCode);
        setArrivalAirport((p) => p || firstAirportCode);

        const firstAirlineId = Array.isArray(airlinesData) && airlinesData[0] ? String(airlinesData[0].id) : "";
        const firstGateId = Array.isArray(gatesData) && gatesData[0] ? String(gatesData[0].id) : "";
        setAirlineId((p) => p || firstAirlineId);
        setGateId((p) => p || firstGateId);
      } catch (e) {
        setErr(e.message || "Failed loading admin reference data");
      } finally {
        setLoadingRefs(false);
      }
    }

    loadRefs();
  }, []);

  useEffect(() => {
    refreshFlights();
  }, []);

  async function refreshFlights() {
    try {
      setErr("");
      setLoadingFlights(true);
      const data = await fetchJson(`${API_BASE}/api/flights`);
      setFlights(Array.isArray(data) ? data : []);
      setMsg("Refreshed flights list");
    } catch (e) {
      setErr(e.message || "Failed loading flights");
      setFlights([]);
    } finally {
      setLoadingFlights(false);
    }
  }

  async function createFlight(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    const payload = {
      flightNumber: flightNumber.trim(),
      status,
      departureAirport,
      arrivalAirport,
      scheduledDeparture,
      scheduledArrival,
      airlineId: Number(airlineId),
      gateId: Number(gateId),
    };

    try {
      setCreating(true);
      const data = await fetchJson(`${API_BASE}/api/flights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setMsg(`Flight created (id: ${data?.id ?? "unknown"})`);
      setFlights((prev) => [data, ...prev]);
      setFlightNumber("");
    } catch (e2) {
      setErr(e2.message || "Failed to create flight");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(f) {
    setMsg("");
    setErr("");
    setEditingId(f.id);

    setEdit({
      flightNumber: f.flightNumber ?? "",
      status: f.status ?? "ON_TIME",
      departureAirport: f.departureAirport ?? "",
      arrivalAirport: f.arrivalAirport ?? "",
      scheduledDeparture: normalizeForInput(f.scheduledDeparture),
      scheduledArrival: normalizeForInput(f.scheduledArrival),
      airlineId: String(f.airline?.id ?? airlineId ?? ""),
      gateId: String(f.gate?.id ?? gateId ?? ""),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setSavingId(null);
    setEdit({
      flightNumber: "",
      status: "ON_TIME",
      departureAirport: "",
      arrivalAirport: "",
      scheduledDeparture: "",
      scheduledArrival: "",
      airlineId: "",
      gateId: "",
    });
  }

  async function saveEdit(id) {
    setMsg("");
    setErr("");

    const payload = {
      flightNumber: edit.flightNumber.trim(),
      status: edit.status,
      departureAirport: edit.departureAirport,
      arrivalAirport: edit.arrivalAirport,
      scheduledDeparture: edit.scheduledDeparture,
      scheduledArrival: edit.scheduledArrival,
      airlineId: Number(edit.airlineId),
      gateId: Number(edit.gateId),
    };

    try {
      setSavingId(id);

      const data = await fetchJson(`${API_BASE}/api/flights/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setFlights((prev) => prev.map((f) => (f.id === id ? data : f)));
      setMsg(`Updated flight id ${id}`);
      cancelEdit();
    } catch (e) {
      setErr(e.message || "Failed to update flight");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteFlight(id) {
    if (!confirm(`Delete flight id ${id}?`)) return;

    try {
      setErr("");
      setMsg("");
      setDeletingId(id);

      await fetchJson(`${API_BASE}/api/flights/${id}`, { method: "DELETE" });

      setFlights((prev) => prev.filter((f) => f.id !== id));
      if (editingId === id) cancelEdit();
      setMsg(`🗑Deleted flight id ${id}`);
    } catch (e) {
      setErr(e.message || "Failed to delete flight");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <h2 style={{ marginTop: 0 }}>Admin</h2>

      {msg && <div style={{ padding: 12, border: "1px solid #0a0", marginBottom: 12 }}>{msg}</div>}
      {err && (
        <div style={{ padding: 12, border: "1px solid #f00", marginBottom: 12 }}>
          <b>Error:</b> {err}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 24 }}>
        <div style={card}>
          <h3 style={{ marginTop: 0 }}>Create Flight</h3>
          {loadingRefs && <p>Loading airports/airlines/gates…</p>}

          <form onSubmit={createFlight} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
            <label>
              Flight Number
              <input value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} required />
            </label>

            <label>
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="ON_TIME">ON_TIME</option>
                <option value="DELAYED">DELAYED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="BOARDING">BOARDING</option>
              </select>
            </label>

            <label>
              Departure Airport
              <select value={departureAirport} onChange={(e) => setDepartureAirport(e.target.value)} required>
                <option value="">-- choose --</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.code}>
                    {a.code} — {a.city}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Arrival Airport
              <select value={arrivalAirport} onChange={(e) => setArrivalAirport(e.target.value)} required>
                <option value="">-- choose --</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.code}>
                    {a.code} — {a.city}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Scheduled Departure (ISO)
              <input value={scheduledDeparture} onChange={(e) => setScheduledDeparture(e.target.value)} required />
            </label>

            <label>
              Scheduled Arrival (ISO)
              <input value={scheduledArrival} onChange={(e) => setScheduledArrival(e.target.value)} required />
            </label>

            <label>
              Airline
              <select value={airlineId} onChange={(e) => setAirlineId(e.target.value)} required>
                <option value="">-- choose --</option>
                {airlines.map((al) => (
                  <option key={al.id} value={al.id}>
                    {al.name || al.code || `Airline ${al.id}`} (id: {al.id})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Gate
              <select value={gateId} onChange={(e) => setGateId(e.target.value)} required>
                <option value="">-- choose --</option>
                {gates.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.gateCode} — {g.terminal} (id: {g.id})
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" disabled={creating || loadingRefs}>
              {creating ? "Creating…" : "Create Flight"}
            </button>
          </form>
        </div>

        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 0 }}>Manage Flights</h3>
            <button onClick={refreshFlights} disabled={loadingFlights}>
              Refresh
            </button>
          </div>

          {loadingFlights && <p>Loading flights…</p>}
          {!loadingFlights && flights.length === 0 && <p>No flights yet.</p>}

          {!loadingFlights && flights.length > 0 && (
            <table style={{ borderCollapse: "collapse", width: "100%", marginTop: 12 }}>
              <thead>
                <tr>
                  <th style={th}>ID</th>
                  <th style={th}>Flight</th>
                  <th style={th}>From</th>
                  <th style={th}>To</th>
                  <th style={th}>Departure</th>
                  <th style={th}>Arrival</th>
                  <th style={th}>Status</th>
                  <th style={th}>Airline</th>
                  <th style={th}>Gate</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((f) => {
                  const isEditing = editingId === f.id;

                  return (
                    <tr key={f.id}>
                      <td style={td}>{f.id}</td>

                      <td style={td}>
                        {isEditing ? (
                          <input
                            value={edit.flightNumber}
                            onChange={(e) => setEdit((p) => ({ ...p, flightNumber: e.target.value }))}
                          />
                        ) : (
                          <b>{f.flightNumber}</b>
                        )}
                      </td>

                      <td style={td}>
                        {isEditing ? (
                          <select
                            value={edit.departureAirport}
                            onChange={(e) => setEdit((p) => ({ ...p, departureAirport: e.target.value }))}
                          >
                            <option value="">-- choose --</option>
                            {airports.map((a) => (
                              <option key={a.id} value={a.code}>
                                {a.code}
                              </option>
                            ))}
                          </select>
                        ) : (
                          f.departureAirport
                        )}
                      </td>

                      <td style={td}>
                        {isEditing ? (
                          <select
                            value={edit.arrivalAirport}
                            onChange={(e) => setEdit((p) => ({ ...p, arrivalAirport: e.target.value }))}
                          >
                            <option value="">-- choose --</option>
                            {airports.map((a) => (
                              <option key={a.id} value={a.code}>
                                {a.code}
                              </option>
                            ))}
                          </select>
                        ) : (
                          f.arrivalAirport
                        )}
                      </td>

                      <td style={td}>
                        {isEditing ? (
                          <input
                            value={edit.scheduledDeparture}
                            onChange={(e) => setEdit((p) => ({ ...p, scheduledDeparture: e.target.value }))}
                          />
                        ) : (
                          formatDateTime(f.scheduledDeparture)
                        )}
                      </td>

                      <td style={td}>
                        {isEditing ? (
                          <input
                            value={edit.scheduledArrival}
                            onChange={(e) => setEdit((p) => ({ ...p, scheduledArrival: e.target.value }))}
                          />
                        ) : (
                          formatDateTime(f.scheduledArrival)
                        )}
                      </td>

                      <td style={td}>
                        {isEditing ? (
                          <select
                            value={edit.status}
                            onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value }))}
                          >
                            <option value="ON_TIME">ON_TIME</option>
                            <option value="DELAYED">DELAYED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="BOARDING">BOARDING</option>
                          </select>
                        ) : (
                          f.status
                        )}
                      </td>

                      <td style={td}>
                        {isEditing ? (
                          <select
                            value={edit.airlineId}
                            onChange={(e) => setEdit((p) => ({ ...p, airlineId: e.target.value }))}
                          >
                            <option value="">-- choose --</option>
                            {airlines.map((al) => (
                              <option key={al.id} value={al.id}>
                                {al.name || al.code || `Airline ${al.id}`} (id: {al.id})
                              </option>
                            ))}
                          </select>
                        ) : (
                          f.airline?.name || f.airline?.code || ""
                        )}
                      </td>

                      <td style={td}>
                        {isEditing ? (
                          <select value={edit.gateId} onChange={(e) => setEdit((p) => ({ ...p, gateId: e.target.value }))}>
                            <option value="">-- choose --</option>
                            {gates.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.gateCode} — {g.terminal} (id: {g.id})
                              </option>
                            ))}
                          </select>
                        ) : (
                          f.gate?.gateCode || ""
                        )}
                      </td>

                      <td style={td}>
                        {!isEditing ? (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => startEdit(f)} disabled={deletingId === f.id}>
                              Edit
                            </button>
                            <button onClick={() => deleteFlight(f.id)} disabled={deletingId === f.id}>
                              {deletingId === f.id ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => saveEdit(f.id)} disabled={savingId === f.id}>
                              {savingId === f.id ? "Saving…" : "Save"}
                            </button>
                            <button onClick={cancelEdit} disabled={savingId === f.id}>
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

const th = { textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px" };
const td = { borderBottom: "1px solid #eee", padding: "8px", verticalAlign: "top" };
const card = { border: "1px solid #ddd", borderRadius: 12, padding: 16 };

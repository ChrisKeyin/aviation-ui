import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../lib/config";
import { fetchJson } from "../lib/http";
import FlightsTable from "../components/FlightsTable";

export default function PublicBoard() {
  const [airports, setAirports] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState("");
  const [tab, setTab] = useState("arrivals");

  const [flights, setFlights] = useState([]);
  const [loadingAirports, setLoadingAirports] = useState(true);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadAirports() {
      try {
        setErr("");
        setLoadingAirports(true);

        const data = await fetchJson(`${API_BASE}/api/airports`);
        setAirports(Array.isArray(data) ? data : []);

        if (Array.isArray(data) && data.length > 0) {
          setSelectedAirport((prev) => prev || data[0].code);
        }
      } catch (e) {
        setErr(e.message || "Failed loading airports");
      } finally {
        setLoadingAirports(false);
      }
    }
    loadAirports();
  }, []);

  const selectedAirportObj = useMemo(
    () => airports.find((a) => a.code === selectedAirport),
    [airports, selectedAirport]
  );

  useEffect(() => {
    async function loadFlights() {
      if (!selectedAirport) return;

      try {
        setErr("");
        setLoadingFlights(true);

        const url =
          tab === "arrivals"
            ? `${API_BASE}/api/flights/search/arrivals?airport=${encodeURIComponent(selectedAirport)}`
            : `${API_BASE}/api/flights/search/departures?airport=${encodeURIComponent(selectedAirport)}`;

        const data = await fetchJson(url);
        setFlights(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || "Failed loading flights");
        setFlights([]);
      } finally {
        setLoadingFlights(false);
      }
    }

    loadFlights();
  }, [selectedAirport, tab]);

  return (
    <>
      {err && (
        <div style={{ padding: 12, border: "1px solid #f00", marginBottom: 12 }}>
          <b>Request failed:</b> {err}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <label>
          <b>Airport:</b>{" "}
          <select
            value={selectedAirport}
            onChange={(e) => setSelectedAirport(e.target.value)}
            disabled={loadingAirports}
          >
            {airports.map((a) => (
              <option key={a.id} value={a.code}>
                {a.code} — {a.city}
              </option>
            ))}
          </select>
        </label>

        <button onClick={() => setTab("arrivals")} disabled={tab === "arrivals"}>
          Arrivals
        </button>
        <button onClick={() => setTab("departures")} disabled={tab === "departures"}>
          Departures
        </button>
      </div>

      {selectedAirportObj && (
        <h2 style={{ marginTop: 0 }}>
          {tab === "arrivals" ? "Arrivals" : "Departures"} — {selectedAirportObj.name} ({selectedAirportObj.code})
        </h2>
      )}

      {(loadingAirports || loadingFlights) && <p>Loading…</p>}

      {!loadingFlights && flights.length === 0 && selectedAirport && <p>No flights found.</p>}

      {!loadingFlights && flights.length > 0 && <FlightsTable flights={flights} />}
    </>
  );
}

import { formatDateTime } from "../lib/dates";

export default function FlightsTable({ flights }) {
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={th}>Flight</th>
          <th style={th}>From</th>
          <th style={th}>To</th>
          <th style={th}>Departure</th>
          <th style={th}>Arrival</th>
          <th style={th}>Status</th>
        </tr>
      </thead>
      <tbody>
        {flights.map((f) => (
          <tr key={f.id}>
            <td style={td}><b>{f.flightNumber}</b></td>
            <td style={td}>{f.departureAirport}</td>
            <td style={td}>{f.arrivalAirport}</td>
            <td style={td}>{formatDateTime(f.scheduledDeparture)}</td>
            <td style={td}>{formatDateTime(f.scheduledArrival)}</td>
            <td style={td}>{f.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th = { textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px" };
const td = { borderBottom: "1px solid #eee", padding: "8px", verticalAlign: "top" };

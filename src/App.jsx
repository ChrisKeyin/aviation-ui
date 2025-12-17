import { useState } from "react";
import PublicBoard from "./pages/PublicBoard";
import AdminFlights from "./pages/AdminFlights";
import { API_BASE } from "./lib/config";

export default function App() {
  const [page, setPage] = useState("public");

  return (
    <div style={{ fontFamily: "system-ui, Arial", padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Aviation Frontend</h1>

      <p>
        <b>API:</b> {API_BASE}
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setPage("public")} disabled={page === "public"}>
          Public
        </button>
        <button onClick={() => setPage("admin")} disabled={page === "admin"}>
          Admin
        </button>
      </div>

      {page === "public" ? <PublicBoard /> : <AdminFlights />}
    </div>
  );
}

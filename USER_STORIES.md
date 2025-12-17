# Aviation Arrivals & Departures — User Stories + Manual Test Scenarios

## Scope
This document contains manual test scenarios for the React UI, including a public arrivals/departures board and an admin flight management section.

## Test Environment
- Frontend: http://localhost:5173 (dev) OR http://localhost:5173 (docker/nginx mapped port)
- API: http://localhost:8080
- Database: PostgreSQL (docker compose)

> Note: If running via docker compose, services are started together and the UI should reach the API through the configured base URL / proxy.

---

## 1 — Public Arrivals/Departures Board

### US-1: View airports list
**As a user**, I want to see available airports so I can choose one to view arrivals/departures.

**Manual Test**
1. Open the UI.
2. Confirm an airport selector is visible.
3. Confirm at least one airport appears (seeded or created).

**Expected**
- Airport dropdown renders.
- Airports display by code/city/name as designed.

---

### US-2: Switch airport and see updated results
**As a user**, I want to switch airports and immediately see updated arrivals/departures.

**Manual Test**
1. Select Airport A.
2. Note the list/table contents.
3. Select Airport B.

**Expected**
- List updates after selection.
- “No flights found” displays if none exist.

---

### US-3: Switch between Arrivals and Departures tabs
**As a user**, I want to switch tabs to view arrivals or departures.

**Manual Test**
1. Select an airport with at least one departure flight.
2. Click “Departures”.
3. Click “Arrivals”.

**Expected**
- Tab changes.
- API calls update to the correct endpoint.
- Flights displayed match the selected tab.

---

## 2 — Admin Flights Management

### US-4: Admin can view flights list
**As an admin**, I want to view flights so I can manage them.

**Manual Test**
1. Go to Admin page.
2. Confirm flights list/table is visible.

**Expected**
- Flights list loads successfully.
- If no flights exist, an empty-state message is shown.

---

### US-5: Admin can create a flight
**As an admin**, I want to add a flight so it appears on the public board.

**Manual Test**
1. Go to Admin page.
2. Fill in required flight fields (flight number, airports, times, status, airline, gate).
3. Submit.

**Expected**
- Success response (or UI updates).
- New flight appears in Admin list.
- New flight appears on Public board under correct airport/tab.

---

### US-6: Admin can update a flight
**As an admin**, I want to edit a flight to correct schedule/status changes.

**Manual Test**
1. In Admin page, choose an existing flight.
2. Update status/time/airport fields.
3. Save/update.

**Expected**
- API returns success.
- Flight row updates in admin list.
- Public board reflects the updated data.

---

### US-7: Admin can delete a flight
**As an admin**, I want to delete a flight that was cancelled or entered incorrectly.

**Manual Test**
1. In Admin page, delete an existing flight.
2. Refresh or re-check list.

**Expected**
- API returns success (204/200).
- Flight removed from admin list.
- Flight no longer appears on public board.

---

## 3— Error Handling & UX

### US-8: API down shows helpful error
**As a user**, I want a clear message if the API is unreachable.

**Manual Test**
1. Stop the API container/app.
2. Refresh the UI.

**Expected**
- Error message shown (not a blank page).
- Message suggests checking API base URL / API status.

---

## Completion Checklist
- [ ] Airports display
- [ ] Airport switching works
- [ ] Arrivals/departures tab switching works
- [ ] Admin create works
- [ ] Admin update works
- [ ] Admin delete works
- [ ] Error handling displays readable message

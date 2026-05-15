 # TODO - Frontend ↔ Backend Integration

- [x] Connect `RentalsPage` to backend `/api/rentals` (replace mock PROPERTIES with API fetch + mapping)

- [ ] Ensure filters/search on `RentalsPage` pass `q` to backend (and/or client-side fallback)
- [ ] Remove mock fallback timeout when real data is available
- [ ] Validate token usage (Bearer `lt_token`) for any authenticated actions
- [ ] Run frontend build/dev and verify `/rentals`, `/workers`, `/materials`, `/services`, auth pages call backend endpoints correctly
- [ ] (Optional) Add `.env.example` with `VITE_API_BASE`


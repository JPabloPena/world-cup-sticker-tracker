# Agent Guidance

## Commands
- `npm run dev` - Run server only (Express on port 3001)
- `npm run build` - Build client + start server
- `npm start` - Start server only
- `npm run seed` - Seed database with 980 stickers

## Architecture
- **Client**: React 18 + Vite + Tailwind CSS, runs on port 5173 (dev)
- **Server**: Express + sql.js (SQLite in-memory with file persistence)
- **Database**: `server/data/stickers.db`

## Key Details
- Server binds to `0.0.0.0` for LAN access
- Client dev proxy: `/api` → `http://localhost:3001`
- Run `npm run seed` once before first use to populate stickers
- API: `GET /api/stickers`, `GET /api/stats`, `PUT /api/stickers/:id`

## File Structure
- `client/src/` - React frontend
- `server/index.js` - Express API + static file serving
- `server/database/seed.js` - Database initialization script
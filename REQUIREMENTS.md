# World Cup 2026 Sticker Tracker - Requirements

## Project Overview
A mobile-first web app to track stickers for the 48-team World Cup album. 
Hosted locally but accessible via WiFi (LAN).

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- Database: SQLite (better-sqlite3)
- Icons: Lucide React

## Data Structure
- Total Stickers: 980
- Teams: 48 countries (20 stickers each: [CODE]1 to [CODE]20)
- Intro Section: 9 stickers (FWC0 to FWC8)
- Sticker States: Missing (0), Collected (1), Repeated (n > 1)

## Core Features
- Searchable Grid: Filter by Player Name, Country, or ID.
- Counter: Click to increment; include a way to decrement if a mistake is made.
- Dashboard: Grouped by country with progress bars/completion stats.
- LAN Access: Server must bind to 0.0.0.0.

## Implementation Notes
- Use a `seed.js` script to generate the 980 entries in SQLite.
- Ensure the UI is strictly mobile-first (large touch targets for buttons).
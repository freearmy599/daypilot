# DayPilot

A polished, mobile-friendly daily planner built with plain HTML, CSS, and JavaScript.

## Features
- Task creation, editing, completion, and deletion
- Due dates, optional times, priorities, and notes
- Today, Upcoming, and Completed views
- Search, priority filtering, and sorting
- Daily goal and progress tracking
- Local browser storage and JSON backup import/export
- Responsive design; no login, backend, or paid APIs

## Run locally
Open `index.html` in a modern browser. Optionally run `python -m http.server 8000` and visit `http://localhost:8000`.

## Privacy
Tasks stay in the current browser's localStorage and do not sync between devices. Export backups periodically.

## Files
- `index.html` — page structure
- `styles.css` — responsive styling
- `app.js` — application logic
## Search visibility
- Homepage includes a descriptive title, meta description, canonical URL, and social-sharing metadata.
- `sitemap.xml` lists the public homepage; submit `sitemap.xml` in Google Search Console after deploying.
- `robots.txt` allows crawling and references the sitemap.
- The homepage includes useful product information, FAQs, and WebApplication structured data.
- Search indexing and ranking are controlled by search engines and are not guaranteed.

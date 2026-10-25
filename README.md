# DayPilot

**Make space for what matters.** DayPilot is a calm, focused daily planner built around clarity, small wins, and keeping your tasks on your own device.

A polished, mobile-friendly daily planner built with plain HTML, CSS, and JavaScript.

## Features
- Task creation, editing, completion, and deletion
- Due dates, optional times, priorities, and notes
- Today, Upcoming, and Completed views
- Search with one-tap clear, priority and overdue filtering, and sorting
- Daily goal and progress tracking
- Local browser storage and JSON backup import/export
- Responsive design; no login, backend, or paid APIs

## Run locally
Open `index.html` in a modern browser. Optionally run `python -m http.server 8000` and visit `http://localhost:8000`.

## Tests
Run the dependency-free smoke tests with `node --test tests/smoke.test.mjs` in a recent Node.js installation.

## Privacy
Tasks stay in the current browser's localStorage and do not sync between devices. Export backups periodically.

## Files
- `index.html` — page structure and brand metadata
- `favicon.svg` — lightweight custom DayPilot compass-star mark
- `styles.css` — responsive styling
- `app.js` — application logic
## Search visibility
- Homepage includes a descriptive title, meta description, canonical URL, and social-sharing metadata.
- `sitemap.xml` lists the public homepage; submit `sitemap.xml` in Google Search Console after deploying.
- `robots.txt` allows crawling and references the sitemap.
- The homepage includes useful product information, FAQs, and WebApplication structured data.
- Search indexing and ranking are controlled by search engines and are not guaranteed.

## Productivity shortcuts
- Press `N` outside an input to create a task.
- Press `/` outside an input to focus task search.
- Press `?` outside an input to show the keyboard shortcut guide.
- Use the `Overdue` filter to quickly find unfinished tasks dated before today.
- Task action controls include task-specific accessible labels.
- If DayPilot is open in multiple tabs for the same browser storage, task updates are reflected across tabs.

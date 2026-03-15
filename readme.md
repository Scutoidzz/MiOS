# MiOS

MiOS is a small browser-based desktop simulation with draggable app windows and a dock launcher.

## Features

- Draggable, minimizable, and resizable app windows
- Dock app launcher configured from JSON manifests
- Included apps: Notes, Clock, Solitaire, Settings, and App Manager
- Boot background music support

## Running locally

1. Clone the repository.
2. Serve the repository root with any static web server.
3. Open `index.html` in your browser.

Example using Python:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## App structure

- `apps/appmanager/apps.json` controls which apps appear in the dock.
- Each app has a manifest JSON with metadata and file paths.
- Window behavior is implemented in `os/kernel.js`.

## Notes

- The calculator placeholder app has been removed from the dock.
- The settings app now includes basic controls for theme and background music.
- Solitaire now shows a popup when no valid moves remain.

# WebOS Technical Overview

## 📖 Overview
This repository implements **WebOS**, a browser‑based desktop operating system built with modern web technologies. It provides a full‑screen desktop UI, window manager, built‑in applications (Paint, Settings, etc.), and persistent user data.

---

## 🛠️ Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast dev server, HMR)
- **State Management**: Zustand (lightweight, immutable‑friendly store)
- **Styling**: Vanilla CSS + CSS modules (no Tailwind unless explicitly added)
- **Persistence**: `localStorage` (via `fsStore.ts`) for file system simulation; can be swapped for IndexedDB.
- **Animations**: Framer Motion for window drag/resize and UI transitions.
- **Icons**: Lucide React.
- **Package Manager**: npm (scripts defined in `package.json`).

---

## 📂 Project Structure (high‑level)
```
web-os/
├─ src/
│  ├─ components/          # UI components (Desktop, StartMenu, apps, etc.)
│  │   ├─ os/               # Core OS UI (Desktop, Taskbar, StartMenu)
│  │   └─ apps/            # Built‑in applications (Paint, Settings, …)
│  ├─ store/                # Zustand stores (windowStore, fsStore, …)
│  │   └─ fsStore.ts        # Simple file‑system abstraction over localStorage
│  ├─ index.tsx             # App entry point
│  └─ index.css             # Global styles (including dark/light themes)
├─ public/                  # Static assets (icons, wallpapers)
└─ vite.config.ts           # Vite configuration
```

---

## 🗂️ Data Structuring & Persistence
- **File System (`fsStore.ts`)**
  - Stores a JSON representation of a hierarchical file tree in `localStorage` under the key `fs`.
  - Each node has `{ id, name, type: "file"|"folder", children?, content? }`.
  - Helper functions (`createFile`, `createFolder`, `readFile`, `writeFile`, `deleteNode`) manipulate this tree and sync back to storage.
- **Window Store (`windowStore.ts`)**
  - Tracks open windows, their `zIndex`, position, size, and focus state.
  - Z‑index is auto‑incremented on focus; the highest value brings the window to the front.

---

## 📈 Z‑Index Management
- Each window has a numeric `zIndex` stored in the Zustand `windowStore`.
- When a window receives a click or is programmatically focused, the store increments a global `nextZ` counter and assigns it to that window.
- Rendering order in `WindowFrame.tsx` respects this `zIndex` via CSS `z-index` property, ensuring the focused window appears on top.
- The `nextZ` counter never resets during a session, preventing Z‑index collisions.

---

## 🚀 Running the Project
```bash
# Install dependencies
npm install

# Start development server (hot‑reloading)
npm run dev
```
Open `http://localhost:5173` (or the URL shown in the terminal) in a modern browser.

---

## 📦 Build for Production
```bash
npm run build   # Generates a static bundle in `dist/`
```
Serve the `dist/` folder with any static file server.

---

## 📚 Further Reading
- **State Management**: `src/store/windowStore.ts` – how windows are tracked and Z‑index is handled.
- **File System**: `src/store/fsStore.ts` – persistent storage implementation.
- **Window UI**: `src/components/os/WindowFrame.tsx` – drag, resize, focus logic.
- **Desktop UI**: `src/components/os/Desktop.tsx` – wallpaper, icons, context menu.

---

*This README provides a concise technical snapshot to help you explain WebOS confidently.*

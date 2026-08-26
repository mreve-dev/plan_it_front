# Plan'it — Frontend

*[Lire en français](../README.md)*

Front-end web application for **Plan'it**, a volunteer management platform for a badminton club. It allows administrators to create events and missions, and lets volunteers browse and sign up for available time slots.

## 🧱 Tech Stack

- **[React](https://react.dev/)** + **TypeScript** — user interface
- **[Vite](https://vitejs.dev/)** — build tool and dev server
- **[Zustand](https://github.com/pmndrs/zustand)** — global state management (authentication, preferences), persisted via `localStorage`
- **[TanStack Query](https://tanstack.com/query)** — server state management (caching, refetching, invalidation)
- **[React Router](https://reactrouter.com/)** — routing, with routes protected by role (admin / volunteer)
- **[Tailwind CSS](https://tailwindcss.com/)** + **[DaisyUI](https://daisyui.com/)** — styling and UI components
- **[Axios](https://axios-http.com/)** — HTTP requests, with interceptors for token injection and automatic refresh
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** — form handling and validation
- **[react-day-picker](https://daypicker.dev/)** — date picking
- **[Cypress](https://www.cypress.io/)** — end-to-end testing
- **Docker** — containerization for deployment

## ✨ Key Features

### Volunteer side
- **Personal dashboard**: next mission, monthly volunteer hours, mission and skill counts, interactive week timeline with missions filtered by day
- **My events**: list of events the volunteer is registered for, filterable by upcoming / past
- **My missions**: list of the volunteer's registrations, with a slot fill-rate gauge, unregistration with a confirmation modal
- **Slot registration**: browse a mission's available slots, grouped by day, with direct sign-up/cancellation

### Admin side
- **Admin dashboard**: global stats (events, missions, volunteers, fill rate), next upcoming event, alerts for under-filled missions, upcoming birthdays
- **Event management**: create, update, delete, associated documents
- **Mission management**: creation (manual mode or automatic generation of several slots), update, delete, required skills management
- **Slot management**: create, duplicate, update, delete, view registered volunteers
- **Volunteer management**: user list, role management

### Cross-cutting
- **Authentication**: login, signup, forgot / reset password, onboarding (skill selection on first login)
- **Light / dark theme**: with a "system" option that automatically follows OS preferences
- **Responsive**: mobile-first approach, with layout adaptation for tablet and desktop

## 🎨 Design System

Brand color palette:
- **Teal** `#4f9288` / `#104e64` (dark teal) — primary color
- **Rose/mauve** `#9b6581` — secondary color (duplicate actions, accents)
- **Khaki** `#c8c4a0` — tertiary color
- **Cream** `#e6dabb` — light theme background
- **Navy** `#161b27` / `#1e2433` — dark theme background

Each mode (light/dark) has its own color variants to stay readable and accessible in both themes.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm
- The Plan'it backend running (see its own README)

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd <folder-name>

# 2. Install dependencies
npm install

# 3. Create the .env file (see the Environment Variables section)

# 4. Start the dev server
npm run dev
```

The application is then available at `http://localhost:5173`.

## ⚙️ Environment Variables

Create a `.env` file at the project root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

⚠️ This file should **never** be committed — it is listed in `.gitignore`.

## 🔐 Authentication

The application uses a dual JWT token system:
- **`accessToken`**: stored client-side (Zustand + `localStorage`), short-lived (15 min), automatically injected into the `Authorization` header of every request via an Axios interceptor
- **`refreshToken`**: stored in an `httpOnly` cookie, never accessible from JavaScript, used only to transparently renew the `accessToken` when it expires (a response interceptor detects a 401, refreshes the token, then replays the original request)

## 🧪 Testing

```bash
# Open the Cypress interface
npx cypress open

# Run tests in headless mode
npx cypress run
```

End-to-end tests cover, among other things, the full mission-creation flow (valid cases and error cases: empty fields, invalid slot, midnight overflow in automatic generation, etc.).

## 📁 Project Structure

```
src/
├── components/       # Reusable components (cards, modals, navigation...)
│   ├── event/
│   ├── mission/
│   ├── missionSlot/
│   └── navbar/
├── pages/            # Application pages, organized by domain
│   ├── admin/
│   ├── auth/
│   ├── event/
│   ├── mission/
│   ├── users/
│   └── volunteers/
├── layouts/          # Shared layouts (public / private)
├── guards/           # Route protection based on auth/role
├── hook/             # Custom hooks (API, React Query mutations)
├── services/api/     # Backend API call functions
├── stores/           # Global state (Zustand)
├── types/            # Shared TypeScript types
├── utils/            # Utility functions (dates, calculations...)
```

## 🌐 Deployment

The project is built with `npm run build` (output in `dist/`), then served as a static site — either via a static hosting provider (Netlify, Vercel) or via the provided `Dockerfile`, which builds the app and serves it with Nginx.

Remember to configure `VITE_API_BASE_URL` with the real deployed backend URL before building — Vite variables are injected **at build time**, not at runtime.
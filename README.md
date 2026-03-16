# Concert Booking — Frontend

A role-based concert booking web application built with Next.js, and Tailwind Supports two roles — **Admin** and **User** — with separate interfaces for concert management and ticket booking.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A running backend API (see backend README)

### Environment Variables

Create a `.env / .env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Replace the value with your backend URL if it differs.

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (port 8080)
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---
## Tech Stack


| Category | Library / Tool |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind |
| HTTP Client | Axios |
| Notifications | Sonner |
| Icons | Lucide React |

---

## Features

### Admin
- View statistics: total seats, active bookings, cancellations
- Browse and delete concerts
- Create new concerts (name, description, total seats)
- View paginated audit log history

### User
- Browse available concerts with seat availability
- Book a concert (1 active booking per concert)
- Cancel a booking
- View personal booking history with status and timestamps

---

## Project Structure

```
booking-frontend/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx           # Centered card layout for auth pages
│   │   ├── page.tsx             # Redirects to /login
│   │   ├── login/page.tsx       # Login form
│   │   └── register/page.tsx    # Registration form
│   ├── (admin)/
│   │   ├── layout.tsx           # Wraps admin pages with AdminLayout
│   │   ├── dashboard/page.tsx   # Concert management + stats
│   │   └── history/page.tsx     # Audit log table (paginated)
│   ├── (user)/
│   │   ├── layout.tsx           # Wraps user pages with UserLayout
│   │   ├── concerts/page.tsx    # Browse and book concerts
│   │   └── bookings/page.tsx    # Personal booking history (paginated)
│   ├── layout.tsx               # Root layout (fonts, Toaster)
│   ├── page.tsx                 # Root redirect based on role cookie
│   └── globals.css
├── components/
│   ├── layouts/
│   │   ├── AdminLayout.tsx      # Slate sidebar layout for admin
│   │   ├── AuthLayout.tsx       # Gradient background for auth
│   │   └── UserLayout.tsx       # Emerald sidebar layout for user
│   ├── ui/
│   │   ├── Alert.tsx            # Inline alert (info / success / warning / error)
│   │   └── AlertDialog.tsx      # Confirmation modal dialog
│   └── icons/
│       └── index.tsx            # SVG icon components
├── lib/
│   ├── api.ts                   # Axios instance + ApiError class
│   └── session.ts               # Cookie helpers (setSession / clearSession)
└── services/
    ├── auth.ts                  # login, register, switchRole, logout
    ├── concerts.ts              # getConcerts, createConcert, deleteConcert
    ├── bookings.ts              # getBookings, getAllBookings, createBooking, deleteBooking
    └── audit-logs.ts            # getAuditLogs (paginated)
```
---

## Routing

| Path | Role | Description |
|---|---|---|
| `/` | Any | Redirects to `/dashboard`, `/concerts`, or `/login` based on role cookie |
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/dashboard` | Admin | Concert stats + management |
| `/history` | Admin | Paginated audit log |
| `/concerts` | User | Browse and book concerts |
| `/bookings` | User | Personal booking history |

---

## API Services

### Auth — `services/auth.ts`
| Function | Method | Endpoint |
|---|---|---|
| `login(payload)` | POST | `/auth/login` |
| `register(payload)` | POST | `/auth/register` |
| `switchRole()` | PATCH | `/auth/role` |
| `logout()` | — | Clears cookies |

### Concerts — `services/concerts.ts`
| Function | Method | Endpoint |
|---|---|---|
| `getConcerts()` | GET | `/concerts` |
| `createConcert(payload)` | POST | `/concerts` |
| `deleteConcert(id)` | DELETE | `/concerts/:id` |

### Bookings — `services/bookings.ts`
| Function | Method | Endpoint |
|---|---|---|
| `getBookings()` | GET | `/bookings/me` |
| `getAllBookings()` | GET | `/bookings` |
| `createBooking(concertId)` | POST | `/bookings` |
| `deleteBooking(id)` | DELETE | `/bookings/:id` |

### Audit Logs — `services/audit-logs.ts`
| Function | Method | Endpoint |
|---|---|---|
| `getAuditLogs(page, limit)` | GET | `/audit-logs` |

# Smart Journal - Frontend 🎨

A modern, responsive journaling web application built with **Next.js 16** and **React 19**. Features mood tracking, analytics visualization, and a beautiful dark/light theme.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI primitives |
| [Zustand](https://zustand-demo.pmnd.rs/) | State management |
| [TanStack Query](https://tanstack.com/query) | Data fetching & caching |
| [React Hook Form](https://react-hook-form.com/) | Form handling |
| [Zod](https://zod.dev/) | Schema validation |
| [Recharts](https://recharts.org/) | Charts & visualization |
| [Lucide React](https://lucide.dev/) | Icons |
| [next-themes](https://github.com/pacocoursey/next-themes) | Theme switching |

## 📁 Folder Structure

```
frontend/
├── app/                     # Next.js App Router
│   ├── (auth)/              # Auth route group
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── (dashboard)/         # Dashboard route group
│   │   ├── layout.tsx       # Dashboard layout
│   │   ├── dashboard/       # Main dashboard
│   │   ├── entries/         # Journal entries
│   │   ├── calendar/        # Calendar view
│   │   ├── analytics/       # Analytics page
│   │   ├── archive/         # Archived entries
│   │   └── profile/         # User profile
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Shadcn/Radix UI components
│   ├── analytics-view.tsx   # Analytics dashboard
│   ├── archive-view.tsx     # Archive page
│   ├── calendar-view.tsx    # Calendar component
│   ├── dashboard-content.tsx
│   ├── entry-card.tsx       # Journal entry card
│   ├── entry-editor.tsx     # Rich entry editor
│   ├── header.tsx           # App header
│   ├── footer.tsx           # App footer
│   ├── login-form.tsx       # Login form
│   ├── register-form.tsx    # Registration form
│   ├── mood-selector.tsx    # Mood picker
│   ├── mood-trend-chart.tsx # Mood analytics chart
│   ├── profile-view.tsx     # Profile settings
│   ├── stats-card.tsx       # Statistics card
│   ├── tag-cloud.tsx        # Tag visualization
│   ├── tag-input.tsx        # Tag input component
│   └── word-count-chart.tsx # Word count chart
├── hooks/
│   ├── use-analytics.ts     # Analytics data fetching
│   ├── use-auth.ts          # Authentication hooks
│   ├── use-dashboard.ts     # Dashboard data
│   ├── use-entries.ts       # Journal entries CRUD
│   └── use-theme.ts         # Theme toggle
├── lib/
│   ├── api-client.ts        # API client wrapper
│   ├── constants.ts         # App constants
│   └── utils.ts             # Utility functions
├── store/
│   ├── auth-store.ts        # Auth state (Zustand)
│   ├── entries-store.ts     # Entries state
│   └── theme-store.ts       # Theme state
├── types/
│   └── ...                  # TypeScript type definitions
├── public/                  # Static assets
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── package.json
```

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | **Yes** |

### Example `.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🚀 Local Development

### 1. Install Dependencies

```bash
cd frontend
bun install
```

### 2. Configure Environment

Create `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
bun run dev
```

Application starts at `http://localhost:3000` with Turbopack enabled.

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server (Turbopack) |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run Biome linter |
| `bun run lint:fix` | Fix lint issues |
| `bun run format` | Format code |
| `bun run type-check` | TypeScript type check |

## 📱 Key Features & Pages

### Landing Page (`/`)
- Hero section with app introduction
- Feature highlights
- Call-to-action for signup

### Authentication
- **Login** (`/login`) - Email/password authentication
- **Register** (`/register`) - New user registration

### Dashboard (`/dashboard`)
- Overview of recent entries
- Mood summary visualization
- Quick stats cards
- Entry count display

### Journal Entries (`/entries`)
- View all journal entries
- Create new entries with rich editor
- Edit existing entries
- View individual entry details (`/entries/[id]`)

### Calendar View (`/calendar`)
- Monthly calendar interface
- Entries displayed by date
- Navigate between months

### Analytics (`/analytics`)
- **Mood Trends** - Line chart showing mood over time
- **Word Count** - Writing frequency analysis
- **Tag Cloud** - Most used tags visualization
- **Activity Streak** - Consecutive journaling days

### Archive (`/archive`)
- View archived entries
- Restore or permanently delete entries

### Profile (`/profile`)
- View/edit user information
- Export journal data
- Theme preferences

## 🧩 Component Architecture

### UI Components (`/components/ui/`)
Built on Radix UI primitives with Tailwind styling:
- Accordion, Alert Dialog
- Avatar, Button, Card
- Dialog, Dropdown Menu
- Form inputs, Labels
- Popover, Progress
- Select, Tabs, Toast
- Tooltip, and more

### Feature Components
- **Entry Editor** - Rich text editor with mood selection and tagging
- **Mood Selector** - Emoji-based mood picker (😊 😐 😢 😡 etc.)
- **Tag Input** - Dynamic tag creation/removal
- **Charts** - Recharts-based visualizations

### Providers (`/components/providers.tsx`)
- Theme Provider (next-themes)
- Query Client Provider (TanStack Query)
- Toast Provider (Sonner)

## 🎨 Styling Approach

### Tailwind CSS 4
- Utility-first CSS framework
- Custom color palette with CSS variables
- Dark mode via `dark:` variants
- Responsive design with breakpoints

### Theme System
- Light/Dark mode toggle
- System preference detection
- Persistent theme storage (Zustand)
- CSS custom properties for colors

### Animation
- `tailwindcss-animate` for transitions
- Smooth hover/focus states
- Loading skeletons

## 🔄 State Management

### Zustand Stores

**Auth Store** (`/store/auth-store.ts`)
- User session management
- Token storage
- Login/logout actions

**Entries Store** (`/store/entries-store.ts`)
- Current entries list
- Selected entry
- Filter/sort state

**Theme Store** (`/store/theme-store.ts`)
- Theme preference
- Toggle function

### TanStack Query
- Server state caching
- Automatic refetching
- Optimistic updates
- Loading/error states

## 🧪 Testing

```bash
# Type checking
bun run type-check

# Linting
bun run lint
```

## 📦 Build & Deployment

### Production Build

```bash
bun run build
bun run start
```

### Vercel Deployment

```bash
vercel --prod
```

Configure environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` - Your backend API URL

## 🔗 API Integration

All API calls go through `/lib/api-client.ts`:

```typescript
// Example usage
import { apiClient } from '@/lib/api-client';

const entries = await apiClient.entries.getAll();
const entry = await apiClient.entries.create({ title, content, mood });
```

The client handles:
- Base URL configuration
- Authentication headers
- Error handling
- Response parsing

---

**Part of the [Smart Journal](../README.md) project**

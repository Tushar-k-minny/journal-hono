# Smart Journal 📓

A full-stack journaling application with mood tracking, analytics, and insights. Built as a monorepo with a Next.js frontend and Hono backend.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Bun](https://img.shields.io/badge/runtime-Bun-f472b6)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## 🏗️ Architecture

```
smart-journal/
├── backend/          # Hono API server (Bun runtime)
├── frontend/         # Next.js 16 web application
├── package.json      # Root workspace configuration
└── biome.jsonc       # Shared linting/formatting config
```

This monorepo uses **Bun workspaces** to manage both applications with shared tooling.

## 🛠️ Tech Stack

### Backend
- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Hono](https://hono.dev/) with OpenAPI support
- **Database:** PostgreSQL via [Neon](https://neon.tech/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Validation:** [Zod](https://zod.dev/)
- **API Docs:** [@scalar/hono-api-reference](https://github.com/scalar/scalar)

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **React:** React 19
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching:** [TanStack Query](https://tanstack.com/query)
- **Charts:** [Recharts](https://recharts.org/)

## 📋 Prerequisites

- **Bun** >= 1.1.0
- **Node.js** >= 20.x (for some tooling)
- **PostgreSQL** database (or Neon serverless)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd smart-journal
bun install
```

### 2. Configure Environment Variables

Create `.env.local` files in both `backend/` and `frontend/` directories:

**Backend (`backend/.env.local`):**
```env
PORT=5000
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URL=postgresql://user:pass@host/database
JWT_SECRET=your-32-character-minimum-secret-key
JWT_EXPIRES_IN=7d
```

**Frontend (`frontend/.env`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Setup Database

```bash
# Generate Drizzle migrations
bun run db:generate

# Apply migrations
bun run db:migrate

# (Optional) Open Drizzle Studio
bun run db:studio
```

### 4. Start Development Servers

```bash
# Run both backend and frontend
bun run dev

# Or run separately
bun run dev:backend    # Backend on http://localhost:5000
bun run dev:frontend   # Frontend on http://localhost:3000
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start both backend and frontend |
| `bun run dev:backend` | Start backend only |
| `bun run dev:frontend` | Start frontend only |
| `bun run build` | Build all workspaces |
| `bun run lint` | Run Biome linter |
| `bun run lint:fix` | Fix lint issues |
| `bun run format` | Format code with Biome |
| `bun run type-check` | TypeScript type checking |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Run database migrations |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Drizzle Studio |

## 🌍 Environment Variables

### Backend

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `LOG_LEVEL` | Logging level (trace/debug/info/warn/error/fatal) | No | `info` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration (e.g., 7d, 1h, 30m) | No | `7d` |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## 🔄 Development Workflow

1. **Create a branch** for your feature/fix
2. **Run development servers** with `bun run dev`
3. **Make changes** - hot reload is enabled
4. **Lint and format** with `bun run lint:fix`
5. **Type check** with `bun run type-check`
6. **Commit** with descriptive messages
7. **Open a PR** for review

## 🚢 Deployment

### Backend (Vercel)

The backend is configured for Vercel deployment with `vercel.json`:

```bash
cd backend
vercel --prod
```

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

Ensure environment variables are configured in Vercel dashboard.

## 📁 Project Structure

```
smart-journal/
├── backend/
│   ├── src/
│   │   ├── common/          # Shared utilities, types, database
│   │   ├── lib/             # App factory, OpenAPI config
│   │   ├── modules/         # Feature modules (auth, journal, analytics)
│   │   ├── utils/           # Utility functions
│   │   ├── env.ts           # Environment validation
│   │   └── index.ts         # App entry point
│   └── drizzle.config.ts    # Drizzle configuration
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities, API client
│   ├── store/               # Zustand stores
│   └── types/               # TypeScript types
├── package.json             # Workspace root
└── biome.jsonc              # Linting configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use **Biome** for linting and formatting
- Follow **TypeScript** strict mode
- Write **meaningful commit messages**

## 📄 License

This project is licensed under the MIT License.

---

**Happy Journaling! 📝**

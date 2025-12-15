# Smart Journal - Backend API 🚀

The backend service for Smart Journal, built with **Hono** framework running on **Bun** runtime. Provides RESTful APIs for authentication, journal management, and analytics with auto-generated OpenAPI documentation.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Bun](https://bun.sh/) | JavaScript runtime |
| [Hono](https://hono.dev/) | Web framework |
| [Drizzle ORM](https://orm.drizzle.team/) | Database ORM |
| [Neon](https://neon.tech/) | Serverless PostgreSQL |
| [Zod](https://zod.dev/) | Schema validation |
| [hono-zod-openapi](https://github.com/honojs/middleware) | OpenAPI generation |
| [Scalar](https://scalar.com/) | API documentation UI |

## 📁 Folder Structure

```
backend/
├── src/
│   ├── common/
│   │   ├── database/
│   │   │   ├── drizzle/         # Drizzle client setup
│   │   │   └── schema/          # Database schemas
│   │   │       ├── users.schema.ts
│   │   │       ├── sessions.schema.ts
│   │   │       ├── journal-entries.schema.ts
│   │   │       ├── mood-summaries.schema.ts
│   │   │       └── enums.schema.ts
│   │   ├── middlewares/         # Custom middlewares
│   │   └── types/               # Shared TypeScript types
│   ├── lib/
│   │   ├── create-app.ts        # OpenAPI app factory
│   │   └── configure-open-api-app.ts
│   ├── modules/
│   │   ├── auth/                # Authentication module
│   │   ├── journal/             # Journal entries module
│   │   ├── analytics/           # Analytics module
│   │   └── health/              # Health check module
│   ├── utils/                   # Utility functions
│   ├── env.ts                   # Environment validation
│   └── index.ts                 # Application entry point
├── drizzle.config.ts            # Drizzle Kit configuration
├── package.json
└── tsconfig.json
```

## 📡 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/healthz` | Health check endpoint |

### Authentication (`/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/register` | Register new user | No |
| `POST` | `/login` | User login | No |
| `POST` | `/logout` | User logout | Yes |
| `GET` | `/profile` | Get user profile | Yes |
| `PATCH` | `/profile` | Update user profile | Yes |

### Journal Entries (`/journal/entries`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Get all entries (paginated) | Yes |
| `GET` | `/total` | Get total entry count | Yes |
| `GET` | `/:id` | Get entry by ID | Yes |
| `POST` | `/` | Create new entry | Yes |
| `PATCH` | `/:id` | Update entry | Yes |
| `DELETE` | `/:id` | Delete entry | Yes |

### Dashboard (`/journal/dashboard`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/recent` | Get recent entries | Yes |
| `GET` | `/mood-summary` | Get mood summary | Yes |

### Analytics (`/analytics`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/mood-trend` | Get mood trends over time | Yes |
| `GET` | `/word-count` | Get word count trends | Yes |
| `GET` | `/tag-frequency` | Get tag frequency data | Yes |
| `GET` | `/activity-streak` | Get activity streak info | Yes |

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port (1-9999) | No | `5000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `LOG_LEVEL` | Log level (trace/debug/info/warn/error/fatal) | No | `info` |
| `DATABASE_URL` | PostgreSQL connection URL | **Yes** | - |
| `JWT_SECRET` | JWT signing secret (min 32 characters) | **Yes** | - |
| `JWT_EXPIRES_IN` | JWT expiration (e.g., 7d, 1h, 30m, 60s) | No | `7d` |

## 🚀 Local Development

### 1. Install Dependencies

```bash
cd backend
bun install
```

### 2. Configure Environment

Create `.env.local`:

```env
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d
```

### 3. Setup Database

```bash
# Generate migrations from schema
bun run db:generate

# Apply migrations
bun run db:migrate

# (Optional) Push schema directly
bun run db:push

# (Optional) Open Drizzle Studio
bun run db:studio
```

### 4. Start Development Server

```bash
bun run dev
```

Server starts at `http://localhost:5000`

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server with hot reload |
| `bun run build` | Build for production |
| `bun run start` | Run production build |
| `bun run lint` | Run Biome linter |
| `bun run format` | Format code |
| `bun run type-check` | TypeScript type check |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Run migrations |
| `bun run db:push` | Push schema to DB |
| `bun run db:studio` | Open Drizzle Studio |

## 🗄️ Database Schema

### Users
- `id` (UUID, PK)
- `email` (unique)
- `password` (hashed)
- `name`
- `createdAt`, `updatedAt`

### Sessions
- `id` (UUID, PK)
- `userId` (FK)
- `token`
- `expiresAt`

### Journal Entries
- `id` (UUID, PK)
- `userId` (FK)
- `title`, `content`
- `mood`, `tags`
- `isArchived`
- `createdAt`, `updatedAt`

### Mood Summaries
- `id` (UUID, PK)
- `userId` (FK)
- `date`, `mood`, `count`

## 🔐 Authentication

The API uses **JWT Bearer tokens** for authentication.

### Flow:
1. Register or login to receive a JWT token
2. Include token in `Authorization` header:
   ```
   Authorization: Bearer <token>
   ```
3. Token expires based on `JWT_EXPIRES_IN` config

### Protected Routes
Routes marked with "Auth: Yes" require a valid JWT token.

## 📖 API Documentation

When running the server, access:
- **OpenAPI JSON:** `http://localhost:5000/doc`
- **Scalar API Reference:** `http://localhost:5000/reference`

## 🧪 Testing

```bash
# Run type checking
bun run type-check

# Run linting
bun run lint
```

## 🚢 Deployment

### Vercel

The backend includes `vercel.json` configuration for deployment:

```bash
vercel --prod
```

Configure environment variables in Vercel dashboard.

## 📝 Rate Limiting

API requests are rate limited:
- **100 requests** per **15 minutes** per IP address

---

**Part of the [Smart Journal](../README.md) project**

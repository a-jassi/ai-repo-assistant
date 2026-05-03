# Athena

**Athena** is an AI-powered code intelligence platform that transforms how developers understand and interact with their codebases. Connect your GitHub repositories and leverage semantic search powered by vector embeddings to ask questions about your code, get intelligent summaries, and explore commit history—all in one unified interface.

> "Your personal AI code assistant for understanding complex repositories at scale"

---

## Key Features

- **AI-Powered Code Q&A**: Ask natural language questions about your codebase and get intelligent, contextual answers powered by Google Gemini
- **GitHub Integration**: Seamlessly connect and index your GitHub repositories
- **Semantic Code Search**: Leverage vector embeddings to find relevant code snippets based on meaning, not just keywords
- **Commit History Tracking**: Visualize and understand your project's development history
- **Beautiful UI**: Modern, responsive interface built with Tailwind CSS and Radix UI components
- **Secure Authentication**: Enterprise-grade authentication via Clerk

---

## Architecture

Athena is built with a modern, scalable architecture:

```
Frontend (Next.js 14)
    ↓
Type-Safe API (tRPC)
    ↓
Business Logic & AI Integration
    ↓
Database (PostgreSQL + pgvector)
    ↓
GitHub Integration & Vector Embeddings
```

### Key Components

- **Frontend**: Next.js with React Server Components for optimal performance
- **API**: Type-safe tRPC endpoints for seamless client-server communication
- **Database**: PostgreSQL with pgvector extension for vector embeddings
- **AI/ML**: Google Generative AI (Gemini) for code analysis and question answering
- **Code Indexing**: LangChain for GitHub repository loading and document processing

---

## Tech Stack

| Layer              | Technology                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**       | [Next.js 14](https://nextjs.org) • [React](https://react.dev) • [TypeScript](https://www.typescriptlang.org)                      |
| **Styling**        | [Tailwind CSS](https://tailwindcss.com) • [Radix UI](https://www.radix-ui.com)                                                    |
| **API**            | [tRPC](https://trpc.io) • [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)                                   |
| **Database**       | [PostgreSQL](https://www.postgresql.org) • [Prisma ORM](https://www.prisma.io) • [pgvector](https://github.com/pgvector/pgvector) |
| **Authentication** | [Clerk](https://clerk.com)                                                                                                        |
| **AI/ML**          | [Google Generative AI](https://ai.google.dev) • [LangChain](https://js.langchain.com)                                             |
| **Infrastructure** | [Docker](https://www.docker.com)                                                                                                  |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Docker & Docker Compose (for local database)
- GitHub personal access token (for repository indexing)
- Google API key (for AI features)
- Clerk API keys (for authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/athena.git
   cd athena
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/athena"

   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_key

   # Google AI
   GOOGLE_API_KEY=your_key

   # GitHub (optional, for repository indexing)
   GITHUB_TOKEN=your_token
   ```

4. **Start the database**

   ```bash
   ./start-database.sh
   ```

5. **Initialize the database**

   ```bash
   npm run db:push
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── (protected)/    # Protected routes (authenticated users)
│   │   └── dashboard/  # Main dashboard with Q&A and commit tracking
│   ├── api/            # API routes (tRPC)
│   ├── sign-in/        # Authentication pages
│   └── sign-up/
├── components/         # Reusable React components
│   └── ui/            # Radix UI component library
├── hooks/             # Custom React hooks
├── lib/               # Utilities and helpers
│   ├── gemini.ts      # AI integration
│   ├── github.ts      # GitHub API integration
│   └── github-loader.ts # Repository indexing
├── server/            # Backend logic
│   ├── api/           # tRPC routers
│   └── db.ts          # Database client
└── styles/            # Global styles

prisma/
└── schema.prisma      # Database schema
```

---

## How It Works

### 1. **Repository Indexing**

When you connect a GitHub repository, Athena:

- Clones and analyzes all source files
- Generates semantic summaries for each file
- Creates vector embeddings using Google's embedding model
- Stores embeddings in PostgreSQL with pgvector

### 2. **Question Answering**

When you ask a question:

- Your question is converted to a vector embedding
- Semantic search finds the most relevant code files
- Context is sent to Google Gemini AI
- The AI generates a contextual answer with file references

### 3. **Commit Tracking**

- GitHub commit history is automatically synced
- Commits are displayed chronologically on the dashboard
- Integration with project context for better understanding

---

## Database Schema Highlights

- **Users**: User profiles
- **Projects**: GitHub repositories with metadata
- **SourceCodeEmbeddings**: Vector-embedded code files with summaries
- **Commits**: Project commit history
- **Questions**: Cached Q&A responses with file references
- **UserToProject**: Many-to-many relationship for project associations

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbo mode
npm run build           # Build for production
npm start               # Start production server

# Database
npm run db:push         # Sync schema to database
npm run db:generate     # Run migrations
npm run db:studio       # Open Prisma Studio

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run format:check    # Check code formatting
npm run format:write    # Format code with Prettier
npm run check           # Run full type check and lint
```

---

## Authentication

Athena uses [Clerk](https://clerk.com) for secure, enterprise-grade authentication. Features include:

- Social login (Google, GitHub, etc.)
- Email/password authentication
- Multi-factor authentication support
- Session management

---

## Roadmap

- [ ] Team Collaboration: Invite team members and manage collaborative access to projects
- [ ] Credit System: Track and manage API usage with an intuitive credit-based system
- [ ] Advanced code visualization and dependency graphs
- [ ] Code refactoring suggestions powered by AI
- [ ] Custom model fine-tuning
- [ ] Real-time collaboration features
- [ ] Multi-language support optimization
- [ ] CLI tool for local development

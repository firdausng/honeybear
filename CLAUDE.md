# Bikesynergy API - Claude Code Reference

## Project Overview
This is a SvelteKit 5 application deployed on Cloudflare Workers for bike synergy management. It uses TypeScript, Tailwind CSS, and Drizzle ORM with SQLite database.

## Tech Stack
- **Framework**: SvelteKit 5 with TypeScript
- **Styling**: Tailwind CSS 4.0 with plugins (@tailwindcss/forms, @tailwindcss/typography, tailwindcss-animate)
- **Database**: SQLite with Drizzle ORM
- **Authentication**: WorkOS AuthKit
- **Deployment**: Cloudflare Workers
- **Icons**: Phosphor Svelte
- **Forms**: Sveltekit Superforms
- **Validation**: Valibot
- **API**: Hono.js for server routes
- **UI Components**: bits-ui

## Project Structure

### Core Directories
- `src/routes/` - SvelteKit file-based routing
  - `(auth)/` - Protected routes requiring authentication
  - `(anonymous)/` - Public routes (login, etc.)
- `src/lib/` - Shared library code
  - `components/` - Reusable Svelte components
  - `server/` - Server-side logic and handlers
  - `server/auth/` - Authentication related code
  - `server/db/` - Database schema and connection
  - `server/products/` - Product CRUD handlers
  - `server/users/` - User management handlers
  - `server/mock/` - Mock data for development

### Key Files
- `src/app.d.ts` - Global TypeScript definitions and App namespace
- `src/hooks.server.ts` - SvelteKit server hooks for middleware
- `src/lib/server/middleware.ts` - Custom middleware handlers
- `src/lib/server/db/schema.ts` - Drizzle database schema definitions
- `drizzle.config.ts` - Drizzle ORM configuration
- `wrangler.jsonc` - Cloudflare Workers configuration

## Database Schema (Drizzle ORM)

### Tables
- **users**: User accounts with auth fields (id, name, email, password, active, role)
- **products**: Product catalog (id, name, description, sku, status, stock, price, imagePath, isFeatured)
- **categories**: Product categories (id, name, description)
- **product_categories**: Many-to-many relationship between products and categories

### Audit Fields Pattern
All tables include standard audit fields:
- `createdAt`, `updatedAt`, `deletedAt` (timestamps)
- `createdBy`, `updatedBy`, `deletedBy` (user tracking)

## Authentication & Authorization

### WorkOS Integration
- Uses WorkOS AuthKit for authentication
- Session management with sealed cookies
- Automatic token refresh functionality
- Routes protected via middleware in `src/lib/server/middleware.ts`

### Middleware Chain
1. `setupServicesHandler` - Initializes database connection and service handlers
2. `checkSessionHandler` - Validates session and handles authentication

### Protected Route Patterns
- Routes in `(auth)` group require valid session
- Automatic redirect to `/login` for unauthenticated users
- Session refresh with refresh tokens when possible

## Code Conventions

### File Naming
- Server handlers: `actionName.ts` (e.g., `getCatalog.ts`, `addProduct.ts`)
- Svelte components: `kebab-case.svelte` (e.g., `product-form.svelte`)
- Route files: SvelteKit conventions (`+page.svelte`, `+layout.svelte`, `+server.ts`)

### TypeScript Patterns
- Command/Handler pattern for business logic
- Interface definitions in `app.d.ts` under `Client` namespace
- Environment variables typed in Cloudflare bindings

### Component Architecture
- Shared components in `src/lib/components/`
- Modal pattern with overlay backgrounds (`bg-black/20`)
- Form components support both modal and standalone modes via `isModal` prop
- Conditional rendering with `{#if isModal}` blocks instead of snippets

### State Management
- Svelte 5 runes for reactive state
- Local component state for UI interactions
- No global state management library currently used

### Styling Conventions
- Tailwind CSS utility classes
- Consistent spacing and color schemes
- Dark mode ready classes
- Animation support via `tailwindcss-animate`

### API Patterns
- Hono.js routers for API endpoints
- Valibot for request validation
- Command pattern for business operations
- Handler classes injected via middleware

## Important Commands

### Development
- `pnpm dev` - Start development server
- `pnpm check` - TypeScript checking
- `pnpm preview` - Preview production build locally

### Database
- `pnpm db:push` - Push schema changes to database
- `pnpm db:generate` - Generate migration files
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Drizzle Studio

### Deployment
- `pnpm deploy` - Build and deploy to Cloudflare Workers
- `pnpm cf-typegen` - Generate Cloudflare types

## Common Patterns

### Handler Pattern
```typescript
export class ActionNameHandler {
    constructor(private db: Database) {}

    async handle(command: ActionCommand): Promise<Result> {
        // Implementation
    }
}
```

### Component Props Pattern
```typescript
interface Props {
    isModal?: boolean;
    onSubmit?: (data: FormData) => void;
    // Other props
}
```

### Modal Pattern
- Overlay with `bg-black/20` background
- Transition animations using `transition:fade`
- Proper ARIA attributes for accessibility
- Close on overlay click and escape key

### Form Validation
- Sveltekit Superforms with Valibot schemas
- Server-side validation in handlers
- Client-side reactive validation

## Recent Features
- Multi-select functionality in product tables
- Bulk operations (copy, delete) with confirmation modals
- Grid/list view toggle for products
- Breadcrumb navigation
- Smooth animations using Svelte transitions
- Accessibility compliance with proper ARIA attributes

## Notes
- Uses Svelte 5 syntax but avoids `$snippet` (not supported in current version)
- All modals use `transition:` directive for bidirectional animations
- Accessibility warnings addressed with proper `role`, `tabindex`, and `aria-label` attributes
- Session handling includes automatic redirect preservation (can be implemented when needed)
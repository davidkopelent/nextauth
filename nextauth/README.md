# NextAuth.js Demo Repository

A comprehensive demonstration of authentication implementation in Next.js 14+ applications using Auth.js (formerly NextAuth).

## Overview

This repository serves as a practical guide and reference implementation for integrating Auth.js into your Next.js projects. It demonstrates best practices for handling user authentication with multiple providers, session management, protected routes, and more.

## Features

- 🔐 Multiple authentication providers:
  - Credentials (email/password)
  - Google OAuth
- 🚪 Protected routes with middleware
- 🔄 Session management with JWT strategy
- 🧩 Type-safe authentication with TypeScript
- 🖥️ Server-side authentication checks
- 🔌 Server actions for auth operations
- 📊 Database integration with Prisma

## Tech Stack

- Next.js 14+ (App Router)
- Auth.js (NextAuth v5+)
- TypeScript
- Prisma ORM
- bcrypt for password hashing
- Zod for validation

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nextauth-demo.git
cd nextauth-demo

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# OAuth Providers
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Database
DATABASE_URL=your-database-connection-string
```

## Project Structure

```
/
├── auth.config.ts             # Auth.js configuration
├── auth.ts                    # Main Auth.js setup
├── next.config.ts             # Next.js configuration
├── src/
│   ├── app/
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── login/         # Login page
│   │   │   └── signup/        # Signup page
│   │   ├── api/               # API routes
│   │   │   └── auth/          # Auth API endpoints
│   ├── components/            # UI components
│   │   ├── LoginForm.tsx      # Login form component
│   │   └── Input.tsx          # Reusable input component
│   ├── lib/
│   │   ├── auth/              # Auth helpers
│   │   │   └── auth.ts        # Server actions for auth
│   │   ├── prisma.ts          # Prisma client
│   │   └── zod.ts             # Schema validation
│   └── utils/                 # Utility functions
│       ├── db.ts              # Database helpers
│       └── password.ts        # Password utilities
```

## Authentication Flow

### Credentials Provider (Email/Password)

1. User enters email and password in the login form
2. Form data is sent to the server using a server action
3. Credentials are validated against database records
4. If valid, a JWT session is created and the user is redirected

### OAuth (Google)

1. User clicks "Continue with Google" button
2. User is redirected to Google for authentication
3. Upon successful authentication, user is redirected back
4. Auth.js verifies the OAuth response and creates a session
5. If it's a new user, an account is created in the database

## Usage Examples

### Protecting Pages

```typescript
// src/app/protected-page/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Protected content</div>;
}
```

### Client-Side Authentication

```typescript
'use client'
import { useSession } from "next-auth/react";

export default function ProfileButton() {
  const { data: session } = useSession();
  
  if (!session) {
    return <button>Sign In</button>;
  }
  
  return <div>Hello, {session.user.name}</div>;
}
```

### Server-Side Authentication Check

```typescript
// Server Component
import { auth } from '@/auth';

export default async function UserProfile() {
  const session = await auth();
  
  return (
    <div>
      {session ? (
        <p>Welcome, {session.user.name}</p>
      ) : (
        <p>Please login to view your profile</p>
      )}
    </div>
  );
}
```

## Configuration Options

### Session Strategy

The project uses JWT for session management with a 24-hour expiration time:

```typescript
// auth.config.ts
export const authConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  // ...
};
```

### Redirect Options

Customize the redirect behavior in the `authorized` callback:

```typescript
authorized({ auth, request: { nextUrl } }) {
  const isLoggedIn = !!auth?.user;
  const isOnApp = nextUrl.pathname.startsWith('/');
  const isOnLogin = nextUrl.pathname.startsWith('/login');
  
  // Custom redirect logic
}
```

## Learn More

- [Auth.js Documentation](https://authjs.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

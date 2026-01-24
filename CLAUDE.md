# CLAUDE.md - NBA Playoff Predictions App

## Project Overview

This is an **NBA Playoff Predictions** web application built with Next.js and Firebase. Users can create accounts, view NBA playoff matchups, make predictions on series outcomes (4-0, 4-1, 4-2, 4-3), earn points for correct predictions, and compete on a leaderboard.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | ^14.1.0 | React framework with routing and SSR |
| React | ^18.2.0 | UI library |
| Firebase | ^11.4.0 | Authentication & Firestore database |
| Tailwind CSS | ^4.0.9 | Utility-first styling |
| TypeScript | ^5.3.3 | Type support (not strictly enforced) |

## Directory Structure

```
nba/
├── pages/                  # Next.js pages (file-based routing)
│   ├── api/               # API routes
│   │   └── hello.ts       # Sample API endpoint
│   ├── series/            # Dynamic series routes
│   │   └── [id].js        # /series/:id - Series detail page
│   ├── _app.tsx           # Next.js app wrapper
│   ├── index.js           # / - Landing page
│   ├── login.js           # /login - Authentication page
│   └── dashboard.js       # /dashboard - Main predictions dashboard
├── components/            # (MISSING) Shared React components - NEEDS CREATION
├── styles/
│   ├── globals.css        # Tailwind directives and global styles
│   └── Home.module.css    # CSS modules for home page
├── public/                # Static assets
├── firebase.js            # Firebase configuration and initialization
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript config (non-strict mode)
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── postcss.config.js      # PostCSS with Tailwind and Autoprefixer
```

## Key Files and Their Purposes

### Pages
- **`pages/index.js`** - Landing page with auth state detection, login/signup buttons, and "How It Works" section
- **`pages/login.js`** - Handles both signup and login with Firebase Auth; supports `?signup=true` query param
- **`pages/dashboard.js`** - Main dashboard showing playoff series, prediction form, user stats, and leaderboard
- **`pages/series/[id].js`** - Individual series detail view with game results and user prediction

### Firebase Integration
- **`firebase.js`** - Exports `auth` (Firebase Auth) and `db` (Firestore) instances
- Project: `nba-predictions-3b937`

## Commands

```bash
# Development server (port 3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Code Patterns and Conventions

### Authentication Pattern
All protected pages follow this pattern:
```javascript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      router.push('/login');
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, [router]);
```

### State Management
- Local React state with `useState` hooks
- No global state management library
- Firebase Auth state tracked via `onAuthStateChanged`

### Styling Conventions
- Use Tailwind CSS utility classes inline
- Responsive design with `md:` breakpoint prefix
- Status badges use color coding:
  - Upcoming: `bg-gray-200`
  - In Progress: `bg-blue-200 text-blue-800`
  - Completed: `bg-green-200 text-green-800`

### Component Structure
- Each page handles its own data fetching
- Loading states show "Loading..." with centered flex layout
- Error messages displayed in red alert boxes

## Current Development Status

### Working Features
- User registration and login with Firebase Auth
- Landing page with conditional UI based on auth state
- Dashboard with sample playoff series display
- Prediction form UI (local state only)
- Series detail page with game results

### Known Issues / TODO

1. **Missing Components Directory**: The code imports from `../components/Navbar` and `../components/Leaderboard` but the `components/` folder does not exist. These components need to be created:
   - `components/Navbar.js` - Navigation bar with user info and sign out
   - `components/Leaderboard.js` - Leaderboard display component

2. **Firestore Not Connected**: Database operations are commented out in `dashboard.js`. The app uses sample/mock data instead of fetching from Firestore.

3. **No Points Calculation**: User stats show hardcoded values ("Points Earned: 0", "Rank: --")

4. **No Real Playoff Data**: Series data is hardcoded sample data, not fetched from an API or database

## Data Models

### Series Object
```javascript
{
  id: number,
  round: string,          // 'First Round', 'Second Round', etc.
  team1: string,          // e.g., 'Boston Celtics'
  team2: string,          // e.g., 'Miami Heat'
  team1Seed: number,      // 1-8
  team2Seed: number,      // 1-8
  status: string,         // 'upcoming' | 'in_progress' | 'completed'
  result?: string,        // e.g., '4-2' (only if completed)
  startDate: string,      // e.g., 'April 20, 2025'
  games?: [{              // Array of game results
    game: number,
    winner: string,
    score: string
  }]
}
```

### Prediction Object
```javascript
{
  id: string,
  userId: string,         // Firebase Auth UID
  seriesId: number,
  prediction: string,     // e.g., '4-2', '3-4'
  timestamp: Timestamp    // Firestore timestamp
}
```

## Firebase Security Considerations

- Firebase config is exposed in `firebase.js` (client-side config, expected for web apps)
- Firestore security rules should be configured in Firebase Console
- Server-side validation should be implemented for production

## Development Notes

- TypeScript is configured but `strict: false` - JavaScript files are allowed
- ESLint extends `next/core-web-vitals`
- Hosted on Replit (see `.replit` config)
- Dev server binds to `0.0.0.0` for Replit compatibility

## Common Tasks for AI Assistants

### Adding a New Page
1. Create file in `pages/` directory (filename becomes route)
2. Import necessary Firebase modules from `../firebase`
3. Add authentication check with `onAuthStateChanged` if protected
4. Use Tailwind CSS for styling

### Creating Missing Components
Components should be created in `/components/` directory:
```javascript
// components/Navbar.js
export default function Navbar({ user }) {
  // Navigation with user info and sign out button
}
```

### Connecting Firestore
Uncomment and adapt the Firestore code in `dashboard.js`:
```javascript
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// Fetch predictions
const q = query(
  collection(db, "predictions"),
  where("userId", "==", user.uid)
);
const snapshot = await getDocs(q);

// Save prediction
await addDoc(collection(db, "predictions"), {
  userId: user.uid,
  seriesId: selectedSeries.id,
  prediction: prediction,
  timestamp: Timestamp.now()
});
```

## Git Workflow

- Main development happens on feature branches
- Recent commits have been fixing syntax errors in dashboard.js
- Commit messages should be descriptive of changes made

# Job Application Tracker

A responsive web app for tracking job applications. It helps keep the job search process organized by storing applications, statuses, notes and follow-up dates in Firebase Firestore.

The project is intentionally small, but it is built like a real frontend product: typed data model, reusable components, client-side filtering and sorting, Firestore persistence, loading states, error handling and action feedback.

## Project Status

This is a portfolio-focused frontend application. The current version uses Firebase Firestore as the data source and does not include authentication yet.

Current scope:

- Single-page dashboard
- Firestore CRUD for job applications
- Workspace-based Firestore path
- Responsive UI for desktop and mobile
- Local form state for create/edit flows

Planned scope:

- Authentication
- Stronger Firestore security rules
- React Native companion app using the same data model

## Features

### Application Management

- Add new job applications
- Edit existing application details
- Delete applications with confirmation
- Persist all changes in Firebase Firestore
- Keep `createdAt` and `updatedAt` timestamps for application records

### Tracked Fields

Each application stores:

- Company name
- Position
- Location
- Work mode: remote, hybrid or on-site
- Status: saved, applied, interview, rejected or offer
- Applied date
- Follow-up date
- Salary range
- Source
- Notes

### Dashboard and Filtering

- Summary cards for total applications, interviews, rejections and offers
- Text search by company or position
- Filter by application status
- Filter by work mode
- Filter applications with due follow-ups
- Sort by newest, oldest, company name or status

### User Experience

- Responsive dashboard-like layout
- Empty state for an empty Firestore workspace
- Empty state for filters with no matches
- Loading state while Firestore data is being fetched
- Error messages for failed Firestore actions
- Success messages for create, update and delete actions
- Auto-hiding success feedback

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Firebase Firestore

## Project Structure

```txt
app/
  layout.tsx              # Root layout and metadata
  page.tsx                # Main dashboard page and app state orchestration

src/
  components/
    ApplicationCard.tsx   # Single application card with edit/delete actions
    ApplicationForm.tsx   # Create and edit form
    DashboardStats.tsx    # Summary cards
    EmptyState.tsx        # Reusable empty-state component
    Filters.tsx           # Search, filters, sorting and follow-up filter

  lib/
    firebase.ts           # Firebase client configuration

  services/
    application.service.ts # Firestore CRUD functions

  types/
    application.ts        # Application model and labels

  utils/
    applicationStats.ts   # Dashboard stats calculation
    followUp.ts           # Follow-up date helper
```

## Data Model

```ts
type ApplicationStatus = "saved" | "applied" | "interview" | "rejected" | "offer";

type WorkMode = "remote" | "hybrid" | "onsite";

type JobApplication = {
  id: string;
  company: string;
  position: string;
  location: string;
  workMode: WorkMode;
  status: ApplicationStatus;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  salaryRange?: string;
  source?: string;
  notes?: string;
  followUpAt?: string;
};
```

## Firestore Structure

Application documents are stored under a workspace:

```txt
workspaces/{workspaceId}/applications/{applicationId}
```

The current workspace is configured with:

```env
NEXT_PUBLIC_FIREBASE_WORKSPACE_ID=default
```

This structure keeps the data model ready for a future React Native app or authentication-based workspaces.

## Firestore Service

Firestore access is isolated in:

```txt
src/services/application.service.ts
```

The service exposes:

- `getApplications`
- `createApplication`
- `updateApplication`
- `deleteApplication`

The page component uses these functions instead of calling Firebase directly from the UI. This keeps the data layer easier to replace or share with a future mobile app.

Firestore does not accept `undefined` field values, so application data is cleaned before write operations.

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_WORKSPACE_ID=default
```

Firebase values can be copied from Firebase Console under project settings for the web app.

## Firebase Setup

1. Create a Firebase project.
2. Add a web app in Firebase project settings.
3. Copy the web app config into `.env.local`.
4. Create a Firestore database.
5. Use a workspace id such as `default` for local development.

For production, configure Firestore rules before sharing the app publicly.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```txt
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Development Notes

- The app is a client-side Next.js page because it uses interactive local React state and Firebase client SDK calls.
- Form state is local to `ApplicationForm`; the applications list is owned by the page component.
- The same form component is used for both creating and editing applications.
- Firestore is treated as the source of truth; mock and localStorage persistence were removed after Firestore integration.
- The current workspace id can later be replaced by an authenticated user id or team id.

## Roadmap

- Add authentication
- Improve Firestore security rules
- Add a React Native app using the same Firestore data model
- Add dashboard insights and status history
- Add deployment link and screenshots

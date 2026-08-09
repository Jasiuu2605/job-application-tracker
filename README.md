# Job Application Tracker

A responsive web application for tracking job applications from the first saved offer to interviews, rejections, offers and follow-ups.

The project is intentionally compact, but it is built like a real frontend product: typed data model, reusable components, Google authentication, user-scoped Firestore data, client-side filtering and sorting, loading states, empty states, error handling and action feedback.

## Project Status

This is a portfolio-focused frontend application built with Next.js and Firebase.

Current scope:

- Single-page job application dashboard
- Google sign-in with Firebase Authentication
- Firestore CRUD for job applications
- User-scoped Firestore data
- User profile documents stored in Firestore
- Firestore security rules for authenticated access
- Responsive UI for desktop and mobile
- Local form state for create and edit flows

Planned scope:

- Production deployment
- Screenshot and live demo link
- React Native companion app using the same Firebase data model
- Additional dashboard insights and application history

## Features

### Authentication

- Sign in with Google
- Sign out from the app header
- Show authenticated user name and email
- Hide application management UI for signed-out users
- Store a Firestore user profile document after sign-in

### Application Management

- Add new job applications
- Edit existing application details
- Delete applications with confirmation
- Persist all changes in Firebase Firestore
- Keep `createdAt` and `updatedAt` timestamps for application records
- Show success feedback after create, update and delete actions
- Show error feedback when Firestore actions fail

### Tracked Fields

Each job application stores:

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
- Created timestamp
- Updated timestamp

### Dashboard and Filtering

- Summary cards for total applications, interviews, rejections and offers
- Text search by company or position
- Filter by application status
- Filter by work mode
- Filter applications with due follow-ups
- Sort by newest, oldest, company name or status

### User Experience

- Responsive dashboard-like layout
- Authentication-aware empty state
- Empty state for an empty Firestore account
- Empty state for filters with no matches
- Loading state while auth or Firestore data is being checked
- Error messages for failed Firestore actions
- Auto-hiding success messages

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore

## Project Structure

```txt
app/
  layout.tsx               # Root layout and metadata
  page.tsx                 # Main dashboard page and app state orchestration

src/
  components/
    ApplicationCard.tsx    # Single application card with edit/delete actions
    ApplicationForm.tsx    # Create and edit form
    AuthPanel.tsx          # Google sign-in/sign-out UI
    DashboardStats.tsx     # Summary cards
    EmptyState.tsx         # Reusable empty-state component
    Filters.tsx            # Search, filters, sorting and follow-up filter

  hooks/
    useAuthUser.ts         # Firebase auth state listener

  lib/
    firebase.ts            # Firebase client configuration

  services/
    application.service.ts # Firestore CRUD functions for applications
    auth.service.ts        # Google sign-in and sign-out helpers
    user.service.ts        # Firestore user profile upsert

  types/
    application.ts         # Application model, statuses and labels
    userProfile.ts         # Firestore user profile model

  utils/
    applicationStats.ts    # Dashboard stats calculation
    followUp.ts            # Follow-up date helper

firestore.rules            # Firestore security rules
```

## Data Model

### Job Application

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

### User Profile

```ts
type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: string;
  updatedAt: string;
};
```

## Firestore Structure

User profiles are stored as top-level user documents:

```txt
users/{uid}
```

Job applications are stored in a user-owned subcollection:

```txt
users/{uid}/applications/{applicationId}
```

This keeps each user's data isolated and makes the same structure suitable for a future React Native app.

Example:

```txt
users/
  firebaseUserUid/
    displayName
    email
    photoURL
    createdAt
    updatedAt
    applications/
      applicationId/
        company
        position
        status
        appliedAt
        followUpAt
```

## Firestore Service Layer

Firestore access is isolated in:

```txt
src/services/application.service.ts
```

The service exposes:

- `getApplications(userId)`
- `createApplication(userId, application)`
- `updateApplication(userId, application)`
- `deleteApplication(userId, applicationId)`

The page component passes the authenticated Firebase user id into these functions. UI components do not call Firestore directly.

Firestore does not accept `undefined` field values, so application data is cleaned before write operations.

## Authentication Flow

Authentication is handled with Firebase Authentication and Google sign-in.

Flow:

1. User clicks `Sign in with Google`.
2. Firebase opens the Google sign-in popup.
3. `useAuthUser` listens for the auth state change.
4. The app stores the signed-in Firebase user in React state.
5. `upsertUserProfile` creates or updates `users/{uid}` in Firestore.
6. Applications are loaded from `users/{uid}/applications`.
7. Signed-out users see a sign-in empty state and cannot manage applications.

## Firestore Security Rules

The project includes Firestore rules in:

```txt
firestore.rules
```

The rules are designed so that:

- signed-out users cannot read or write data,
- signed-in users can access only their own `users/{uid}` document,
- signed-in users can access only their own `users/{uid}/applications` subcollection,
- user profile documents cannot be deleted from the client.

Rules must also be published in Firebase Console or deployed with Firebase CLI to affect the live database.

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Firebase values can be copied from Firebase Console under project settings for the web app.

## Firebase Setup

1. Create a Firebase project.
2. Add a web app in Firebase project settings.
3. Copy the web app config into `.env.local`.
4. Create a Firestore database.
5. Enable Google sign-in in Firebase Authentication.
6. Publish the Firestore rules from `firestore.rules`.
7. Run the app locally and sign in with Google.

For deployment, add the production domain to Firebase Authentication authorized domains.

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

- The app is a client-side Next.js page because it uses interactive React state and Firebase client SDK calls.
- Firebase config values prefixed with `NEXT_PUBLIC_` are exposed to the browser by design; access control is handled by Firebase Authentication and Firestore rules.
- The applications list is owned by the page component.
- `ApplicationForm` keeps local form state and is reused for both create and edit flows.
- Firestore is treated as the source of truth.
- Mock data and localStorage persistence were removed after Firestore integration.
- The current Firestore structure can be reused by a future React Native app with the same Firebase project.

## Roadmap

- Deploy the app
- Add screenshots and a live demo link
- Add a React Native companion app using the same Firebase data model
- Add dashboard insights and status history
- Add stronger profile management

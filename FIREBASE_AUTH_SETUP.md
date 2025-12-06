# Firebase Authentication Setup

This document outlines the Firebase authentication implementation for the Product Finder app.

## What Was Implemented

### 1. Dependencies Installed
- `firebase` - Core Firebase SDK (web SDK, works with Expo)
- `expo-secure-store` - Secure persistent storage for auth tokens

### 2. Firebase Configuration
**`config/firebase.ts`**
- Initializes Firebase app with environment variables
- Sets up Firebase Auth with Expo SecureStore persistence
- Validates required configuration on startup
- Exports auth instance for app-wide use

**`config/firebasePersistence.ts`**
- Custom persistence adapter for Firebase Auth
- Uses Expo SecureStore (encrypted storage)
- Compatible with Expo Go and bare React Native

### 3. Authentication Context (`contexts/AuthContext.tsx`)
- Manages authentication state globally
- Provides auth methods: `signUp`, `signIn`, `logOut`, `getIdToken`
- Listens to Firebase auth state changes
- Exposes current user and loading state

### 4. Authentication Screens

#### Login Screen (`app/(auth)/login.tsx`)
- Email/password login form
- Loading states and error handling
- Firebase error code translation to user-friendly messages
- Link to signup screen
- Auto-redirect to tabs on successful login

#### Signup Screen (`app/(auth)/signup.tsx`)
- Email/password registration form
- Password confirmation validation
- Client-side email validation
- Firebase error handling
- Link back to login screen

### 5. Protected Routes
- Root index (`app/index.tsx`) redirects based on auth state
- Shows loading spinner while checking authentication
- Redirects to `/login` if not authenticated
- Redirects to `/(tabs)` if authenticated

### 6. Apollo Client Integration (`app/_layout.tsx`)
- Auth link middleware added to Apollo client
- Automatically adds Firebase ID token to all GraphQL requests
- Token added as `Authorization: Bearer <token>` header
- Token refreshed automatically by Firebase

### 7. User Profile & Logout (`app/(tabs)/history.tsx`)
- Displays logged-in user's email
- Sign out button with confirmation dialog
- Redirects to login on logout

## Environment Variables Required

Create a `.env` file with the following Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## How It Works

### Authentication Flow

1. **App Launch**
   - `AuthProvider` initializes and subscribes to auth state
   - Root `index.tsx` shows loading spinner
   - Once auth state is known, user is redirected appropriately

2. **Login Process**
   - User enters email/password on login screen
   - `signIn()` method calls Firebase `signInWithEmailAndPassword`
   - On success, `onAuthStateChanged` fires, updating context
   - User is redirected to main app

3. **API Requests**
   - Apollo auth link intercepts all GraphQL requests
   - Gets current Firebase user's ID token
   - Adds token to request headers
   - Server validates token and identifies user

4. **Logout Process**
   - User taps "Sign Out" button
   - Confirmation dialog appears
   - `logOut()` calls Firebase `signOut()`
   - Auth state changes to null
   - User is redirected to login screen

### Session Persistence

- Firebase Auth uses Expo SecureStore for persistence
- Auth tokens stored in encrypted secure storage
- User stays logged in across app restarts
- Token automatically refreshes before expiration
- No manual token management required
- Works with Expo Go (no native rebuild required)

## Error Handling

### Login/Signup Errors
- `auth/invalid-credential` → "Invalid email or password"
- `auth/email-already-in-use` → "This email is already registered"
- `auth/weak-password` → "Password is too weak"
- `auth/user-disabled` → "This account has been disabled"
- `auth/too-many-requests` → "Too many failed attempts"
- `auth/network-request-failed` → "Network error"

### Token Errors
- Token fetch errors logged to console
- Requests proceed without token (will fail on server if auth required)

## Server-Side Requirements

Your GraphQL server must:

1. Accept `Authorization: Bearer <token>` header
2. Verify Firebase ID token using Firebase Admin SDK
3. Extract user ID/email from verified token
4. Use user context for authorization decisions

Example server-side verification (pseudo-code):
```javascript
const admin = require('firebase-admin');

async function verifyToken(token) {
  const decodedToken = await admin.auth().verifyIdToken(token);
  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
  };
}
```

## Testing

### Manual Testing Checklist
- [ ] Can sign up with new email/password
- [ ] Can log in with existing credentials
- [ ] Invalid credentials show error
- [ ] Weak password rejected on signup
- [ ] User stays logged in after app restart
- [ ] GraphQL requests include auth token
- [ ] Sign out button works
- [ ] Cannot access main app without login

### Test User Creation
```bash
# Use Firebase Console to create test users
# Or use signup screen in the app
```

## Future Enhancements

Potential auth improvements:
- Password reset flow
- Email verification
- Social auth (Google, Apple)
- Biometric authentication
- Multi-factor authentication
- Password strength indicator
- "Remember me" option

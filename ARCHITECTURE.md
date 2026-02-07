# SonicWave Architecture

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx              # Main app layout with navigation
│   └── ProtectedRoute.jsx       # Route protection wrapper
├── context/
│   └── AuthContext.jsx          # Authentication state management
├── pages/
│   ├── LoginPage.jsx            # Login page
│   ├── SignUpPage.jsx           # Sign up page
│   ├── ForgotPasswordPage.jsx   # Password reset page
│   ├── DashboardPage.jsx        # Main dashboard
│   ├── EditorPage.jsx           # TTS editor
│   ├── ProfilePage.jsx          # User profile
│   └── SettingsPage.jsx         # Settings & subscription plans
├── lib/
│   └── supabase.js              # Supabase client initialization
├── App.jsx                      # Main app with routing
└── index.css                    # Global styles
```

## Technology Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Key Features

### Authentication
- Email/password signup and login
- Password reset functionality
- Session management with Supabase Auth
- Protected routes requiring authentication

### Database Schema

**user_profiles**
- Stores user profile information
- Links to Supabase auth.users via foreign key
- Includes subscription tier (free, pro, team)

**projects**
- User TTS projects
- Contains title, description, content, and status
- References user_profiles

**project_audio**
- Generated audio files for projects
- Stores audio URL and metadata
- References projects

**usage_stats**
- Tracks character and audio usage per user
- Monthly aggregation for rate limiting
- References user_profiles

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- Users can only view/edit their own data
- Authenticated users can create projects
- Audio access restricted to project owners
- Usage stats visible only to the user

## Authentication Flow

1. User navigates to app
2. AuthContext checks session on mount
3. If authenticated, user redirected to /dashboard
4. If not authenticated, user redirected to /login
5. ProtectedRoute wrapper ensures unauthorized access is blocked

## Page Routes

- `/login` - Login page
- `/signup` - Sign up page
- `/forgot-password` - Password reset
- `/dashboard` - Main dashboard with projects
- `/editor` - New TTS project editor
- `/editor/:projectId` - Existing project editor
- `/profile` - User profile management
- `/settings` - Subscription and settings

## Styling

Uses Tailwind CSS via CDN with custom Slate color palette:
- Primary: Blue (#3b82f6)
- Background: Slate-950 (#03061b)
- Secondary: Slate-900 (#0f172a)
- Text: Slate-200 to Slate-400

## State Management

- **Auth Context**: Manages authentication state and operations
- **Component State**: Local state for forms and UI
- **Supabase Queries**: Direct database queries via Supabase client

## Error Handling

- Try-catch blocks around all async operations
- User-friendly error messages
- Error states displayed in UI

## Loading States

- Loading spinner during auth session check
- Disabled buttons during form submission
- Loading indicators on API calls

## Deployment Ready

- Build optimization with Vite
- Environment variables for Supabase configuration
- CORS headers configured in Supabase
- Production build output in `dist/` directory

## Next Steps for Enhancement

1. **Payment Integration**: Add Stripe for subscription management
2. **Real TTS API**: Integrate ElevenLabs or OpenAI TTS
3. **File Storage**: Use Supabase Storage for audio files
4. **Email Verification**: Enable email confirmation for signups
5. **Social Auth**: Add Google/GitHub OAuth
6. **Usage Analytics**: Implement comprehensive usage tracking
7. **Admin Dashboard**: Add admin panel for user management

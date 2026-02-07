# SonicWave - Professional TTS SaaS Application

A modern, production-ready Text-to-Speech (TTS) SaaS application built with React, Vite, and Supabase. Features include user authentication, project management, subscription tiers, and real-time audio generation.

## Features

✨ **Core Features**
- User authentication with email/password
- Password reset functionality
- Project-based TTS management
- Multiple voice options
- Audio download functionality
- Subscription tier management (Free, Pro, Team)
- User profile management
- Responsive design for mobile and desktop

🔐 **Security**
- Row Level Security (RLS) on all database tables
- Protected routes requiring authentication
- Secure session management
- Email/password authentication

💾 **Data Management**
- PostgreSQL database with Supabase
- Automatic user profile creation on signup
- Project versioning and management
- Usage tracking and analytics

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/sonicwave.git
cd sonicwave
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create `.env` file with Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start development server
```bash
npm run dev
```

5. Open browser to `http://localhost:5173`

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure and technical documentation.

## Authentication

### Sign Up
- Email validation
- Password strength requirements (minimum 8 characters)
- Automatic user profile creation

### Sign In
- Email/password authentication
- Session persistence
- Auto-redirect to dashboard on successful login

### Password Reset
- Email-based password reset
- Secure token verification via Supabase

## Dashboard

The dashboard displays:
- User's subscription tier
- Project count
- Character usage limits
- List of all user projects
- Quick actions to edit or delete projects

## Editor

Full-featured TTS editor with:
- Project title and description
- Large text input area
- Voice selection dropdown
- Real-time character count
- Audio generation button
- Audio download option
- Project save functionality

## Subscription Tiers

### Free
- 10,000 characters/month
- 2 minutes of audio
- 5 projects maximum
- Basic voices

### Pro ($29/month)
- 500,000 characters/month
- 60 minutes of audio
- Unlimited projects
- Premium voices
- Advanced features

### Team (Custom)
- Unlimited everything
- Team management
- Dedicated support

## Database Schema

### user_profiles
- id (uuid, primary key)
- full_name (text)
- avatar_url (text)
- subscription_tier (text)
- created_at, updated_at (timestamps)

### projects
- id (uuid, primary key)
- user_id (uuid, foreign key)
- title, description (text)
- content (text)
- status (draft, processing, completed)
- created_at, updated_at (timestamps)

### project_audio
- id (uuid, primary key)
- project_id (uuid, foreign key)
- voice_id, audio_url (text)
- duration, file_size (integer)
- created_at (timestamp)

### usage_stats
- id (uuid, primary key)
- user_id (uuid, foreign key)
- characters_used, audio_generated_seconds (integer)
- month (date)
- created_at (timestamp)

## Building for Production

```bash
npm run build
```

Output will be in `dist/` directory ready for deployment.

## Deployment

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

### Vercel
1. Import project from GitHub
2. Environment variables auto-configured from `.env`
3. Deploy with one click

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Next Steps

### Immediate Enhancements
- [ ] Integrate real TTS API (ElevenLabs or OpenAI)
- [ ] Add Stripe payment integration
- [ ] Implement email verification
- [ ] Add social login (Google, GitHub)

### Future Features
- [ ] Batch audio processing
- [ ] Advanced voice customization
- [ ] Audio file browser and management
- [ ] Team collaboration features
- [ ] API access for developers
- [ ] Webhook support for automation

## API Integration Points

Ready for these integrations:
- **ElevenLabs**: Professional voice synthesis
- **OpenAI**: GPT-powered TTS
- **Stripe**: Payment processing
- **SendGrid**: Email notifications
- **AWS S3**: Audio file storage

## Troubleshooting

### Build Failures
Ensure all dependencies are installed:
```bash
npm install
npm run build
```

### Auth Issues
Check Supabase credentials in `.env`
Verify RLS policies in Supabase dashboard

### Database Errors
Review migration status in Supabase
Check table RLS policies

## Code Quality

- ESLint configuration included
- Consistent code style
- Error handling throughout
- Loading states on async operations
- User-friendly error messages

## Contributing

1. Create feature branch
2. Make changes following existing code style
3. Test thoroughly
4. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create issue]
- Email: support@sonicwave.app
- Documentation: [ARCHITECTURE.md](./ARCHITECTURE.md)

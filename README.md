# iterate - The Blueprint for Product Excellence

A Next.js application for testing product management skills through brutal micro-simulations and AI-powered assessments.

## 🚀 Features

- **Interactive PM Games**: Stakeholder Sandwich, Chart-in-10, Assumption Sniper, and more
- **Advanced Analytics**: Dual tracking with Google Analytics 4 and PostHog
- **Supabase Backend**: Waitlist management and game interaction tracking
- **Modern UI**: Glassmorphism design with smooth animations and parallax effects
- **Privacy-Focused**: GDPR compliant analytics with IP anonymization
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Styling**: Tailwind CSS 4 + Custom CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Analytics**: Google Analytics 4 + PostHog
- **Animations**: Framer Motion + React Intersection Observer
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mvpm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Environment Variables**
   Edit `.env.local` with your actual values:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Analytics Configuration
   NEXT_PUBLIC_GA_MEASUREMENT_ID=your_google_analytics_measurement_id
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

   # Application Configuration
   NEXT_PUBLIC_APP_ENV=development
   NEXT_PUBLIC_APP_NAME="iterate - The Blueprint for Product Excellence"
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Feature Flags
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   NEXT_PUBLIC_ENABLE_SUPABASE=true
   NEXT_PUBLIC_ENABLE_DEBUG=false
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup

### Supabase Tables

Create these tables in your Supabase project:

1. **Waitlist Table**
   ```sql
   CREATE TABLE waitlist (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     source TEXT DEFAULT 'landing_page',
     metadata JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

   -- Allow anonymous inserts
   CREATE POLICY "Allow anonymous inserts" ON waitlist
     FOR INSERT TO anon
     WITH CHECK (true);
   ```

2. **Game Interactions Table**
   ```sql
   CREATE TABLE game_interactions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     game_id TEXT NOT NULL,
     action TEXT NOT NULL,
     metadata JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE game_interactions ENABLE ROW LEVEL SECURITY;

   -- Allow anonymous inserts
   CREATE POLICY "Allow anonymous game tracking" ON game_interactions
     FOR INSERT TO anon
     WITH CHECK (true);
   ```

## 📊 Analytics Setup

### Google Analytics 4
1. Create a GA4 property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add it to `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### PostHog
1. Create a PostHog project
2. Get your Project API Key
3. Add it to `NEXT_PUBLIC_POSTHOG_KEY`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Add environment variables in Netlify dashboard

### Manual Deployment
```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── GameCard.js   # Game card component
│   │   ├── EmailForm.js  # Waitlist signup form
│   │   └── CTAButton.js  # Call-to-action button
│   ├── sections/         # Page sections
│   │   ├── HeroSection.js
│   │   ├── GamesSection.js
│   │   └── SignupSection.js
│   └── layout/           # Layout components
│       ├── Header.js     # Navigation header
│       └── Footer.js     # Page footer
├── lib/                  # Utilities and integrations
│   ├── supabase.js      # Supabase client
│   ├── analytics.js     # Analytics wrapper
│   └── config.js        # Configuration management
└── hooks/               # Custom React hooks
    ├── useAnalytics.js  # Analytics tracking hook
    └── useScrollEffects.js # Scroll and animation hooks
```

## 🎮 Game Integration

The platform currently integrates with:
- **Stakeholder Sandwich**: Live demo at demo-mvpm-stakeholder.onrender.com
- **Additional Games**: Coming soon (Chart-in-10, Assumption Sniper, Sprint Simulator)

To add new games:
1. Add game data to `GamesSection.js`
2. Update tracking in analytics
3. Configure game-specific metadata

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Features
- **Analytics Tracking**: Automatic page views, form submissions, game clicks, scroll depth
- **Smooth Scrolling**: Navigation with smooth scroll to sections
- **Animations**: Entrance animations with intersection observer
- **Form Handling**: Email validation and Supabase integration
- **Error Handling**: Graceful fallbacks for all integrations

## 📈 Performance

- **Core Web Vitals**: Optimized for excellent scores
- **Bundle Size**: Code splitting and tree shaking enabled
- **Images**: Next.js Image optimization
- **Caching**: Aggressive caching strategies
- **Analytics**: Privacy-focused with minimal performance impact

## 🔒 Privacy & Security

- **GDPR Compliant**: IP anonymization enabled
- **Security Headers**: XSS protection, frame options, content type sniffing protection
- **Data Minimization**: Only essential data collected
- **Anonymous Tracking**: No personal data required for games

## 🐛 Troubleshooting

### Common Issues

1. **Analytics not working**
   - Check environment variables are set
   - Verify GA4/PostHog configuration
   - Check browser console for errors

2. **Supabase connection issues**
   - Verify Supabase URL and anon key
   - Check RLS policies are configured
   - Ensure tables exist

3. **Build errors**
   - Clear `.next` folder and rebuild
   - Check for missing dependencies
   - Verify environment variables

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

---

**Built with ❤️ for Product Managers who dare to be MVPM**

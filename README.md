# 🔐 Supabase Next.js Authentication Template

A modern, production-ready authentication template built with Next.js 14+, TypeScript, Supabase, and Tailwind CSS. Features email/password authentication and GitHub OAuth with a sleek, dark-themed UI.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🎨 **Modern Dark UI** - Sleek black theme with glass-morphism design
- 📧 **Email/Password Authentication** - Secure email-based signup and login
- 🔗 **GitHub OAuth** - One-click social authentication
- 🔒 **Protected Routes** - Automatic route protection with middleware
- ✅ **Email Verification** - Built-in email confirmation flow
- 🍪 **Cookie-based Sessions** - Secure session management
- 📱 **Fully Responsive** - Works seamlessly on all devices
- ⚡ **Server & Client Components** - Optimized for Next.js App Router
- 🎯 **TypeScript** - Full type safety throughout

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([signup here](https://supabase.com))
- Git installed

### 1. Clone the Repository

```bash
git clone https://github.com/arththakkar1/next-supabase-authentication.git
cd supabase-nextjs-auth-template
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**To get your Supabase credentials:**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**

### 4. Configure Supabase Authentication

#### Enable Email Authentication

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Enable the **Email** provider
3. Configure email templates (optional)

#### Enable GitHub OAuth (Optional)

1. Create a GitHub OAuth App:

   - Go to GitHub **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**
   - **Application name:** Your app name
   - **Homepage URL:** `http://localhost:3000` (for development)
   - **Authorization callback URL:** `https://your-project-ref.supabase.co/auth/v1/callback`
   - Click **Register application**
   - Copy the **Client ID**
   - Generate and copy the **Client Secret**

2. Configure in Supabase:
   - Go to **Authentication** → **Providers**
   - Enable **GitHub** provider
   - Paste your **Client ID** and **Client Secret**
   - Click **Save**

#### Configure URL Settings

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL:** `http://localhost:3000` (for development)
3. Add **Redirect URLs:**
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/confirm`

#### Update Email Templates

1. Go to **Authentication** → **Email Templates**
2. Edit the **Confirm signup** template
3. Update the confirmation URL to:
   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
   ```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts          # OAuth callback handler
│   │   ├── confirm/
│   │   │   └── route.ts          # Email confirmation handler
│   │   ├── error/
│   │   │   └── page.tsx          # Error page
│   │   └── signout/
│   │       └── route.ts          # Sign out handler
│   ├── dashboard/
│   │   └── page.tsx              # Protected dashboard
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── signup/
│   │   └── page.tsx              # Signup page
│   └── page.tsx                  # Home page
├── components/
│   └── auth/
│       ├── SignInForm.tsx        # Sign in component
│       └── SignUpForm.tsx        # Sign up component
├── lib/
│   └── supabase/
│       ├── client.ts             # Client-side Supabase client
│       ├── server.ts             # Server-side Supabase client
│       └── middleware.ts         # Auth middleware helper
├── middleware.ts                 # Next.js middleware
├── .env.local                    # Environment variables
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Middleware Configuration

The middleware automatically handles session refresh. To protect specific routes, update `middleware.ts`:

```typescript
export const config = {
  matcher: [
    "/dashboard/:path*", // Protect dashboard routes
    "/profile/:path*", // Protect profile routes
    // Add more protected routes here
  ],
};
```

## 🎨 Customization

### Styling

The template uses Tailwind CSS with a dark theme. Main colors:

- **Background:** `bg-black`
- **Cards:** `bg-zinc-900`
- **Borders:** `border-zinc-800`
- **Primary:** `bg-blue-600`
- **Text:** `text-white`, `text-zinc-400`

Customize colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',  // Change primary color
      // Add custom colors
    },
  },
}
```

### Authentication Providers

To add more OAuth providers (Google, Discord, etc.):

1. Enable the provider in Supabase Dashboard
2. Update the auth components to include new provider buttons
3. Use the same `signInWithOAuth` pattern:

```typescript
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

## 📚 Key Routes

| Route            | Description        | Protected |
| ---------------- | ------------------ | --------- |
| `/`              | Home page          | No        |
| `/login`         | Sign in page       | No        |
| `/signup`        | Sign up page       | No        |
| `/dashboard`     | User dashboard     | Yes       |
| `/profile`       | User profile       | Yes       |
| `/auth/callback` | OAuth callback     | No        |
| `/auth/confirm`  | Email confirmation | No        |
| `/auth/error`    | Auth error page    | No        |

## 🔒 Security Features

- ✅ Server-side session validation
- ✅ Automatic token refresh
- ✅ Secure cookie management
- ✅ Protected API routes
- ✅ CSRF protection via Supabase
- ✅ Email verification
- ✅ Rate limiting (Supabase built-in)

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Update Supabase URL configuration with your production URL
5. Deploy!

### Update Supabase for Production

1. Go to **Authentication** → **URL Configuration**
2. Update **Site URL** to your production domain
3. Add production **Redirect URLs**:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com/auth/confirm`
4. Update GitHub OAuth callback URL to production domain

## 🐛 Troubleshooting

### Email confirmation not working

- Check that the confirmation URL in email templates is correct
- Verify redirect URLs are configured in Supabase
- Check browser console for errors

### GitHub OAuth not working

- Verify GitHub OAuth callback URL matches Supabase
- Check that Client ID and Secret are correct
- Ensure GitHub OAuth app is not suspended

### Session not persisting

- Clear browser cookies and try again
- Check that middleware is properly configured
- Verify environment variables are set correctly

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 💬 Support

If you have any questions or run into issues, please:

- Check the [Troubleshooting](#-troubleshooting) section
- Open an issue on GitHub
- Consult the [Supabase Discord](https://discord.supabase.com)

---

## 📋 .env.local Template

Create a `.env.local` file in your project root:

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
# Get these values from your Supabase Dashboard:
# https://supabase.com/dashboard/project/YOUR-PROJECT/settings/api

# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Your Supabase anonymous/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx

# ============================================
# OPTIONAL: FOR PRODUCTION
# ============================================
# Only needed if you want different values for production
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

Made with ❤️ using Next.js and Supabase

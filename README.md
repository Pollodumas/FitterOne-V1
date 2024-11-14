# Fitness-App

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Pollodumas/Fitness-App)

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These credentials can be found in your Supabase project settings under Project Settings > API.

## Security Note

- Never commit `.env` files containing real credentials
- Keep your API keys and secrets secure
- Rotate credentials if they have been exposed
- Use environment variables for all sensitive data
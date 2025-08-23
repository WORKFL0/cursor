# Modern Next.js Starter Template

A production-ready Next.js 15 starter template with TypeScript, Tailwind CSS, and Shadcn/ui components.

## 🚀 Features

- **Next.js 15** - The latest version with App Router and Turbopack
- **React 18** - With Server Components and Streaming SSR
- **TypeScript** - Strict type checking for reliable code
- **Tailwind CSS v3** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful and accessible component library
- **ESLint & Prettier** - Code quality and formatting
- **Dark Mode** - Built-in dark mode support
- **SEO Optimized** - Meta tags, Open Graph, and structured data
- **Responsive Design** - Mobile-first approach

## 📦 Tech Stack

- **Framework:** Next.js 15.5.0
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.4.17
- **Components:** Shadcn/ui with Radix UI
- **Icons:** Lucide React
- **Font:** Inter (Google Fonts)
- **Linting:** ESLint 9 with Next.js config
- **Formatting:** Prettier with Tailwind plugin

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd new-project
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
new-project/
├── app/                    # App Router pages and layouts
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── features/         # Feature-specific components
│   └── shared/           # Shared/common components
├── lib/                   # Utility functions and libraries
│   ├── api/              # API client functions
│   ├── utils/            # Helper functions
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── styles/               # Global styles
└── config/               # Configuration files
```

## 🎨 Shadcn/ui Components

This project includes the following Shadcn/ui components:
- Button
- Card
- Input
- Label
- Dialog
- Dropdown Menu
- Navigation Menu
- Separator
- Toast

To add more components:
```bash
npx shadcn add [component-name]
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🔧 Configuration

### TypeScript
The project uses strict TypeScript configuration with additional checks:
- `noUnusedLocals`: true
- `noUnusedParameters`: true
- `noImplicitReturns`: true
- `noUncheckedIndexedAccess`: true

### Tailwind CSS
Custom configuration includes:
- Extended color palette with CSS variables
- Custom animations
- Responsive breakpoints
- Dark mode support

### Environment Variables
See `.env.example` for required environment variables:
- Database configuration
- Authentication secrets
- API keys
- Analytics IDs

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Docker
```bash
docker build -t nextjs-app .
docker run -p 3000:3000 nextjs-app
```

## 📚 Migration Guide

See [MIGRATION_ANALYSIS.md](./MIGRATION_ANALYSIS.md) for detailed migration strategy from existing projects.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

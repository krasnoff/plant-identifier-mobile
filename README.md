# 🌱 Plant Identifier Mobile App

A full-stack mobile application that uses AI to identify plants from photos and provide detailed care information. Built with React Native/Expo and powered by OpenAI's GPT-4o-mini model.

## ✨ Features

- **📸 Real-time Camera**: Capture plant photos with flash control and camera flip
- **🤖 AI-Powered Identification**: Uses OpenAI GPT-4o-mini for accurate plant recognition
- **📚 Detailed Information**: Get comprehensive plant care guides, growing conditions, and toxicity warnings
- **🎨 Modern UI**: Beautiful interface with automatic light/dark theme support
- **📱 Cross-Platform**: Works on iOS, Android, and Web via Expo
- **⚡ Fast Processing**: Optimized image compression for quick API responses

## 🛠 Technology Stack

### Frontend (Mobile App)
- **React Native** 0.81.5 with **React** 19.1.0
- **Expo** 54.0.33 for development and deployment
- **Expo Router** 6.0.23 with file-based routing
- **Expo Camera** 17.0.10 for image capture
- **TypeScript** for type safety

### Backend (API)
- **Node.js** with **Express.js** 5.1.0
- **OpenAI API** integration via @ai-sdk/openai
- **TypeScript** for full-stack type safety
- **Zod** for request validation

### Development & Build Tools
- **pnpm** workspaces for monorepo management
- **Turbo** 2.8.20 for build orchestration
- **ESLint** & **Prettier** for code quality
- **Nodemon** for hot-reload development

### Deployment
- **Render** cloud platform with Docker containerization

## 📁 Project Structure

```
plant-identifier-mobile/
├── apps/
│   ├── mobile/           # React Native/Expo mobile app
│   │   ├── app/          # Expo Router pages
│   │   ├── components/   # Reusable UI components
│   │   ├── assets/       # Images and SVG components
│   │   ├── context/      # React context providers
│   │   └── hooks/        # Custom React hooks
│   └── api/              # Express.js backend API
│       ├── src/
│       │   ├── controllers/  # API route handlers
│       │   └── lib/          # Utility functions
│       └── Dockerfile
├── packages/             # Shared code packages
│   ├── configs/          # Shared configuration
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── package.json          # Root workspace configuration
├── pnpm-workspace.yaml   # pnpm workspace definition
├── turbo.json            # Turbo build pipeline
└── render.yaml           # Deployment configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥18.0.0
- **pnpm** ≥9.0.0
- **OpenAI API Key** (for plant identification)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd plant-identifier-mobile
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:

   **API** (`apps/api/.env`):
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

   **Mobile** (`apps/mobile/.env`):
   ```env
   EXPO_PUBLIC_BASE_URL=http://localhost:3001/api/
   ```

4. **Start development servers**:
   ```bash
   # Start both mobile and API in development mode
   pnpm dev
   
   # Or start individually:
   pnpm --filter=api dev      # API server on port 3001
   pnpm --filter=mobile start # Expo development server
   ```

### Mobile Development

```bash
# Start Expo development server
cd apps/mobile
pnpm start

# Run on specific platforms
pnpm android    # Android emulator/device
pnpm ios        # iOS simulator/device  
pnpm web        # Web browser
```

### API Development

```bash
# Start API server with hot-reload
cd apps/api
pnpm dev

# Build API for production
pnpm build

# Start production server
pnpm start
```

## 📱 Usage

1. **Open the mobile app** and navigate to the search screen
2. **Point camera** at a plant you want to identify
3. **Adjust settings** (flash, camera direction) as needed
4. **Capture photo** by tapping the camera button
5. **View results** with detailed plant information and care instructions

## 🔗 API Endpoints

### Plant Identification
```
POST /api/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "user", 
      "parts": [
        {
          "type": "image",
          "image": "base64_encoded_image"
        }
      ]
    }
  ]
}
```

**Response**: Detailed plant information in markdown format including:
- Common and scientific names
- Growing areas and climate zones  
- Domestic care suitability
- Care instructions and difficulty level
- Toxicity warnings

### Health Check
```
GET /health
```

## 🏗 Development Workflow

### Available Scripts

```bash
# Development
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps for production
pnpm lint         # Lint all code
pnpm format       # Format code with Prettier
pnpm check-types  # Run TypeScript type checking

# Mobile-specific
pnpm --filter=mobile start     # Expo development
pnpm --filter=mobile android   # Android build
pnpm --filter=mobile ios       # iOS build

# API-specific  
pnpm --filter=api dev          # Development with hot-reload
pnpm --filter=api build        # Production build
```

### Code Quality

- **TypeScript** enforces type safety across the entire stack
- **ESLint** ensures consistent code style
- **Prettier** handles automatic formatting
- **Turbo** optimizes build performance through caching

## 🚢 Deployment

### Production Deployment (Render)

The project is configured for deployment on [Render](https://render.com):

1. **Connect repository** to Render
2. **Set environment variables** in Render dashboard:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`
3. **Deploy** using the included `render.yaml` configuration

The API will be available at your Render service URL.

### Mobile App Distribution

```bash
# Build for app stores
cd apps/mobile
pnpm build:android    # Android APK/AAB
pnpm build:ios        # iOS IPA
```

Deploy to app stores using [Expo Application Services (EAS)](https://expo.dev/eas).

## 🌟 Key Features Detail

### Camera Integration
- Real-time camera preview with CameraView
- Flash control and front/back camera switching
- Image compression to 500px width at 0.8 quality
- Base64 encoding for API transmission

### AI Plant Identification
- Integration with OpenAI GPT-4o-mini model
- Structured prompts for consistent response format
- Markdown rendering for rich text display
- Usage tracking and error handling

### User Experience
- Automatic theme switching (light/dark mode)
- Safe area handling for various device sizes
- Keyboard-aware UI interactions
- Loading states and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues

**API Connection Issues**:
- Verify `EXPO_PUBLIC_BASE_URL` points to the correct API endpoint
- Ensure API server is running and accessible
- Check network connectivity in mobile app

**Build Issues**:
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Clear Expo cache: `npx expo install --fix`
- Verify Node.js version ≥18

**OpenAI API Issues**:
- Verify API key is correctly set in environment variables
- Check API key permissions and usage limits
- Monitor API responses for rate limiting

---

Built with ❤️ using React Native, Expo, and OpenAI
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=docs
```

Without global `turbo`:

```sh
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)

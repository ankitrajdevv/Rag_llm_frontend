# RAG LLM - Full Stack Document Intelligence Platform

A powerful full-stack application that allows users to upload PDF documents and ask questions about them using AI-powered document analysis with Google Gemini AI.

![RAG LLM Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://mongodb.com/)
[![Google AI](https://img.shields.io/badge/Google-Gemini%20AI-blue)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

## 🚀 Features

### 🔐 Authentication System
- **Secure Registration & Login** with JWT tokens
- **Password Hashing** using bcrypt
- **Session Management** with persistent login state
- **Protected Routes** for authenticated users only

### 📄 Document Processing
- **PDF Upload** with drag & drop support
- **File Validation** (size, type, format)
- **Document Storage** and management
- **Text Extraction** from PDF files

### 🤖 AI-Powered Chat
- **Google Gemini AI** integration for intelligent responses
- **Context-Aware** answers based on uploaded documents
- **Real-time Chat** interface with typing indicators
- **Chat History** persistence per user
- **Copy to Clipboard** functionality
- **Text-to-Speech** support

### 🎨 Modern UI/UX
- **Responsive Design** for all devices
- **Dark/Light Mode** toggle
- **Glassmorphism** design with particle animations
- **Smooth Transitions** and micro-interactions
- **Loading States** and error handling
- **Toast Notifications** for user feedback

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.1.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB Atlas** - Cloud database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### AI & Services
- **Google Gemini AI** - Large language model
- **Vercel** - Deployment and hosting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

You'll also need accounts for:
- **MongoDB Atlas** (free tier available)
- **Google AI Studio** (for Gemini API key)
- **Vercel** (for deployment - optional)

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/rag-llm-frontend.git
cd rag-llm-frontend
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Setup

Create a `.env.local` file in the root directory:

\`\`\`env
# Google AI API Key (Get from: https://ai.google.dev/)
GOOGLE_API_KEY=your_google_ai_api_key_here

# MongoDB Connection (Get from: https://mongodb.com/atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
MONGODB_DB=your_database_name

# JWT Secret (Generate a random string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# Next.js Auth (for production)
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 4. Set Up MongoDB Atlas

1. **Create Account**: Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. **Create Cluster**: Choose the free tier
3. **Create Database User**: Add username/password
4. **Whitelist IP**: Add your IP address (or 0.0.0.0/0 for development)
5. **Get Connection String**: Copy the connection URI
6. **Update .env.local**: Replace the MONGODB_URI with your connection string

### 5. Get Google AI API Key

1. **Visit**: [Google AI Studio](https://ai.google.dev/)
2. **Create Project**: Set up a new project
3. **Enable API**: Enable the Gemini API
4. **Generate Key**: Create an API key
5. **Update .env.local**: Add your API key

### 6. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
rag-llm-frontend/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/route.ts    # Login API
│   │   │   └── register/route.ts # Registration API
│   │   ├── chat/                 # Chat endpoints
│   │   │   ├── ask/route.ts      # Ask question API
│   │   │   ├── clear/route.ts    # Clear chat API
│   │   │   └── history/route.ts  # Chat history API
│   │   └── upload/route.ts       # File upload API
│   ├── chat/                     # Chat interface
│   │   └── page.tsx              # Main chat page
│   ├── login/                    # Login page
│   │   └── page.tsx              # Login form
│   ├── register/                 # Registration page
│   │   └── page.tsx              # Registration form
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable components
│   ├── ui/                       # UI components
│   ├── cursor-glow.tsx           # Cursor effect
│   ├── particles-background.tsx  # Background animation
│   ├── theme-provider.tsx        # Theme context
│   └── theme-toggle.tsx          # Dark mode toggle
├── lib/                          # Utility functions
│   ├── mongodb.ts                # Database connection
│   ├── auth.ts                   # Authentication utilities
│   └── utils.ts                  # General utilities
├── public/                       # Static assets
├── .env.local                    # Environment variables
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
\`\`\`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### File Management
- `POST /api/upload` - Upload PDF documents

### Chat System
- `POST /api/chat/ask` - Ask questions about documents
- `GET /api/chat/history` - Get user's chat history
- `DELETE /api/chat/clear` - Clear chat history

## 🧪 Testing the Application

### 1. User Registration
\`\`\`bash
# Test with these sample credentials
Username: testuser
Email: test@example.com
Password: password123
\`\`\`

### 2. File Upload
- Upload a PDF file (max 10MB)
- Supported formats: .pdf
- Files are processed and stored

### 3. Chat Functionality
- Ask questions about your uploaded documents
- Get AI-powered responses
- View chat history
- Copy responses to clipboard

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Set Environment Variables**:
   In Vercel dashboard, add:
   - `GOOGLE_API_KEY`
   - `MONGODB_URI`
   - `MONGODB_DB`
   - `JWT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)

4. **Deploy**:
   - Click "Deploy"
   - Your app will be live in minutes!

### Deploy to Other Platforms

The app can also be deployed to:
- **Netlify** (with serverless functions)
- **Railway** (with database)
- **DigitalOcean App Platform**
- **AWS Amplify**

## 🔧 Configuration

### Environment Variables Explained

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GOOGLE_API_KEY` | Google Gemini AI API key | Yes | `AIza...` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://...` |
| `MONGODB_DB` | Database name | Yes | `rag_llm` |
| `JWT_SECRET` | JWT signing secret | Yes | `your-secret-key` |
| `NEXTAUTH_SECRET` | NextAuth secret | Production | `auth-secret` |
| `NEXTAUTH_URL` | App URL | Production | `https://yourapp.com` |

### Customization

#### Change AI Model
Edit `app/api/chat/ask/route.ts`:
\`\`\`typescript
// Change from Gemini to other models
const model = 'gemini-pro'; // or 'gpt-4', 'claude-3', etc.
\`\`\`

#### Modify Upload Limits
Edit `app/api/upload/route.ts`:
\`\`\`typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf'];
\`\`\`

#### Update Styling
- Edit `tailwind.config.ts` for theme colors
- Modify `app/globals.css` for global styles
- Update components in `components/` folder

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
\`\`\`
Error: MongoNetworkError: failed to connect to server
\`\`\`
**Solution**: Check your MongoDB URI and IP whitelist

#### 2. Google AI API Error
\`\`\`
Error: API key not valid
\`\`\`
**Solution**: Verify your Google AI API key and billing setup

#### 3. JWT Token Error
\`\`\`
Error: jwt malformed
\`\`\`
**Solution**: Clear browser localStorage and login again

#### 4. File Upload Error
\`\`\`
Error: File too large
\`\`\`
**Solution**: Check file size (max 10MB) and format (.pdf only)

### Development Issues

#### Port Already in Use
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000
# or use different port
npm run dev -- -p 3001
\`\`\`

#### Module Not Found
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

#### TypeScript Errors
\`\`\`bash
# Check TypeScript configuration
npx tsc --noEmit
\`\`\`

## 📊 Performance Optimization

### Frontend Optimization
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic with Next.js App Router
- **Lazy Loading**: Components loaded on demand
- **Caching**: Static assets cached by Vercel

### Backend Optimization
- **Connection Pooling**: MongoDB connection reuse
- **API Rate Limiting**: Prevent abuse
- **Error Handling**: Graceful error responses
- **Logging**: Comprehensive error logging

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for security
- **Environment Variables**: Sensitive data protection
- **File Upload Security**: Type and size validation

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **MongoDB** for the database solution
- **Google** for the Gemini AI API
- **Radix UI** for accessible components
- **Tailwind CSS** for the styling system

## 📞 Support

If you encounter any issues or have questions:

1. **Check Documentation**: Review this README
2. **Search Issues**: Look through existing GitHub issues
3. **Create Issue**: Open a new issue with details
4. **Community**: Join our Discord/Slack community

## 🚀 What's Next?

Planned features for future releases:

- [ ] **Multi-file Support**: Upload multiple PDFs
- [ ] **Document Comparison**: Compare multiple documents
- [ ] **Export Chat**: Download chat history
- [ ] **Team Collaboration**: Share documents with team
- [ ] **Advanced Search**: Full-text search across documents
- [ ] **API Documentation**: Swagger/OpenAPI docs
- [ ] **Mobile App**: React Native version
- [ ] **Webhook Support**: Integration with other services

---

**Happy Coding! 🎉**

For more information, visit our [documentation](https://your-docs-url.com) or [live demo](https://your-demo-url.com).

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ankitdev/v0-rag-llm)
[![Built with v0](https://img.shields.io/badge/Built%20with%20v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/ENIpVJi2YVo)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/ankitdev/v0-rag-llm](https://vercel.com/ankitdev/v0-rag-llm)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/ENIpVJi2YVo](https://v0.dev/chat/projects/ENIpVJi2YVo)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

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

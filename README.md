# Gathera App

![Gathera App Banner](assets/banner.png) <!-- Replace with your banner image -->

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.0-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.0-black?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![LiveKit](https://img.shields.io/badge/LiveKit-Realtime-orange?style=for-the-badge&logo=livekit&logoColor=white)](https://livekit.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

<p align="center">
  <strong>A Real-time Video Calling & Chat Application built for seamless virtual interactions.</strong>
</p>

<p align="center">
  <a href="#about-the-project">About</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#system-architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## 📖 About the Project

**Gathera App** is a platform for building virtual communities. Whether you're hosting a remote team meeting or a casual hangout with friends, Gathera provides the necessary tools.

Gathera leverages **LiveKit** for low latency audio and video streaming. The application is built separating the Frontend (Next.js) from the Backend (Node.js/Express).

## ✨ Key Features

### 🎥 Video Conferencing
- **High-Definition Audio & Video**: Communication powered by WebRTC and LiveKit's infrastructure.
- **Screen Sharing**: Effortlessly share your screen for presentations or collaborative work.
- **Responsive Layouts**: The UI automatically adjusts to the number of participants.

### 💬 Real-Time Chat
- **Instant Messaging**: Built-in chat functionality allows participants to send messages in real-time alongside the video stream.
- **WebSocket Integration**: Ensures messages are delivered instantly.

### 🏠 Room Management
- **Custom Rooms**: Users can create their own rooms with unique, shareable links.
- **Dashboard**: A personal dashboard to view your created rooms.

### 👤 Authentication
- **Secure Sign-Up/Login**: Full authentication system using JWT (JSON Web Tokens) and bcrypt for password hashing.

## 🏗️ System Architecture

The application is split into two main components:

1.  **Frontend (Client)**: Built with **Next.js 16 (App Router)**, it handles the user interface, video rendering, and state management. It communicates with the backend via REST APIs for authentication/room management and WebSockets for chat.
2.  **Backend (Server)**: Built with **Node.js & Express**, it manages the business logic, connects to the **PostgreSQL** database via **Prisma ORM**, handles WebSocket connections for chat, and orchestrates LiveKit tokens for video sessions.

**Data Flow:**
- **User Auth**: Frontend -> API -> Database (PostgreSQL)
- **Video/Audio**: Frontend <-> LiveKit Server <-> Other Peers
- **Chat**: Frontend <-> WebSocket Server <-> Database

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS, Radix UI
- **State Management**: React Hooks
- **Real-time**: LiveKit Client SDK, WebSocket
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon Tech / Local)
- **ORM**: Prisma
- **Real-time**: LiveKit Server SDK, native `ws` (WebSocket)
- **Authentication**: JWT, BCrypt, Cookie Parser
- **Validation**: Zod

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **PostgreSQL** Database (Local or Cloud like Neon/Supabase)
- **LiveKit Account** (for API Key and Secret)

### Installation Guide

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/gathera-app.git
cd gathera-app
```

#### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder with the following variables:
```env
PORT=3001
FRONTEND_URL="http://localhost:3000"
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
JWT_SECRET="your-super-secret-key"

# LiveKit Configuration
LIVEKIT_URL="wss://your-project.livekit.cloud"
LIVEKIT_API_KEY="your-api-key"
LIVEKIT_API_SECRET="your-api-secret"
```

Run database migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:3001
```

#### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` (or `.env.local`) file in the `frontend` folder:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_WS_URL="ws://localhost:3001"
```

Start the frontend development server:
```bash
npm run dev
# App runs on http://localhost:3000
```

### 4. Verify Installation
Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the landing page. Sign up for an account, create a room, and test the video/chat functionality.

## 📸 Screenshots

<!-- Add your screenshots here. You can drag and drop images into the 'assets' folder and reference them below. -->

| Dashboard | Video Room |
|:---:|:---:|
| ![Dashboard](assets/dashboard_placeholder.png) | ![Video Room](assets/video_room_placeholder.png) |

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by <strong>Karan Narania</strong>
</p>

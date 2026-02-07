<div align="center">

# 🚀 BRISE

---

**BRISE** is a next-generation blockchain platform designed to revolutionize how users interact with decentralized finance. This repository contains the official early-access waitlist application — your gateway to the future.


</div>

---

## ✨ What is BRISE?

BRISE is more than just a crypto project — it's a movement. We're building infrastructure that empowers users to take control of their financial future through:

- 🔐 **Security First** — Enterprise-grade security with cutting-edge encryption
- 💎 **Early Adopter Rewards** — Exclusive benefits for our founding community

---

## 🎯 Features

### 🎫 Early Access Waitlist
Join our exclusive waitlist and secure your spot among the first users to experience BRISE.

| Feature | Description |
|---------|-------------|
| **Email Verification** | Secure OTP-based verification system |
| **Referral System** | Invite friends and climb the priority ladder |
| **Leaderboard** | Track your rank among other early adopters |
| **Dashboard** | Personal dashboard to manage your waitlist status |

### 🔗 Referral Program
Every user gets a unique referral code. Share it, and when someone joins using your link:
- ✅ Your priority ranking improves
- ✅ You unlock exclusive perks
- ✅ You become part of our ambassador network

### 📊 Real-time Leaderboard
See where you stand. The more referrals you bring, the higher you climb!

---

## 🛠️ Tech Stack

We use modern, battle-tested technologies to ensure the best experience:

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16 (App Router) | Server-side rendering & routing |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **Database** | Supabase (PostgreSQL) | Scalable & secure data storage |
| **Auth** | Supabase Auth + OTP | Passwordless authentication |
| **Animations** | Framer Motion | Smooth, professional animations |
| **3D Graphics** | React Three Fiber | Immersive visual experiences |
| **Email** | Resend | Transactional email delivery |
| **Rate Limiting** | Upstash Redis | API protection & rate limiting |
| **Blockchain** | Wagmi + Viem *(Coming Soon)* | Web3 integration |

---

## 📁 Project Structure

```
brise-project/
├── 📂 blockchain/           # Smart contracts & Web3 backend
│   ├── contracts/           # Solidity smart contracts
│   ├── scripts/             # Deployment scripts
│   └── tests/               # Contract test suites
│
├── 📂 public/               # Static assets (images, fonts)
│
├── 📂 src/
│   ├── 📂 app/              # Next.js App Router pages
│   │   ├── api/             # Backend API routes
│   │   │   ├── auth/        # Authentication endpoints
│   │   │   ├── waitlist/    # Waitlist registration
│   │   │   ├── lookup/      # User lookup service
│   │   │   └── newsletter/  # Email subscriptions
│   │   ├── dashboard/       # User dashboard
│   │   ├── leaderboard/     # Public leaderboard
│   │   ├── waitlist/        # Waitlist registration page
│   │   ├── whitepaper/      # Project documentation
│   │   └── ...
│   │
│   ├── 📂 components/       # Reusable UI components
│   │   └── web3/            # Blockchain-specific components
│   │
│   ├── 📂 hooks/            # Custom React hooks
│   │
│   └── 📂 config/           # App configuration (coming soon)
│
├── .env.example             # Environment variables template
├── package.json             # Dependencies & scripts
└── README.md                # You are here! 👋
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** or **pnpm** package manager
- A **Supabase** account (free tier works!)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/brise-project.git
   cd brise-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your credentials:
   ```env
   

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000]🎉

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

---

## 🗺️ Roadmap

- [x] 🎫 Waitlist & Referral System
- [x] 📧 Email Verification (OTP)
- [x] 📊 Leaderboard
- [x] 📄 Whitepaper Page
- [ ] 🔗 Wallet Connection (Web3)
- [ ] 🪙 Token Integration
- [ ] 📱 Mobile Optimization
- [ ] 🌐 Multi-language Support

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's:

- 🐛 Bug reports
- 💡 Feature suggestions  
- 🔧 Code contributions

Please read our contribution guidelines before submitting a PR.

---

## 📄 License

This project is proprietary software. All rights reserved.

---

<div align="center">

### 💎 Join the Revolution

Be among the first to experience the future of finance.

[**Join the Waitlist →**](#)

---

Made with ❤️ by the BRISE Team

</div>

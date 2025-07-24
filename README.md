# 🥊 ChogPunch - Farcaster Miniapp

A fun Farcaster miniapp game where players control Chog (the Monad mascot) to punch, kick, and push a punching bag. After 20 hits, players can claim 1 MON token reward (limited to first 100 players).

## 🎮 Game Features

- **Three Combat Moves**: Punch 👊, Kick 🦵, and Push 🤚
- **Animated Chog Character**: Different sprites for each action
- **Hit Counter**: Track progress toward the 20-hit requirement
- **MON Token Rewards**: Claim 1 MON after completing 20 hits
- **Smart Contract Integration**: Secure reward distribution via Base network
- **Beautiful UI**: Light purple theme with smooth animations

## 🛠 Tech Stack

- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Wagmi** for Ethereum wallet connection
- **Viem** for blockchain interactions
- **Farcaster Miniapp Connector** for seamless integration
- **React Query** for data fetching

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Farcaster account for testing
- Base network wallet (MetaMask recommended)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd chogpunch-miniapp
   npm install
   ```

2. **Add Chog sprites**
   
   Add these image files to the `/public/` folder:
   - `chog-idle.png` - Chog standing (240x240px)
   - `chog-punch.png` - Chog punching side pose (240x240px)  
   - `chog-kick.png` - Chog doing kick move (240x240px)
   - `chog-push.png` - Chog pushing forward (240x240px)

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🎯 Game Flow

1. **Player opens miniapp** → Game loads with Chog character
2. **Choose combat move** → Click Punch/Kick/Push buttons  
3. **Watch animations** → Chog performs move, hit counter increases
4. **Track progress** → Hit counter shows progress toward 20
5. **Claim reward** → After 20 hits, claim 1 MON token
6. **Smart contract** → `signUp()` function triggers on Base network
7. **Backend processes** → First 100 players receive MON

## 📄 Smart Contract

The game interacts with a smart contract deployed on Base network:

```solidity
// Contract Address: 0x76a607429bb5290e6c1ca1fad2e00fa8c2f913df
function signUp() external // Claims eligibility for MON reward
```

## 🎨 UI Components

### Game Arena
- Gradient background with visual effects
- Chog character with animation states
- Punching bag that reacts to hits

### Controls
- Three action buttons (Punch, Kick, Push)
- Hit counter display
- Claim button (appears after 20 hits)

### States
- Wallet connection prompts
- Loading animations during claiming
- Success messages after claiming

## 📱 Responsive Design

- **Desktop**: Full-size animations and horizontal layout
- **Tablet**: Scaled components with touch optimization
- **Mobile**: Compact design with vertical stacking

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x76a607429bb5290e6c1ca1fad2e00fa8c2f913df
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

### Tailwind Config

The app uses a custom Tailwind configuration with light purple theme:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy Smart Contract
```bash
# Deploy to Base network using your preferred method
# Update CONTRACT_ADDRESS in pages/index.tsx
```

## 🎮 How to Play

1. **Connect your wallet** when prompted
2. **Click action buttons** to make Chog attack the punching bag
3. **Watch the animations** as Chog performs different moves
4. **Track your progress** with the hit counter (X/20)
5. **Claim your reward** once you reach 20 hits
6. **Enjoy your MON tokens** (limited to first 100 players)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monad Team** for the Chog mascot
- **Farcaster Team** for the miniapp framework
- **Base Team** for the L2 infrastructure

---

**Made with ❤️ for the Farcaster and Monad communities**
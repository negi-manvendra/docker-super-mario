# Super Mario Mimic - Professional Retro Edition

A high-fidelity Super Mario Bros tribute built with TypeScript and HTML5 Canvas. This "Professional Edition" features advanced physics, parallax backgrounds, and a Neo-Retro UI with CRT scanline effects.

## 🎮 Key Features

### 🕹️ Professional Physics Engine
- **Momentum-Based Movement**: Acceleration and deceleration curves for a weightier, authentic feel.
- **Variable Jump Height**: Jump height is determined by how long the spacebar is held, allowing for precision platforming.
- **Snappier Response**: Optimized gravity and collision detection for a tight, professional "game feel."

### 🎨 Advanced Visuals & UI
- **Parallax Backgrounds**: Multi-layered backgrounds (mountains and clouds) that move at different speeds for depth.
- **CRT Scanline Effect**: A CSS-powered CRT filter and pixel-grid overlay for true retro immersion.
- **Neo-Retro UI**: Professional HUD using the 'Press Start 2P' font, featuring padded scores and "World 1-1" formatting.
- **Dynamic Animations**: Frame-rate independent animations that scale with movement speed.

### 🏗️ Modern Architecture
- **Multi-Stage Docker**: Production-optimized Nginx serving for minimal image size.
- **Docker Compose**: Single-command orchestration for development and deployment.
- **TypeScript Core**: Fully typed game logic and entity management.

## 🏗️ Project Structure

```
├── src/
│   ├── game/
│   │   ├── entities/          # Player, Enemy, Coin, Platform logic
│   │   ├── Game.ts            # Central game controller
│   │   ├── GameRenderer.ts    # Advanced Canvas rendering system
│   │   ├── SoundManager.ts    # Web Audio API implementation
│   │   └── CollisionDetector.ts # AABB physics collision system
│   ├── styles/
│   │   └── game.css           # CRT effects and Retro UI styling
│   └── main.ts                    # Application entry point
├── Dockerfile                 # Multi-stage production config
├── docker-compose.yml         # Container orchestration
└── index.html                 # Main layout and UI structure
```

## 🚀 Getting Started

### Prerequisites
- **Docker** and **Docker Compose** (Recommended)
- OR **Node.js 20+**

### Option 1: Quick Start with Docker (Recommended)

1. **Start the container:**
   ```bash
   docker compose up -d
   ```

2. **Access the game:**
   Open `http://localhost:8080` in your browser.

3. **Stop the game:**
   ```bash
   docker compose down
   ```

### Option 2: Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```

## 🎮 Controls

- **ARROW LEFT/RIGHT**: Move Mario (with momentum)
- **SPACEBAR**: Jump (Hold longer for higher jumps)
- **R**: Restart game

## 🐳 Docker Deployment Details

The project utilizes a **Multi-Stage Docker Build**:
1. **Stage 1 (Node.js)**: Compiles TypeScript and builds the Vite production bundle.
2. **Stage 2 (Nginx)**: Serves the static assets via a lightweight Alpine Nginx server.

This ensures the final production image is extremely small (~20MB) and highly secure.

## 📝 License

This project is created for educational purposes. Super Mario Bros is a trademark of Nintendo.
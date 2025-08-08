import React, { useEffect, useRef } from 'react';

// Endless runner with Dino-style obstacles
// Uses a pixelated version of /public/chog.png rendered to a low-res buffer and scaled up

interface KeysState {
  jump: boolean;
}

interface PlayerState {
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  onGround: boolean;
  isDead: boolean;
  animFrame: number;  // Current animation frame
  animTime: number;   // Animation timer
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'cactus' | 'block';
}

const VIRTUAL_WIDTH = 320;
const VIRTUAL_HEIGHT = 180;
const GROUND_Y = VIRTUAL_HEIGHT - 28;

const GRAVITY = 0.5;  // Increased from 0.35 for more realistic fall
const JUMP_VELOCITY = -8.5;  // Adjusted for better jump arc
const MAX_FALL_SPEED = 12;  // Cap fall speed for better control

export const PlatformerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // Resize to fit while keeping integer scaling
    const resize = () => {
      const scaleX = Math.floor(window.innerWidth / VIRTUAL_WIDTH) || 1;
      const scaleY = Math.floor(window.innerHeight / VIRTUAL_HEIGHT) || 1;
      const scale = Math.max(1, Math.min(scaleX, scaleY));
      canvas.width = VIRTUAL_WIDTH * scale;
      canvas.height = VIRTUAL_HEIGHT * scale;
    };
    resize();
    window.addEventListener('resize', resize);

    // Offscreen low-res buffer
    const off = document.createElement('canvas');
    off.width = VIRTUAL_WIDTH;
    off.height = VIRTUAL_HEIGHT;
    offscreenRef.current = off;
    const octx = off.getContext('2d')!;

    // Inputs (only jump)
    const keys: KeysState = { jump: false };
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'w' || k === 'arrowup') keys.jump = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'w' || k === 'arrowup') keys.jump = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Touch jump button
    const mobileControls = document.createElement('div');
    mobileControls.style.position = 'absolute';
    mobileControls.style.left = '0';
    mobileControls.style.right = '0';
    mobileControls.style.bottom = '16px';
    mobileControls.style.display = 'flex';
    mobileControls.style.justifyContent = 'center';
    mobileControls.style.pointerEvents = 'auto';
    const jumpBtn = document.createElement('div');
    jumpBtn.textContent = '⤴';
    jumpBtn.style.width = '84px';
    jumpBtn.style.height = '84px';
    jumpBtn.style.borderRadius = '14px';
    jumpBtn.style.display = 'flex';
    jumpBtn.style.alignItems = 'center';
    jumpBtn.style.justifyContent = 'center';
    jumpBtn.style.background = 'rgba(0,0,0,0.35)';
    jumpBtn.style.color = '#ffd54a';
    jumpBtn.style.fontWeight = 'bold';
    jumpBtn.style.fontSize = '28px';
    jumpBtn.style.backdropFilter = 'blur(6px)';
    jumpBtn.style.userSelect = 'none';
    jumpBtn.style.touchAction = 'none';
    mobileControls.appendChild(jumpBtn);

    const bindTouch = (el: HTMLElement, on: () => void, offFn: () => void) => {
      el.addEventListener('touchstart', (e) => { e.preventDefault(); on(); }, { passive: false });
      el.addEventListener('touchend', (e) => { e.preventDefault(); offFn(); }, { passive: false });
      el.addEventListener('touchcancel', (e) => { e.preventDefault(); offFn(); }, { passive: false });
    };
    bindTouch(jumpBtn, () => (keys.jump = true), () => (keys.jump = false));

    const maybeShowControls = () => {
      if (window.innerWidth < 640) {
        if (!document.body.contains(mobileControls)) document.body.appendChild(mobileControls);
      } else if (document.body.contains(mobileControls)) {
        document.body.removeChild(mobileControls);
      }
    };
    maybeShowControls();
    window.addEventListener('resize', maybeShowControls);

    // Player
    const player: PlayerState = {
      x: 56,
      y: GROUND_Y - 18,
      vy: 0,
      width: 18,
      height: 18,
      onGround: true,
      isDead: false,
      animFrame: 0,
      animTime: 0,
    };

    // Pixelated character image cache
    const srcImg = new Image();
    srcImg.src = '/chog.png';
    let tinyCanvas: HTMLCanvasElement | null = null;

    const buildPixelated = () => {
      if (!srcImg.complete) return;
      const size = 18; // target low-res size
      const tc = document.createElement('canvas');
      tc.width = size;
      tc.height = size;
      const tctx = tc.getContext('2d')!;
      tctx.imageSmoothingEnabled = false;

      // Draw the center-square crop of the source image into tiny canvas
      const minSide = Math.min(srcImg.width, srcImg.height);
      const sx = (srcImg.width - minSide) / 2;
      const sy = (srcImg.height - minSide) / 2;
      tctx.clearRect(0, 0, size, size);
      tctx.drawImage(srcImg, sx, sy, minSide, minSide, 0, 0, size, size);
      tinyCanvas = tc;
    };

    if (srcImg.complete) buildPixelated(); else srcImg.onload = buildPixelated;

    // World
    let speed = 3.0; // world scroll speed - increased base speed slightly
    let score = 0;
    let highScore = 0;
    let spawnTimer = 0;
    const obstacles: Obstacle[] = [];

    // Utilities
    const spawnObstacle = () => {
      // Random cactus-like obstacles of various sizes
      const baseH = 16 + Math.floor(Math.random() * 16);
      const width = 10 + Math.floor(Math.random() * 8);
      const type: Obstacle['type'] = Math.random() < 0.8 ? 'cactus' : 'block';
      obstacles.push({
        x: VIRTUAL_WIDTH + 8,
        y: GROUND_Y - baseH,
        w: width,
        h: baseH,
        type,
      });
    };

    const reset = () => {
      player.y = GROUND_Y - player.height;
      player.vy = 0;
      player.onGround = true;
      player.isDead = false;
      player.animFrame = 0;
      player.animTime = 0;
      obstacles.length = 0;
      speed = 3.0;  // Reset to base speed
      score = 0;
      spawnTimer = 0;
      worldDistance = 0;  // Reset world scroll
    };

    // Initial reset
    reset();

    // Game loop
    let raf = 0;
    let last = performance.now();

    const update = (dtMs: number) => {
      const dt = Math.min(50, dtMs) / 16.6667; // normalize to 60fps units
      if (!player.isDead) {
        // world speed ramps up slightly
        speed += 0.0003 * dt;  // Reduced from 0.0008 * dtMs
        score += speed * 0.01 * dt;  // Adjusted score accumulation
        
        // Update running animation
        if (player.onGround) {
          player.animTime += dtMs;
          const FRAME_TIME = 100; // milliseconds per frame
          if (player.animTime >= FRAME_TIME) {
            player.animTime -= FRAME_TIME;
            player.animFrame = (player.animFrame + 1) % 4; // 4 frame run cycle
          }
        } else {
          // In air - use jump frame
          player.animFrame = 1;
          player.animTime = 0;
        }
      } else {
        // Dead - freeze animation
        player.animFrame = 0;
      }

      // Jumping
      if (keys.jump && player.onGround && !player.isDead) {
        player.vy = JUMP_VELOCITY;
        player.onGround = false;
      }

      // Gravity
      player.vy += GRAVITY * dt;
      if (player.vy > MAX_FALL_SPEED) player.vy = MAX_FALL_SPEED;
      player.y += player.vy * dt;  // Removed * 3 multiplier

      // Ground collision
      if (player.y + player.height >= GROUND_Y) {
        player.y = GROUND_Y - player.height;
        player.vy = 0;
        player.onGround = true;
      }

      // Spawn obstacles
      if (!player.isDead) {
        spawnTimer -= dtMs;
        if (spawnTimer <= 0) {
          spawnObstacle();
          const nextIn = 750 + Math.random() * 900; // ms
          spawnTimer = nextIn / (1 + (speed - 2) * 0.15);
        }
      }

      // Move obstacles and cull
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= speed * dt;  // Removed * 3 multiplier
        if (o.x + o.w < -20) obstacles.splice(i, 1);
      }

      // Collisions
      const px1 = player.x;
      const py1 = player.y;
      const px2 = player.x + player.width;
      const py2 = player.y + player.height;
      for (const o of obstacles) {
        const ox1 = o.x;
        const oy1 = o.y;
        const ox2 = o.x + o.w;
        const oy2 = o.y + o.h;
        if (px2 > ox1 && px1 < ox2 && py2 > oy1 && py1 < oy2) {
          player.isDead = true;
          highScore = Math.max(highScore, Math.floor(score));
          break;
        }
      }
    };

    const drawSky = (g: CanvasRenderingContext2D) => {
      const grd = g.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
      grd.addColorStop(0, '#1b1745');
      grd.addColorStop(1, '#2b356b');
      g.fillStyle = grd;
      g.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      // distant stars
      g.fillStyle = '#c7d2ff22';
      for (let i = 0; i < 40; i++) {
        const x = (i * 77) % VIRTUAL_WIDTH;
        const y = ((i * 53) % (GROUND_Y - 40));
        g.fillRect((x + i * 7) % VIRTUAL_WIDTH, y, 1, 1);
      }
    };

    const drawGround = (g: CanvasRenderingContext2D, t: number) => {
      // Scrolling ground tiles
      for (let i = -2; i < Math.ceil(VIRTUAL_WIDTH / 16) + 2; i++) {
        const x = (Math.floor(t / 16) + i) * 16 - (t % 16);
        g.fillStyle = '#6b3f22';
        g.fillRect(x, GROUND_Y, 16, 8);
        g.fillStyle = '#84512b';
        g.fillRect(x + 1, GROUND_Y + 1, 14, 3);
        g.fillStyle = '#3f2414';
        g.fillRect(x + 1, GROUND_Y + 4, 14, 10);
      }
    };

    const drawObstacle = (g: CanvasRenderingContext2D, o: Obstacle) => {
      if (o.type === 'cactus') {
        g.fillStyle = '#2f6f3a';
        g.fillRect(o.x, o.y, o.w, o.h);
        g.fillStyle = '#3f8f4a';
        g.fillRect(o.x + 1, o.y + 1, o.w - 2, 2);
        g.fillStyle = '#1f4c26';
        g.fillRect(o.x + 1, o.y + 3, o.w - 2, o.h - 4);
      } else {
        g.fillStyle = '#6d6d6d';
        g.fillRect(o.x, o.y, o.w, o.h);
        g.fillStyle = '#8b8b8b';
        g.fillRect(o.x + 1, o.y + 1, o.w - 2, 2);
        g.fillStyle = '#4a4a4a';
        g.fillRect(o.x + 1, o.y + 3, o.w - 2, o.h - 4);
      }
    };

    const drawPlayer = (g: CanvasRenderingContext2D, bobPhase: number) => {
      const px = Math.floor(player.x);
      const py = Math.floor(player.y);  // Removed bob effect for cleaner animation
      
      // Draw base character
      if (tinyCanvas) {
        // Draw pixelated sprite
        g.imageSmoothingEnabled = false;
        g.drawImage(tinyCanvas, px, py, player.width, player.height);
      } else {
        // Fallback: simple placeholder
        g.fillStyle = '#6b46c1';
        g.fillRect(px, py, player.width, player.height);
        g.fillStyle = '#fbe7c6';
        g.fillRect(px + 3, py + 4, 8, 7);
      }
      
      // Draw running animation (legs)
      if (player.onGround && !player.isDead) {
        g.fillStyle = '#2a1f5e'; // Dark color for legs
        
        // Different leg positions for each frame
        switch (player.animFrame) {
          case 0: // Left leg forward, right leg back
            g.fillRect(px + 4, py + 14, 3, 4);  // Left leg
            g.fillRect(px + 10, py + 15, 3, 3); // Right leg
            break;
          case 1: // Both legs together (mid-stride)
            g.fillRect(px + 6, py + 14, 3, 4);  // Left leg
            g.fillRect(px + 8, py + 14, 3, 4);  // Right leg
            break;
          case 2: // Right leg forward, left leg back
            g.fillRect(px + 10, py + 14, 3, 4); // Right leg
            g.fillRect(px + 4, py + 15, 3, 3);  // Left leg
            break;
          case 3: // Both legs together (other mid-stride)
            g.fillRect(px + 7, py + 14, 3, 4);  // Center legs
            break;
        }
      } else if (!player.onGround) {
        // Jump pose - legs spread
        g.fillStyle = '#2a1f5e';
        g.fillRect(px + 3, py + 13, 3, 5);  // Left leg
        g.fillRect(px + 11, py + 13, 3, 5); // Right leg
      }

      // small outline for readability
      g.strokeStyle = '#00000066';  // Semi-transparent outline
      g.lineWidth = 1;
      g.strokeRect(px - 0.5, py - 0.5, player.width + 1, player.height + 1);
    };

    let timeAccum = 0;
    let worldDistance = 0;  // Track total distance scrolled

    const render = () => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      update(dt);
      timeAccum += dt * (speed * 0.03);
      
      if (!player.isDead) {
        worldDistance += speed * (dt / 16.6667);  // Accumulate distance based on speed
      }

      // Clear offscreen
      octx.imageSmoothingEnabled = false;
      octx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      drawSky(octx);
      drawGround(octx, worldDistance);  // Use accumulated distance

      // Obstacles
      for (const o of obstacles) drawObstacle(octx, o);

      // Player
      drawPlayer(octx, timeAccum * 0.2);

      // HUD
      octx.fillStyle = '#ffffff';
      octx.font = '8px monospace';
      octx.fillText(`Score: ${Math.floor(score)}`, 6, 10);
      if (highScore > 0) octx.fillText(`Best: ${highScore}`, 6, 20);

      if (player.isDead) {
        octx.fillStyle = '#ffffff';
        octx.font = '10px monospace';
        octx.fillText('Game Over - Press Space/Up or Tap to retry', 30, 70);
      } else if (score < 15) {
        octx.fillStyle = '#ffffff';
        octx.font = '9px monospace';
        octx.fillText('Tap or press Space to jump', 70, 70);
      }

      // Blit to screen with pixelated scaling
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(off, 0, 0, canvas.width, canvas.height);

      raf = requestAnimationFrame(render);
    };

    // Restart on input if dead
    const onStartIfDead = () => {
      if (player.isDead) reset();
    };
    window.addEventListener('keydown', onStartIfDead);
    jumpBtn.addEventListener('touchstart', onStartIfDead, { passive: true });

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', maybeShowControls);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onStartIfDead);
      if (document.body.contains(mobileControls)) document.body.removeChild(mobileControls);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ imageRendering: 'pixelated' }} />
    </div>
  );
};
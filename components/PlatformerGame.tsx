import React, { useEffect, useRef } from 'react';

// Endless runner with Dino-style obstacles
// Uses a pixelated version of /public/chog.png rendered to a low-res buffer and scaled up

interface KeysState {
  jumpDown: boolean; // current held state
  jumpPressed: boolean; // edge-triggered press
}

interface PlayerState {
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  onGround: boolean;
  isDead: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'gap' | 'thorn';
}

const VIRTUAL_WIDTH = 320;
const VIRTUAL_HEIGHT = 180;
const GROUND_Y = VIRTUAL_HEIGHT - 32;

const GRAVITY = 0.42;
const JUMP_VELOCITY = -4.6;

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
    const keys: KeysState = { jumpDown: false, jumpPressed: false };
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'w' || k === 'arrowup') {
        if (!keys.jumpDown) keys.jumpPressed = true; // edge trigger
        keys.jumpDown = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === ' ' || k === 'w' || k === 'arrowup') {
        keys.jumpDown = false;
      }
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
    bindTouch(jumpBtn, () => { if (!keys.jumpDown) keys.jumpPressed = true; keys.jumpDown = true; }, () => { keys.jumpDown = false; });

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
      y: GROUND_Y - 24,
      vy: 0,
      width: 24,
      height: 24,
      onGround: true,
      isDead: false,
    };

    // Pixelated character image cache
    const srcImg = new Image();
    srcImg.src = '/chog.png';
    let tinyCanvas: HTMLCanvasElement | null = null;

    const buildPixelated = () => {
      if (!srcImg.complete) return;
      const size = 24; // target low-res size for bigger sprite
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

      // Recolor bright red glove pixels to skin tone for a clean running look
      const img = tctx.getImageData(0, 0, size, size);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a > 0 && r > 150 && g < 90 && b < 90) {
          // Replace strong reds with a light skin tone
          data[i] = 251;   // r
          data[i + 1] = 231; // g
          data[i + 2] = 198; // b
          // keep alpha
        }
      }
      tctx.putImageData(img, 0, 0);

      tinyCanvas = tc;
    };

    if (srcImg.complete) buildPixelated(); else srcImg.onload = buildPixelated;

    // World
    let speed = 0.8; // slower world scroll speed
    let score = 0;
    let highScore = 0;
    let spawnTimer = 0;
    const obstacles: Obstacle[] = [];

    // Utilities
    const spawnObstacle = () => {
      // Generate either a gap in the bridge or a thorn bush on the bridge
      const isGap = Math.random() < 0.5;
      if (isGap) {
        const gapWidth = 18 + Math.floor(Math.random() * 24);
        obstacles.push({
          x: VIRTUAL_WIDTH + 8,
          y: GROUND_Y + 2, // below walking surface
          w: gapWidth,
          h: 20,
          type: 'gap',
        });
      } else {
        const thornH = 12 + Math.floor(Math.random() * 10);
        const thornW = 12 + Math.floor(Math.random() * 8);
        obstacles.push({
          x: VIRTUAL_WIDTH + 8,
          y: GROUND_Y - thornH,
          w: thornW,
          h: thornH,
          type: 'thorn',
        });
      }
    };

    const reset = () => {
      player.y = GROUND_Y - player.height;
      player.vy = 0;
      player.onGround = true;
      player.isDead = false;
      obstacles.length = 0;
      speed = 0.8;
      score = 0;
      spawnTimer = 0;
    };

    // Initial reset
    reset();

    // Game loop
    let raf = 0;
    let last = performance.now();

    const update = (dtMs: number) => {
      const dt = Math.min(50, dtMs) / 16.6667; // normalize to 60fps units
      if (!player.isDead) {
        // speed increases only at score thresholds
        if (score > 700) speed += 0.00004 * dtMs; else if (score > 400) speed += 0.00002 * dtMs;
        score += speed * 0.02 * dtMs;
      }

      // Jumping (edge-triggered)
      if (keys.jumpPressed && player.onGround && !player.isDead) {
        player.vy = JUMP_VELOCITY;
        player.onGround = false;
      }
      keys.jumpPressed = false;

      // Gravity
      player.vy += GRAVITY * dt;
      if (player.vy > 6) player.vy = 6;
      player.y += player.vy * 1.2;

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
          spawnTimer = nextIn / (1 + (speed - 1.2) * 0.12);
        }
      }

      // Move obstacles and cull
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= speed * 1.1; // scale world speed
        if (o.x + o.w < -20) obstacles.splice(i, 1);
      }

      // Collisions + hazards
      const px1 = player.x;
      const py1 = player.y;
      const px2 = player.x + player.width;
      const py2 = player.y + player.height;

      for (const o of obstacles) {
        if (o.type === 'gap') {
          // If player is at gap horizontal range and feet are below bridge line, fall
          const overlapX = px2 > o.x && px1 < o.x + o.w;
          if (overlapX && player.onGround) {
            // start falling
            player.onGround = false;
            player.vy = Math.max(player.vy, 1.5);
          }
          // death if goes significantly below screen
          if (player.y > VIRTUAL_HEIGHT) {
            player.isDead = true;
            highScore = Math.max(highScore, Math.floor(score));
            break;
          }
        } else {
          // thorn collision (AABB)
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
      }
    };

    const drawSky = (g: CanvasRenderingContext2D) => {
      // Purple sea + clouds background
      const sky = g.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
      sky.addColorStop(0, '#3f2b96');
      sky.addColorStop(1, '#8e44ad');
      g.fillStyle = sky;
      g.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      // sea
      const seaHorizon = GROUND_Y + 12;
      const sea = g.createLinearGradient(0, seaHorizon, 0, VIRTUAL_HEIGHT);
      sea.addColorStop(0, '#5e3bb4');
      sea.addColorStop(1, '#402e7a');
      g.fillStyle = sea;
      g.fillRect(0, seaHorizon, VIRTUAL_WIDTH, VIRTUAL_HEIGHT - seaHorizon);

      // clouds
      g.fillStyle = '#d5b3ff88';
      const t = performance.now() * 0.02;
      for (let i = 0; i < 6; i++) {
        const cx = (i * 60 + (t + i * 30)) % (VIRTUAL_WIDTH + 50) - 50;
        const cy = 20 + (i % 3) * 15;
        g.beginPath();
        g.ellipse(cx, cy, 20, 10, 0, 0, Math.PI * 2);
        g.ellipse(cx + 12, cy + 2, 14, 8, 0, 0, Math.PI * 2);
        g.ellipse(cx - 12, cy + 3, 14, 8, 0, 0, Math.PI * 2);
        g.fill();
      }
    };

    const drawGround = (g: CanvasRenderingContext2D, t: number) => {
      // Purple sea and cloud background handled elsewhere; here we draw a bridge surface.
      const tileW = 16;
      for (let i = -2; i < Math.ceil(VIRTUAL_WIDTH / tileW) + 2; i++) {
        const x = (Math.floor(t / tileW) + i) * tileW - (t % tileW);
        // Bridge planks
        g.fillStyle = '#6d5ba8';
        g.fillRect(x, GROUND_Y, tileW, 3);
        g.fillStyle = '#8a78c9';
        g.fillRect(x + 1, GROUND_Y + 3, tileW - 2, 3);
        g.fillStyle = '#4f3f86';
        g.fillRect(x, GROUND_Y + 6, tileW, 4);
      }
    };

    const drawObstacle = (g: CanvasRenderingContext2D, o: Obstacle) => {
      if (o.type === 'gap') {
        // Gaps are just empty space under the bridge; draw water shimmer hint
        g.fillStyle = '#ffffff15';
        g.fillRect(o.x, GROUND_Y + 1, o.w, 2);
      } else {
        // thorn bush
        g.fillStyle = '#6b1d6b';
        g.beginPath();
        const spikes = Math.max(3, Math.floor(o.w / 3));
        for (let i = 0; i <= spikes; i++) {
          const sx = o.x + (i / spikes) * o.w;
          const sy = o.y + o.h;
          const peakX = sx + (o.w / spikes) / 2;
          const peakY = o.y;
          g.moveTo(sx, sy);
          g.lineTo(peakX, peakY);
        }
        g.lineWidth = 2;
        g.strokeStyle = '#a23aa2';
        g.stroke();
        g.fillStyle = '#4d0f4d';
        g.fillRect(o.x, o.y + o.h - 2, o.w, 2);
      }
    };

    const drawPlayer = (g: CanvasRenderingContext2D, bobPhase: number) => {
      const px = Math.floor(player.x);
      const runPhase = bobPhase * 4; // slightly slower cycle for legs
      const bob = player.onGround ? Math.round(Math.sin(runPhase) * 1) : 0;
      const py = Math.floor(player.y) + bob;

      // soft shadow to ground for a sense of motion
      if (player.onGround) {
        g.fillStyle = '#00000033';
        g.beginPath();
        g.ellipse(px + player.width / 2, GROUND_Y + 6, 6, 2, 0, 0, Math.PI * 2);
        g.fill();
      }

      const cx = px + player.width / 2;
      const cy = py + player.height / 2;

      // Apply a subtle lean and squash/stretch to simulate a run cycle
      let scaleX = 1;
      let scaleY = 1;
      let angle = 0;
      if (!player.isDead) {
        const stride = Math.sin(runPhase);
        if (player.onGround) {
          scaleX = 1 + 0.06 * stride;
          scaleY = 1 - 0.06 * stride;
          angle = 0.04 + 0.08 * Math.cos(runPhase);
        } else {
          angle = 0.06; // small forward lean while airborne
        }
      }

      g.save();
      g.imageSmoothingEnabled = false;
      g.translate(cx, cy);
      g.rotate(angle);
      g.scale(scaleX, scaleY);
      g.translate(-player.width / 2, -player.height / 2);

      if (tinyCanvas) {
        g.drawImage(tinyCanvas, 0, 0, player.width, player.height);
      } else {
        g.fillStyle = '#6b46c1';
        g.fillRect(0, 0, player.width, player.height);
        g.fillStyle = '#fbe7c6';
        g.fillRect(3, 4, 8, 7);
      }
      g.restore();

      // optional outline removed for cleaner sprite
      // g.strokeStyle = '#000000';
      // g.lineWidth = 1;
      // g.strokeRect(px - 0.5, py - 0.5, player.width + 1, player.height + 1);
    };

    let timeAccum = 0;

    const render = () => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      update(dt);
      timeAccum += dt * (0.04 + speed * 0.015);

      // Clear offscreen
      octx.imageSmoothingEnabled = false;
      octx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      drawSky(octx);
      drawGround(octx, (now * Math.max(0.015, speed * 0.015)) % 10000);

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
        octx.fillText('Tap or press Space to jump (press not hold)', 40, 70);
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
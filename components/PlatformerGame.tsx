import React, { useEffect, useRef } from 'react';

// Simple pixel-art platformer rendered to a low-res canvas and scaled up
// No external assets required; draws a stylized pixel sprite inspired by the original character

interface KeysState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  onGround: boolean;
  facing: 1 | -1;
  walkFrame: number; // for simple 2-frame walk anim
  walkTimer: number;
}

const VIRTUAL_WIDTH = 320;  // internal low-res buffer
const VIRTUAL_HEIGHT = 180;

const GRAVITY = 0.3; // gravity tuned for Mario-like arcs
const JUMP_VELOCITY = -4.0; // realistic initial jump velocity
const MOVE_ACCEL = 0.18; // gentler acceleration
const MAX_SPEED = 1.1; // slower top run speed similar to classic platformers
const GROUND_Y = VIRTUAL_HEIGHT - 24; // top of ground tiles

export const PlatformerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // Fit canvas to window
    const resize = () => {
      const scaleX = Math.floor(window.innerWidth / VIRTUAL_WIDTH) || 1;
      const scaleY = Math.floor(window.innerHeight / VIRTUAL_HEIGHT) || 1;
      const scale = Math.max(1, Math.min(scaleX, scaleY));
      canvas.width = VIRTUAL_WIDTH * scale;
      canvas.height = VIRTUAL_HEIGHT * scale;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create offscreen buffer
    const off = document.createElement('canvas');
    off.width = VIRTUAL_WIDTH;
    off.height = VIRTUAL_HEIGHT;
    offscreenRef.current = off;
    const octx = off.getContext('2d')!;

    // Input handling
    const keys: KeysState = { left: false, right: false, jump: false };
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') keys.left = true;
      if (k === 'arrowright' || k === 'd') keys.right = true;
      if (k === 'arrowup' || k === 'w' || k === ' ') keys.jump = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') keys.left = false;
      if (k === 'arrowright' || k === 'd') keys.right = false;
      if (k === 'arrowup' || k === 'w' || k === ' ') keys.jump = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Simple mobile controls (left, right, jump)
    const mobileControls = document.createElement('div');
    mobileControls.style.position = 'absolute';
    mobileControls.style.left = '0';
    mobileControls.style.right = '0';
    mobileControls.style.bottom = '16px';
    mobileControls.style.display = 'flex';
    mobileControls.style.justifyContent = 'space-between';
    mobileControls.style.padding = '0 16px';
    mobileControls.style.pointerEvents = 'auto';

    const mkBtn = (label: string) => {
      const b = document.createElement('div');
      b.textContent = label;
      b.style.width = '72px';
      b.style.height = '72px';
      b.style.borderRadius = '12px';
      b.style.display = 'flex';
      b.style.alignItems = 'center';
      b.style.justifyContent = 'center';
      b.style.background = 'rgba(0,0,0,0.35)';
      b.style.color = '#ffd54a';
      b.style.fontWeight = 'bold';
      b.style.userSelect = 'none';
      b.style.backdropFilter = 'blur(6px)';
      b.style.touchAction = 'none';
      return b;
    };

    const leftBtn = mkBtn('◀');
    const rightBtn = mkBtn('▶');
    const jumpBtn = mkBtn('⤴');

    const bindTouch = (el: HTMLElement, on: () => void, offFn: () => void) => {
      el.addEventListener('touchstart', (e) => { e.preventDefault(); on(); }, { passive: false });
      el.addEventListener('touchend', (e) => { e.preventDefault(); offFn(); }, { passive: false });
      el.addEventListener('touchcancel', (e) => { e.preventDefault(); offFn(); }, { passive: false });
    };

    bindTouch(leftBtn, () => (keys.left = true), () => (keys.left = false));
    bindTouch(rightBtn, () => (keys.right = true), () => (keys.right = false));
    bindTouch(jumpBtn, () => (keys.jump = true), () => (keys.jump = false));

    mobileControls.appendChild(leftBtn);
    const midSpacer = document.createElement('div');
    midSpacer.style.flex = '1';
    mobileControls.appendChild(midSpacer);
    mobileControls.appendChild(rightBtn);
    mobileControls.appendChild(jumpBtn);

    // Only show on small screens
    const maybeShowControls = () => {
      if (window.innerWidth < 640) {
        if (!document.body.contains(mobileControls)) document.body.appendChild(mobileControls);
      } else if (document.body.contains(mobileControls)) {
        document.body.removeChild(mobileControls);
      }
    };
    maybeShowControls();
    window.addEventListener('resize', maybeShowControls);

    // Player init
    const player: PlayerState = {
      x: 40,
      y: GROUND_Y - 16,
      vx: 0,
      vy: 0,
      width: 12,
      height: 16,
      onGround: true,
      facing: 1,
      walkFrame: 0,
      walkTimer: 0,
    };

    // Camera
    let cameraX = 0;

    // Platforms (simple ground tiles, plus a few floating platforms)
    const platforms: Array<{ x: number; y: number; w: number; h: number }> = [];
    // Ground segments across a long world
    for (let i = 0; i < 200; i++) {
      platforms.push({ x: i * 16, y: GROUND_Y, w: 16, h: VIRTUAL_HEIGHT - GROUND_Y });
    }
    // Some floating platforms
    const addPlatform = (x: number, y: number, tiles: number) => {
      platforms.push({ x, y, w: tiles * 16, h: 6 });
    };
    addPlatform(140, GROUND_Y - 40, 5);
    addPlatform(240, GROUND_Y - 60, 4);
    addPlatform(360, GROUND_Y - 30, 6);
    addPlatform(520, GROUND_Y - 50, 5);

    // Physics + render loop
    let raf = 0;
    let last = performance.now();

    const update = (dtMs: number) => {
      const dt = Math.min(32, dtMs) / 16.6667; // normalize to ~60fps units

      // Horizontal movement
      if (keys.left) {
        player.vx = Math.max(player.vx - MOVE_ACCEL * dt, -MAX_SPEED);
        player.facing = -1;
      } else if (keys.right) {
        player.vx = Math.min(player.vx + MOVE_ACCEL * dt, MAX_SPEED);
        player.facing = 1;
      } else {
        // friction when no input
        player.vx *= player.onGround ? 0.7 : 0.98; // quicker slowdown on ground
        if (Math.abs(player.vx) < 0.02) player.vx = 0;
      }

      // Jump
      if (keys.jump && player.onGround) {
        player.vy = JUMP_VELOCITY;
        player.onGround = false;
      }
      // Variable jump height (hold to go a bit higher)
      if (!keys.jump && player.vy < 0) {
        player.vy += 0.25 * dt; // cut jump when released
      }

      // Gravity
      player.vy += GRAVITY * dt;
      if (player.vy > 6) player.vy = 6; // lower terminal velocity for softer falls

      // Integrate
      player.x += player.vx * 1.5; // scale speed for feel (reduced for realism)
      player.y += player.vy * 2.2;

      // Collisions with platforms
      player.onGround = false;
      for (const p of platforms) {
        // AABB collision resolution (simple)
        const px1 = player.x - player.width / 2;
        const py1 = player.y - player.height;
        const px2 = player.x + player.width / 2;
        const py2 = player.y;
        const p2x1 = p.x;
        const p2y1 = p.y;
        const p2x2 = p.x + p.w;
        const p2y2 = p.y + p.h;

        if (px2 > p2x1 && px1 < p2x2 && py2 > p2y1 && py1 < p2y2) {
          // Determine minimal axis of penetration
          const overlapX = Math.min(px2 - p2x1, p2x2 - px1);
          const overlapY = Math.min(py2 - p2y1, p2y2 - py1);

          if (overlapX < overlapY) {
            // Resolve X
            if (player.x < p2x1) player.x -= overlapX; else player.x += overlapX;
            player.vx = 0;
          } else {
            // Resolve Y
            if (player.y < p2y1 + 8) {
              // hitting from below
              player.y -= overlapY;
              player.vy = 0.1;
            } else {
              // landing on top
              player.y += overlapY;
              player.vy = 0;
              player.onGround = true;
            }
          }
        }
      }

      // Clamp world bounds (left)
      if (player.x < player.width / 2) player.x = player.width / 2;

      // Camera follow
      const targetCameraX = Math.max(0, player.x - VIRTUAL_WIDTH / 2);
      cameraX += (targetCameraX - cameraX) * 0.08; // smooth follow

      // Walk animation
      if (Math.abs(player.vx) > 0.05 && player.onGround) {
        player.walkTimer += dtMs;
        if (player.walkTimer > 160) { // slightly slower cadence
          player.walkTimer = 0;
          player.walkFrame = (player.walkFrame + 1) % 2;
        }
      } else {
        player.walkFrame = 0;
        player.walkTimer = 0;
      }
    };

    const drawSky = (g: CanvasRenderingContext2D) => {
      const grd = g.createLinearGradient(0, 0, 0, VIRTUAL_HEIGHT);
      grd.addColorStop(0, '#0b1023');
      grd.addColorStop(1, '#1a2a4a');
      g.fillStyle = grd;
      g.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      // Parallax hills
      g.fillStyle = '#1e2f57';
      for (let i = -1; i < 10; i++) {
        const hx = i * 80 - (cameraX * 0.3) % 80;
        g.fillRect(hx, VIRTUAL_HEIGHT - 50, 60, 40);
      }
      g.fillStyle = '#27416d';
      for (let i = -1; i < 10; i++) {
        const hx = i * 120 - (cameraX * 0.6) % 120;
        g.fillRect(hx, VIRTUAL_HEIGHT - 70, 100, 60);
      }
    };

    const drawGround = (g: CanvasRenderingContext2D) => {
      // Ground tiles
      for (let i = -2; i < Math.ceil(VIRTUAL_WIDTH / 16) + 4; i++) {
        const wx = Math.floor((cameraX / 16)) + i;
        const x = (wx * 16) - Math.floor(cameraX);
        // top dirt
        g.fillStyle = '#6b3f22';
        g.fillRect(x, GROUND_Y, 16, 8);
        // side highlight and dark
        g.fillStyle = '#84512b';
        g.fillRect(x + 1, GROUND_Y + 1, 14, 3);
        g.fillStyle = '#3f2414';
        g.fillRect(x + 1, GROUND_Y + 4, 14, 10);
      }

      // Floating platforms
      g.fillStyle = '#734a28';
      for (const p of platforms) {
        if (p.y === GROUND_Y) continue;
        const sx = Math.floor(p.x - cameraX);
        if (sx + p.w < -16 || sx > VIRTUAL_WIDTH + 16) continue;
        g.fillRect(sx, p.y, p.w, p.h);
        g.fillStyle = '#8a5a31';
        g.fillRect(sx + 1, p.y + 1, p.w - 2, 2);
        g.fillStyle = '#5a3a1f';
        g.fillRect(sx + 1, p.y + 3, p.w - 2, p.h - 4);
        g.fillStyle = '#734a28';
      }
    };

    // Minimal 16x16 pixel sprite definition (2 walking frames)
    // 0 transparent, 1 purple hair, 2 skin, 3 orange shirt, 4 black shorts, 5 red gloves, 6 boots red-dark, 7 outline
    const FRAME_0: number[][] = [
      [0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [1,1,1,2,2,1,1,1,1,2,2,1,1,1,0,0],
      [1,1,2,2,2,2,1,1,1,2,2,2,2,1,0,0],
      [0,7,2,3,3,2,7,0,0,7,2,3,3,2,7,0],
      [0,7,3,3,3,3,7,0,0,7,3,3,3,3,7,0],
      [0,0,4,4,4,4,0,0,0,0,4,4,4,4,0,0],
      [0,5,5,0,0,0,0,0,0,0,0,0,5,5,0,0],
      [0,5,5,0,0,0,0,0,0,0,0,0,5,5,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,6,0,0,0,0,0,0,0,6,0,0,0,0],
      [0,0,6,6,0,0,0,0,0,0,0,6,6,0,0,0],
      [0,0,6,0,0,0,0,0,0,0,0,0,6,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    const FRAME_1: number[][] = [
      [0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0],
      [0,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [1,1,1,2,2,1,1,1,1,2,2,1,1,1,0,0],
      [1,1,2,2,2,2,1,1,1,2,2,2,2,1,0,0],
      [0,7,2,3,3,2,7,0,0,7,2,3,3,2,7,0],
      [0,7,3,3,3,3,7,0,0,7,3,3,3,3,7,0],
      [0,0,4,4,4,4,0,0,0,0,4,4,4,4,0,0],
      [0,5,5,0,0,0,0,0,0,0,5,5,0,0,0,0],
      [0,5,5,0,0,0,0,0,0,0,5,5,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,6,0,0,0,0,0,0,6,0,0,0,0,0],
      [0,0,6,6,0,0,0,0,0,6,6,0,0,0,0,0],
      [0,0,0,6,0,0,0,0,0,0,6,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    const palette: Record<number, string> = {
      1: '#4b1b8a', // hair purple
      2: '#f1d2b6', // skin
      3: '#ff9e00', // shirt
      4: '#222222', // shorts
      5: '#d83b3b', // gloves
      6: '#a32727', // boots dark
      7: '#000000', // outline
    };

    const drawSprite = (
      g: CanvasRenderingContext2D,
      frame: number[][],
      x: number,
      y: number,
      flip: boolean
    ) => {
      for (let j = 0; j < 16; j++) {
        for (let i = 0; i < 16; i++) {
          const v = frame[j][i];
          if (!v) continue;
          g.fillStyle = palette[v];
          const drawX = flip ? x + (15 - i) : x + i;
          g.fillRect(drawX, y + j - 16, 1, 1);
        }
      }
    };

    const render = () => {
      // Update step
      const now = performance.now();
      const dt = now - last;
      last = now;
      update(dt);

      // Draw to offscreen buffer
      octx.imageSmoothingEnabled = false;
      octx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

      drawSky(octx);
      drawGround(octx);

      // Player
      const frame = player.walkFrame === 0 ? FRAME_0 : FRAME_1;
      drawSprite(octx, frame, Math.floor(player.x - cameraX) - 8, Math.floor(player.y), player.facing === -1);

      // HUD minimal
      octx.fillStyle = '#ffffff';
      octx.fillText('Pixel Platformer', 6, 10);

      // Blit with nearest-neighbor scaling
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(off, 0, 0, canvas.width, canvas.height);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', maybeShowControls);
      if (document.body.contains(mobileControls)) document.body.removeChild(mobileControls);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ imageRendering: 'pixelated' }} />
    </div>
  );
};
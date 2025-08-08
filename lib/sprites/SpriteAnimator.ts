export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number; // milliseconds per frame
}

export interface SpriteAnimation {
  name: string;
  frames: SpriteFrame[];
  loop: boolean;
}

export class SpriteAnimator {
  private animations: Map<string, SpriteAnimation> = new Map();
  private currentAnimation: string = 'idle';
  private currentFrame: number = 0;
  private frameTimer: number = 0;
  private spriteSheet: HTMLImageElement | null = null;
  private lastTime: number = 0;

  constructor() {
    this.initializeAnimations();
  }

  private initializeAnimations() {
    // Define sprite sheet positions for running animation
    // Assuming a typical Mario-style run cycle with 3-4 frames
    
    // Idle animation - single frame
    this.animations.set('idle', {
      name: 'idle',
      frames: [
        { x: 0, y: 0, width: 32, height: 32, duration: 100 }
      ],
      loop: true
    });

    // Running animation - 4 frames
    this.animations.set('run', {
      name: 'run',
      frames: [
        { x: 32, y: 0, width: 32, height: 32, duration: 100 },
        { x: 64, y: 0, width: 32, height: 32, duration: 100 },
        { x: 96, y: 0, width: 32, height: 32, duration: 100 },
        { x: 128, y: 0, width: 32, height: 32, duration: 100 }
      ],
      loop: true
    });

    // Jump animation - 2 frames (ascend and descend)
    this.animations.set('jump', {
      name: 'jump',
      frames: [
        { x: 160, y: 0, width: 32, height: 32, duration: 200 },
        { x: 192, y: 0, width: 32, height: 32, duration: 200 }
      ],
      loop: false
    });

    // Fall animation - single frame
    this.animations.set('fall', {
      name: 'fall',
      frames: [
        { x: 192, y: 0, width: 32, height: 32, duration: 100 }
      ],
      loop: false
    });
  }

  loadSpriteSheet(imagePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.spriteSheet = img;
        resolve();
      };
      img.onerror = reject;
      img.src = imagePath;
    });
  }

  setAnimation(animationName: string) {
    if (this.currentAnimation !== animationName && this.animations.has(animationName)) {
      this.currentAnimation = animationName;
      this.currentFrame = 0;
      this.frameTimer = 0;
    }
  }

  update(deltaTime: number) {
    const animation = this.animations.get(this.currentAnimation);
    if (!animation) return;

    this.frameTimer += deltaTime;
    
    const currentFrameData = animation.frames[this.currentFrame];
    if (this.frameTimer >= currentFrameData.duration) {
      this.frameTimer = 0;
      this.currentFrame++;
      
      if (this.currentFrame >= animation.frames.length) {
        if (animation.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = animation.frames.length - 1;
        }
      }
    }
  }

  getCurrentFrame(): SpriteFrame | null {
    const animation = this.animations.get(this.currentAnimation);
    if (!animation) return null;
    return animation.frames[this.currentFrame];
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, facingRight: boolean = true) {
    if (!this.spriteSheet) return;
    
    const frame = this.getCurrentFrame();
    if (!frame) return;

    ctx.save();
    
    // Flip horizontally if facing left
    if (!facingRight) {
      ctx.translate(x + frame.width / 2, y);
      ctx.scale(-1, 1);
      ctx.translate(-frame.width / 2, 0);
    } else {
      ctx.translate(x, y);
    }
    
    ctx.drawImage(
      this.spriteSheet,
      frame.x, frame.y,
      frame.width, frame.height,
      0, 0,
      frame.width, frame.height
    );
    
    ctx.restore();
  }
}
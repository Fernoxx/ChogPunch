import { PhysicsEngine } from '../physics/PhysicsEngine';
import Matter from 'matter-js';

export type AnimationState = 
  | 'idle' 
  | 'walk' 
  | 'run' 
  | 'jump' 
  | 'punch1' 
  | 'punch2' 
  | 'punch3'
  | 'kick1' 
  | 'kick2' 
  | 'uppercut'
  | 'roundhouse'
  | 'block'
  | 'hit'
  | 'knockback'
  | 'victory'
  | 'defeat';

export interface AnimationFrame {
  limbPositions: Map<string, { x: number; y: number; rotation: number }>;
  duration: number;
  hitboxActive?: boolean;
  damage?: number;
  knockback?: { x: number; y: number };
}

export interface Animation {
  name: AnimationState;
  frames: AnimationFrame[];
  loop: boolean;
  canCancel: boolean;
  nextCombo?: AnimationState;
}

export class AnimationController {
  private currentAnimation: Animation | null = null;
  private currentFrame: number = 0;
  private frameTimer: number = 0;
  private animations: Map<AnimationState, Animation> = new Map();
  private comboTimer: number = 0;
  private comboWindow: number = 300; // ms
  private lastAttack: AnimationState | null = null;
  private physicsEngine: PhysicsEngine;
  
  constructor(physicsEngine: PhysicsEngine) {
    this.physicsEngine = physicsEngine;
    this.initializeAnimations();
  }

  private initializeAnimations() {
    // Idle animation - subtle breathing movement
    this.animations.set('idle', {
      name: 'idle',
      frames: [
        {
          limbPositions: new Map([
            ['torso', { x: 0, y: 0, rotation: 0 }],
            ['head', { x: 0, y: -2, rotation: 0 }],
            ['leftUpperArm', { x: -2, y: 0, rotation: 0.1 }],
            ['rightUpperArm', { x: 2, y: 0, rotation: -0.1 }],
          ]),
          duration: 1000,
        },
        {
          limbPositions: new Map([
            ['torso', { x: 0, y: -2, rotation: 0 }],
            ['head', { x: 0, y: -4, rotation: 0 }],
            ['leftUpperArm', { x: -2, y: -1, rotation: 0.05 }],
            ['rightUpperArm', { x: 2, y: -1, rotation: -0.05 }],
          ]),
          duration: 1000,
        }
      ],
      loop: true,
      canCancel: true
    });

    // Punch 1 - Jab
    this.animations.set('punch1', {
      name: 'punch1',
      frames: [
        {
          limbPositions: new Map([
            ['rightUpperArm', { x: 5, y: -5, rotation: -0.5 }],
            ['rightLowerArm', { x: 10, y: -5, rotation: -0.7 }],
          ]),
          duration: 100,
        },
        {
          limbPositions: new Map([
            ['rightUpperArm', { x: 15, y: -3, rotation: -1.2 }],
            ['rightLowerArm', { x: 30, y: -3, rotation: -1.5 }],
            ['torso', { x: 5, y: 0, rotation: -0.2 }],
          ]),
          duration: 100,
          hitboxActive: true,
        },
        {
          limbPositions: new Map([
            ['rightUpperArm', { x: 2, y: 0, rotation: -0.1 }],
            ['rightLowerArm', { x: 4, y: 0, rotation: -0.1 }],
      ],
      loop: false,
      canCancel: true,

    // Punch 2 - Cross
    this.animations.set('punch2', {
      name: 'punch2',
      frames: [
        {
          limbPositions: new Map([
            ['leftUpperArm', { x: -5, y: -5, rotation: 0.5 }],
          ]),
      ],
      loop: false,
      canCancel: true
    });

    // Uppercut
      name: 'uppercut',
          limbPositions: new Map([
        {
          limbPositions: new Map([

      name: 'kick1',
            ['rightUpperLeg', { x: 5, y: -10, rotation: -0.8 }],
            ['rightLowerLeg', { x: 8, y: -15, rotation: -1.0 }],
            ['torso', { x: -2, y: 0, rotation: 0.1 }],
        },
        {
          limbPositions: new Map([
            ['rightUpperLeg', { x: 20, y: -5, rotation: -1.5 }],
          hitboxActive: true,
        },
      frames: [
        {
          limbPositions: new Map([
            ['torso', { x: 0, y: 0, rotation: -0.5 }],
        rotation: -1.5 }],
            ['leftUpperLeg', { x: -15, y: -15, rotation: 2.0 }],
          ]),
          damage: 15,
        },
        {
          limbPositions: new Map([
      ],
    // Block animation
    this.animations.set('block', {
        {
          limbPositions: new Map([
            ['leftUpperArm', { x: -3, y: -10, rotation: 1.2 }],
            ['leftLowerArm', { x: -5, y: -15, rotation: 1.5 }],
        }
      ]
    });

    // Hit reaction
    this.animations.set('hit', {
      name: 'hit',
      frames: [
        {
          limbPositions: new Map(
            ['head', { x: -8, y: 0, rotation: 0.5 }],
          ]),
          duration: 100,
        },
        {
          limbPositions: new Map([
            ['torso', { x: -2, y: 0, rotation: 0.1 }],
      canCancel: false
    });
  }
    if (!animation) return

    // Check for combo
    if (this.currentAnimation?.nextCombo === animationName && this.comboTimer > 0) {
      // Combo successful!
      this.lastAttack = animationName;
    }

    this.currentAnimation = animation;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.comboTimer = this.comboWindow;
  }

      return;
    }

    // Update combo timer
    if (this.comboTimer > 0) {
    this.frameTimer += deltaTime;

    const currentFrameData = this.currentAnimation.frames[this.currentFrame];
    if (this.frameTimer >= currentFrameData.duration) {
      this.frameTimer = 0;
      this.currentFrame++;

      // Check if animation finished
      if (this.currentFrame >= this.currentAnimation.frames.length) {
        if (this.currentAnimation.loop) {
          this.currentFrame = 0;
        } else {
          this.play('idle');
        }
      }
    }

  private applyFramePhysics(frame: AnimationFrame) {
    frame.limbPositions.forEach((position, limbName) => {
      const limbBody = this.physicsEngine.getBody(`fighter-${limbName}`);
      if (limbBody) {
        // Apply smooth interpolation for realistic movement
        const currentPos = limbBody.body.position;
        const targetX = currentPos.x + position.x * 0.1;
        const targetY = currentPos.y + position.y * 0.1;
        
          x: targetX,
          y: targetY
        });
  isAttacking(): boolean {
    const attackAnimations: AnimationState[] = [
      'punch1', 'punch2', 'punch3', 'kick1', 'kick2', 'uppercut', 'roundhouse'
    ];
    return this.currentAnimation ? attackAnimations.includes(this.currentAnimation.name) : false;
  }

  isBlocking(): boolean {
    return this.currentAnimation?.name === 'block';
  }
  }
}

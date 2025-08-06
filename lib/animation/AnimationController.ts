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
            ['torso', { x: 2, y: 0, rotation: -0.1 }],
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
          damage: 5,
          knockback: { x: 10, y: -2 }
        },
        {
          limbPositions: new Map([
            ['rightUpperArm', { x: 2, y: 0, rotation: -0.1 }],
            ['rightLowerArm', { x: 4, y: 0, rotation: -0.1 }],
            ['torso', { x: 0, y: 0, rotation: 0 }
        }
      ],
      loop: false,
      canCancel: true,
      nextCombo: 'punch2'
    });

    // Punch 2 - Cross
    this.animations.set('punch2', {
      name: 'punch2',
      frames: [
        {
          limbPositions: new Map([
            ['leftUpperArm', { x: -5, y: -5, rotation: 0.5 }],
            ['leftLowerArm', { x: -10, y: -5, rotation: 0.7 }],
            ['torso', { x: -2, y: 0, rotation: 0.1 }],
          ]),
          duration: 100,
        },
        {
          limbPositions: new Map([
            ['leftUpperArm', { x: -20, y: -3, rotation: 1.2 }],
            ['leftLowerArm', { x: -35, y: -3, rotation: 1.5 }],
            ['torso', { x: -8, y: 0, rotation: 0.3 }],
            ['rightUpperLeg', { x: 5, y: 0, rotation: -0.2 }],
          ]),
          duration: 120,
          hitboxActive: true,
          damage: 8,
          knockback: { x: 15, y: -3 }
        },
        {
          limbPositions: new Map([
            ['leftUpperArm', { x: -2, y: 0, rotation: 0.1 }],
            ['leftLowerArm', { x: -4, y: 0, rotation: 0.1 }],
            ['torso', { x: 0, y: 0, rotation: 0 }],
          ]),
          duration: 200,
        }
      ],
      loop: false,
      canCancel: true,
      nextCombo: 'uppercut'
    });

    // Uppercut
    this.animations.set('uppercut', {
      name: 'uppercut',
      frames: [
        {
          limbPositions: new Map([
            ['torso', { x: 0, y: 5, rotation: 0.2 }],
            ['rightUpperArm', { x: 5, y: 10, rotation: 0.8 }],
            ['rightLowerArm', { x: 5, y: 15, rotation: 1.2 }],
            ['leftUpperLeg', { x: -5, y: 5, rotation: 0.3 }]
        {
          limbPositions: new Map([
            ['torso', { x: 0, y: -10, rotation: -0.3 }],
            ['rightUpperArm', { x: 10, y: -20, rotation: -1.5 }],
            ['rightLowerArm', { x: 15, y: -35, rotation: -1.8 }],
            ['head', { x: 0, y: -15, rotation: -0.4 }],
          ]),
          duration: 100,
          hitboxActive: true,
          damage: 12,
        {
          limbPositions: new Map([
            ['torso', { x: 0, y: 0, rotation: 0 }],
            ['rightUpperArm', { x: 2, y: 0, rotation: -0.1 }],
            ['rightLowerArm', { x: 4, y: 0, rotation: -0.1 }],
        }
      ],
      loop: false,
      canCancel: false
    });

    // Kick 1 - Front kick
    this.animations.set('kick1', {
      name: 'kick1',
      frames: [
        {
          limbPositions: new Map([
            ['rightUpperLeg', { x: 5, y: -10, rotation: -0.8 }],
            ['rightLowerLeg', { x: 8, y: -15, rotation: -1.0 }],
            ['torso', { x: -2, y: 0, rotation: 0.1 }],
            ['leftUpperArm', { x: -5, y: -2, rotation: 0.3 }],
            ['rightUpperArm', { x: 5, y: -2, rotation: -0.3 }],
        },
        {
          limbPositions: new Map([
            ['rightUpperLeg', { x: 20, y: -5, rotation: -1.5 }],
          hitboxActive: true,
          damage: 10,
          knockback: { x: 20, y: -5 }
        },
        {
          limbPositions: new Map([
            ['rightUpperLeg', { x: 0, y: 0, rotation: 0 }],
            ['rightLowerLeg', { x: 0, y: 0, rotation: 0 }],
            ['torso', { x: 0, y: 0, rotation: 0 }],
          ]),
          duration: 200,
        }
      ],
      loop: false,
      canCancel: true,
      nextCombo: 'roundhouse'
    });

    // Roundhouse kick
    this.animations.set('roundhouse', {
      name: 'roundhouse',
      frames: [
        {
          limbPositions: new Map([
            ['torso', { x: 0, y: 0, rotation: -0.5 }],
        rotation: -1.5 }],
            ['leftUpperLeg', { x: -15, y: -15, rotation: 2.0 }],
            ['leftLowerLeg', { x: -25, y: -20, rotation: 2.5 }],
            ['head', { x: -5, y: -8, rotation: -0.8 }],
          ]),
          duration: 150,
          hitboxActive: true,
          damage: 15,
          knockback: { x: 25, y: -10 }
        },
        {
          limbPositions: new Map([
            ['torso', { x: 0, y: 0, rotation: 0 }],
            ['leftUpperLeg', { x: 0, y: 0, rotation: 0 }],
            ['leftLowerLeg', { x: 0, y: 0, rotation: 0 }],
          ]),
          duration: 300,
        }
      ],
    // Block animation
    this.animations.set('block', {
      name: 'block',
      frames: [
        {
          limbPositions: new Map([
            ['leftUpperArm', { x: -3, y: -10, rotation: 1.2 }],
            ['leftLowerArm', { x: -5, y: -15, rotation: 1.5 }],
            ['rightUpperArm', { x: 3, y: -10, rotation: -1.2 }],
            ['rightLowerArm', { x: 5, y: -15, rotation: -1.5 }],
            ['torso', { x: -2, y: 0, rotation: 0 }],
          ]),
          duration: 100,
        }
      ],
      loop: true,
      canCancel: true
    });

    // Hit reaction
    this.animations.set('hit', {
      name: 'hit',
      frames: [
        {
          limbPositions: new Map([
            ['torso', { x: -5, y: 2, rotation: 0.3 }],
            ['head', { x: -8, y: 0, rotation: 0.5 }],
          ]),
          duration: 100,
        },
        {
          limbPositions: new Map([
            ['torso', { x: -2, y: 0, rotation: 0.1 }],
            ['head', { x: -3, y: 0, rotation: 0.2 }],
          ]),
          duration: 150,
        }
      ],
      loop: false,
      canCancel: false
    });
  }

  play(animationName: AnimationState, force: boolean = false) {
    const animation = this.animations.get(animationName);
    if (!animation) return;

    // Check if we can cancel current animation
    if (this.currentAnimation && !this.currentAnimation.canCancel && !force) {
      return;
    }

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

  update(deltaTime: number) {
    if (!this.currentAnimation) {
      this.play('idle');
      return;
    }

    // Update combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= deltaTime;
    }

    // Update frame timer
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

    // Apply physics based on current frame
    this.applyFramePhysics(currentFrameData);
  }

  private applyFramePhysics(frame: AnimationFrame) {
    frame.limbPositions.forEach((position, limbName) => {
      const limbBody = this.physicsEngine.getBody(`fighter-${limbName}`);
      if (limbBody) {
        // Apply smooth interpolation for realistic movement
        const currentPos = limbBody.body.position;
        const targetX = currentPos.x + position.x * 0.1;
        const targetY = currentPos.y + position.y * 0.1;
        
        Matter.Body.setPosition(limbBody.body, {
          x: targetX,
          y: targetY
        });
        
        Matter.Body.setAngle(limbBody.body, position.rotation);
      }
    });
  }

  getCurrentFrame(): AnimationFrame | null {
    if (!this.currentAnimation) return null;
    return this.currentAnimation.frames[this.currentFrame];
  }

  isAttacking(): boolean {
    const attackAnimations: AnimationState[] = [
      'punch1', 'punch2', 'punch3', 'kick1', 'kick2', 'uppercut', 'roundhouse'
    ];
    return this.currentAnimation ? attackAnimations.includes(this.currentAnimation.name) : false;
  }

  isBlocking(): boolean {
    return this.currentAnimation?.name === 'block';
  }

  getComboProgress(): number {
  }
}

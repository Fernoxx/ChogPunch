import Matter from 'matter-js';

export interface PhysicsBody {
  body: Matter.Body;
  type: 'fighter' | 'punchingBag' | 'limb';
  parent?: Matter.Body;
}

export class PhysicsEngine {
  private engine: Matter.Engine;
  private world: Matter.World;
  private render: Matter.Render | null = null;
  private bodies: Map<string, PhysicsBody> = new Map();
  private runner: Matter.Runner;

  constructor(canvas?: HTMLCanvasElement) {
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 }
    });
    this.world = this.engine.world;
    this.runner = Matter.Runner.create();

    // Create ground - positioned at bottom of typical screen
    const ground = Matter.Bodies.rectangle(960, 540, 2000, 60, { 
      isStatic: true,
      label: 'ground',
      render: {
        fillStyle: '#2a2a2a'
      }
    });
    
    // Create walls to keep fighter in bounds
    const leftWall = Matter.Bodies.rectangle(-30, 300, 60, 800, { 
      isStatic: true,
      label: 'leftWall'
    });
    
    const rightWall = Matter.Bodies.rectangle(1950, 300, 60, 800, { 
      isStatic: true,
      label: 'rightWall'
    });
    
    Matter.World.add(this.world, [ground, leftWall, rightWall]);

    if (canvas) {
      this.render = Matter.Render.create({
        canvas,
        engine: this.engine,
        options: {
          width: canvas.width,
          height: canvas.height,
          wireframes: false,
          background: 'transparent',
          showVelocity: false,
          showAngleIndicator: false
        }
      });
    }
  }

  start() {
    Matter.Runner.run(this.runner, this.engine);
    if (this.render) {
      Matter.Render.run(this.render);
    }
  }

  stop() {
    Matter.Runner.stop(this.runner);
    if (this.render) {
      Matter.Render.stop(this.render);
    }
  }

  createFighter(x: number, y: number, scale: number = 1): Matter.Body {
    // Create simplified fighter body for better visibility
    const torso = Matter.Bodies.rectangle(x, y, 60 * scale, 100 * scale, {
      label: 'fighter-torso',
      density: 0.003,
      friction: 0.8,
      restitution: 0.1,
      inertia: Infinity // Prevent unwanted rotation
    });

    const head = Matter.Bodies.circle(x, y - 40 * scale, 20 * scale, {
      label: 'head',
      density: 0.001,
      friction: 0.1,
      restitution: 0.1
    });

    // Arms
    const leftUpperArm = Matter.Bodies.rectangle(x - 25 * scale, y - 10 * scale, 30 * scale, 10 * scale, {
      label: 'leftUpperArm',
      density: 0.001
    });

    const leftLowerArm = Matter.Bodies.rectangle(x - 45 * scale, y - 10 * scale, 30 * scale, 8 * scale, {
      label: 'leftLowerArm',
      density: 0.001
    });

    const rightUpperArm = Matter.Bodies.rectangle(x + 25 * scale, y - 10 * scale, 30 * scale, 10 * scale, {
      label: 'rightUpperArm',
      density: 0.001
    });

    const rightLowerArm = Matter.Bodies.rectangle(x + 45 * scale, y - 10 * scale, 30 * scale, 8 * scale, {
      label: 'rightLowerArm',
      density: 0.001
    });

    // Legs
    const leftUpperLeg = Matter.Bodies.rectangle(x - 10 * scale, y + 40 * scale, 12 * scale, 40 * scale, {
      label: 'leftUpperLeg',
      density: 0.001
    });

    const leftLowerLeg = Matter.Bodies.rectangle(x - 10 * scale, y + 70 * scale, 10 * scale, 35 * scale, {
      label: 'leftLowerLeg',
      density: 0.001
    });

    const rightUpperLeg = Matter.Bodies.rectangle(x + 10 * scale, y + 40 * scale, 12 * scale, 40 * scale, {
      label: 'rightUpperLeg',
      density: 0.001
    });

    const rightLowerLeg = Matter.Bodies.rectangle(x + 10 * scale, y + 70 * scale, 10 * scale, 35 * scale, {
      label: 'rightLowerLeg',
      density: 0.001
    });

    // Create constraints (joints)
    const constraints = [
      // Head to torso
      Matter.Constraint.create({
        bodyA: head,
        bodyB: torso,
        pointA: { x: 0, y: 20 * scale },
        pointB: { x: 0, y: -30 * scale },
        stiffness: 0.8,
        length: 0
      }),
      // Arms
      Matter.Constraint.create({
        bodyA: torso,
        bodyB: leftUpperArm,
        pointA: { x: -20 * scale, y: -20 * scale },
        pointB: { x: 15 * scale, y: 0 },
        stiffness: 0.6,
        length: 0
      }),
      Matter.Constraint.create({
        bodyA: leftUpperArm,
        bodyB: leftLowerArm,
        pointA: { x: -15 * scale, y: 0 },
        pointB: { x: 15 * scale, y: 0 },
        stiffness: 0.6,
        length: 0
      }),
      Matter.Constraint.create({
        bodyA: torso,
        bodyB: rightUpperArm,
        pointA: { x: 20 * scale, y: -20 * scale },
        pointB: { x: -15 * scale, y: 0 },
        stiffness: 0.6,
        length: 0
      }),
      Matter.Constraint.create({
        bodyA: rightUpperArm,
        bodyB: rightLowerArm,
        pointA: { x: 15 * scale, y: 0 },
        pointB: { x: -15 * scale, y: 0 },
        stiffness: 0.6,
        length: 0
      }),
      // Legs
      Matter.Constraint.create({
        bodyA: torso,
        bodyB: leftUpperLeg,
        pointA: { x: -10 * scale, y: 30 * scale },
        pointB: { x: 0, y: -20 * scale },
        stiffness: 0.7,
        length: 0
      }),
      Matter.Constraint.create({
        bodyA: leftUpperLeg,
        bodyB: leftLowerLeg,
        pointA: { x: 0, y: 20 * scale },
        pointB: { x: 0, y: -17.5 * scale },
        stiffness: 0.7,
        length: 0
      }),
      Matter.Constraint.create({
        bodyA: torso,
        bodyB: rightUpperLeg,
        pointA: { x: 10 * scale, y: 30 * scale },
        pointB: { x: 0, y: -20 * scale },
        stiffness: 0.7,
        length: 0
      }),
      Matter.Constraint.create({
        bodyA: rightUpperLeg,
        bodyB: rightLowerLeg,
        pointA: { x: 0, y: 20 * scale },
        pointB: { x: 0, y: -17.5 * scale },
        stiffness: 0.7,
        length: 0
      })
    ];

    // Simplified approach - just add the torso for now
    Matter.Composite.add(this.world, torso);

    // Store the fighter body
    this.bodies.set('fighter-torso', { body: torso, type: 'fighter' });

    return torso;
  }

  createPunchingBag(x: number, y: number): Matter.Body {
    // Create chain segments for realistic swinging
    const segmentCount = 5;
    const segmentHeight = 30;
    const segments: Matter.Body[] = [];
    const constraints: Matter.Constraint[] = [];

    // Create chain segments
    for (let i = 0; i < segmentCount; i++) {
      const segment = Matter.Bodies.rectangle(x, y - 150 + i * segmentHeight, 10, segmentHeight, {
        density: 0.001,
        friction: 0.1,
        restitution: 0.1,
        label: `chain-${i}`
      });
      segments.push(segment);

      if (i === 0) {
        // Pin first segment to ceiling
        const pin = Matter.Constraint.create({
          pointA: { x, y: y - 180 },
          bodyB: segment,
          pointB: { x: 0, y: -segmentHeight / 2 },
          stiffness: 1,
          length: 0
        });
        constraints.push(pin);
      } else {
        // Connect to previous segment
        const joint = Matter.Constraint.create({
          bodyA: segments[i - 1],
          bodyB: segment,
          pointA: { x: 0, y: segmentHeight / 2 },
          pointB: { x: 0, y: -segmentHeight / 2 },
          stiffness: 0.8,
          length: 0
        });
        constraints.push(joint);
      }
    }

    // Create the bag
    const bag = Matter.Bodies.rectangle(x, y, 80, 150, {
      density: 0.003,
      friction: 0.3,
      restitution: 0.6,
      label: 'punchingBag'
    });

    // Connect bag to last chain segment
    const bagConnection = Matter.Constraint.create({
      bodyA: segments[segments.length - 1],
      bodyB: bag,
      pointA: { x: 0, y: segmentHeight / 2 },
      pointB: { x: 0, y: -75 },
      stiffness: 0.8,
      length: 0
    });
    constraints.push(bagConnection);

    const bagComposite = Matter.Composite.create({
      bodies: [...segments, bag],
      constraints
    });

    Matter.Composite.add(this.world, bagComposite);

    this.bodies.set('punchingBag', { body: bag, type: 'punchingBag' });

    return bag;
  }

  applyPunch(fromBody: Matter.Body, direction: 'left' | 'right', power: number = 1) {
    // Apply force to punching bag if it's nearby
    const bag = this.bodies.get('punchingBag');
    if (bag && bag.body) {
      const distance = Math.abs(fromBody.position.x - bag.body.position.x);
      if (distance < 150) { // Within punching range
        const forceX = direction === 'right' ? 0.08 : -0.08;
        const forceY = -0.02;
        
        Matter.Body.applyForce(bag.body, bag.body.position, {
          x: forceX * power,
          y: forceY * power
        });
      }
    }
  }

  applyKick(fromBody: Matter.Body, direction: 'left' | 'right', power: number = 1) {
    // Apply force to punching bag if it's nearby
    const bag = this.bodies.get('punchingBag');
    if (bag && bag.body) {
      const distance = Math.abs(fromBody.position.x - bag.body.position.x);
      if (distance < 180) { // Within kicking range
        const forceX = direction === 'right' ? 0.12 : -0.12;
        const forceY = -0.03;
        
        Matter.Body.applyForce(bag.body, bag.body.position, {
          x: forceX * power,
          y: forceY * power
        });
      }
    }
  }

  moveFighter(direction: 'left' | 'right' | 'jump') {
    const fighter = this.bodies.get('fighter-torso');
    if (fighter && fighter.body) {
      switch (direction) {
        case 'left':
          Matter.Body.setVelocity(fighter.body, { x: -5, y: fighter.body.velocity.y });
          break;
        case 'right':
          Matter.Body.setVelocity(fighter.body, { x: 5, y: fighter.body.velocity.y });
          break;
        case 'jump':
          if (Math.abs(fighter.body.velocity.y) < 0.1) { // Only jump if on ground
            Matter.Body.setVelocity(fighter.body, { x: fighter.body.velocity.x, y: -10 });
          }
          break;
      }
    }
  }

  getBody(key: string): PhysicsBody | undefined {
    return this.bodies.get(key);
  }

  getAllBodies(): Map<string, PhysicsBody> {
    return this.bodies;
  }

  update(deltaTime: number) {
    Matter.Engine.update(this.engine, deltaTime);
  }

  destroy() {
    this.stop();
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
    this.bodies.clear();
  }
}
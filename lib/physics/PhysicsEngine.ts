import Matter from 'matter-js';

export interface PhysicsBody {
  body: Matter.Body;
  type: 'fighter' | 'punchingBag' | 'limb';
  parent?: Matter.Body;
}

ex.1,
    });

    // Arms
    const leftUpperArm = Matter.Bodies.rectangle(x - 25 * scale, y - 10 * scale, 30 * scale, 10 * scale, {
      label: 
    });

    // Legs
    const leftUpperLeg = Matter.Bodies.rectangle(x - 10 * scale, y + 40 * scale, 12 * scale, 40 * scale, {
      label: 'leftUpperLeg',
      density: 0.001
    });
 (joints)
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
      }),
      Matter.Constraint.create({
        bodyA: leftUpperArm,
        bodyB: leftLowerArm,
        pointA: { x: -15 * scale, y: 0 },
        pointB: { x: 15 * scale, y: 0 },
        stiffness: 0.6,
        length: 0
      }),
      
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

    const fighterComposite = Matter.Composite.create({
      bodies: [torso, head, leftUpperArm, leftLowerArm, rightUpperArm, rightLowerArm, 
               leftUpperLeg, leftLowerLeg, rightUpperLeg, rightLowerLeg],
      constraints
    });rArm', { body: rightLowerArm, type: 'limb', parent: rightUpperArm });
    this.bodies.set('fighter-leftUpperLeg', { body: leftUpperLeg, type: 'limb', parent: torso });
    this.bodies.set('fighter-leftLowerLeg', { body: leftLowerLeg, type: 'limb', parent: leftUpperLeg });
    this.bodies.set('fighter-rightUpperLeg', { body: rightUpperLeg, type: 'limb', parent: torso });
  ngle(x, y - 150 + i * segmentHeight, 10, segmentHeight, {
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
        })
    
    Matter.Body.applyForce(fromBody, fromBody.position, {
      x: forceX * power,
      y: forceY * power
    });
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

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
      h: 0
      }),
      
        bodyB: rightUpperLeg,
        pointA: { x: 10 * scale, y: 30 * scale },
        pointB: { x: 0, y: -20 * scale },
        stiffness: 0.7,
        length: 0
      })

    const fighterComposite = Matter.Composite.create({
      bodies: [torso, head, leftUpperArm, leftLowerArm, rightUpperArm, rightLowerArm, 
               le

  destroy() {
    this.stop();
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
    this.bodies.clear();
  }
}

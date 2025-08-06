import Matter from 'matter-js';

export interface PhysicsBody {
  body: Matter.Body;
  type: 'fighter' | 'punchingBag' | 'limb';
  parent?: Matter.Body;


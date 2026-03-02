import { useEffect, useMemo, useState } from 'react';
import {
  Atom, FlaskConical, Leaf, Mountain,
  ChevronRight, ChevronLeft, CheckCircle2, BookOpen,
  ListOrdered, X, Award, RotateCcw, Menu
} from 'lucide-react';
import type { BreadcrumbItem } from '@/config/site';

interface LessonsPageProps {
  onBreadcrumbChange?: (items: BreadcrumbItem[]) => void;
}

interface QuizQ {
  q: string;
  opts: string[];
  correct: number;
  exp: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  paragraphs: string[];
  keyPoints: string[];
  quiz: QuizQ[];
}

interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  name: string;
  color: string;
  Icon: typeof Atom;
  units: Unit[];
}

// ─── Course data ──────────────────────────────────────────────────────────────

const COURSES: Course[] = [
  {
    id: 'physics',
    name: 'Physics',
    color: '#3B82F6',
    Icon: Atom,
    units: [
      {
        id: 'motion',
        title: 'Unit 1 — Motion',
        lessons: [
          {
            id: 'what-is-motion',
            title: 'What is Motion?',
            duration: '8 min',
            paragraphs: [
              'Motion describes how an object changes position over time relative to a reference point. Without choosing a reference frame, the concept of motion is meaningless — a passenger sitting on a moving train is stationary relative to the train but moving relative to the platform.',
              'We distinguish between distance (total path length, a scalar) and displacement (straight-line change in position, a vector). A runner who completes one full lap on a 400 m track has covered 400 m of distance but has zero displacement — they ended where they started.',
            ],
            keyPoints: [
              'Motion requires a reference frame to be meaningful',
              'Displacement is a vector: magnitude + direction',
              'Distance is a scalar: magnitude only',
              'One full loop → distance > 0, displacement = 0',
            ],
            quiz: [
              {
                q: 'A jogger runs 3 km north then 3 km south back to the start. What is their displacement?',
                opts: ['6 km', '3 km north', '0 km', '3 km south'],
                correct: 2,
                exp: 'Displacement is the change in position from start to finish. They returned to the starting point, so displacement = 0, even though distance = 6 km.',
              },
              {
                q: 'Which quantity is a vector?',
                opts: ['Speed', 'Distance', 'Time', 'Displacement'],
                correct: 3,
                exp: 'Displacement specifies both how far and in which direction, making it a vector. Speed, distance, and time are all scalars.',
              },
              {
                q: 'Why must a reference frame be defined when describing motion?',
                opts: [
                  'To convert between metric and imperial units',
                  'Motion only exists when there is friction',
                  'An object can be moving relative to one observer but stationary relative to another',
                  'Reference frames determine an object\'s mass',
                ],
                correct: 2,
                exp: 'Motion is relative. The same object can be moving from one observer\'s perspective and stationary from another\'s, so a reference frame is essential.',
              },
            ],
          },
          {
            id: 'speed-velocity',
            title: 'Speed and Velocity',
            duration: '9 min',
            paragraphs: [
              'Speed is the rate at which distance is covered: speed = distance ÷ time. It is a scalar — it tells you how fast but not which direction. Average speed over a trip uses total distance; instantaneous speed is the speed at one specific moment (what a speedometer reads).',
              'Velocity adds direction to speed: velocity = displacement ÷ time. Because velocity is a vector, two cars both travelling at 80 km/h but in opposite directions have different velocities. Changing direction alone — without changing speed — still changes velocity.',
            ],
            keyPoints: [
              'Speed = distance / time (scalar)',
              'Velocity = displacement / time (vector)',
              'Changing direction changes velocity even if speed is constant',
              'Instantaneous speed ≠ average speed if pace varies',
            ],
            quiz: [
              {
                q: 'A car travels 150 km in 2 hours. What is its average speed?',
                opts: ['300 km/h', '75 km/h', '50 km/h', '100 km/h'],
                correct: 1,
                exp: 'Average speed = total distance / time = 150 km / 2 h = 75 km/h.',
              },
              {
                q: 'A satellite orbits Earth at a constant 28 000 km/h. Is its velocity constant?',
                opts: [
                  'Yes, speed is constant so velocity is constant',
                  'No, the direction is continuously changing so velocity is not constant',
                  'Yes, satellites are not affected by velocity changes',
                  'No, because speed must also change during orbit',
                ],
                correct: 1,
                exp: 'Velocity is a vector. Even at constant speed, continuously changing direction means the velocity vector is always changing.',
              },
              {
                q: 'Which statement correctly distinguishes velocity from speed?',
                opts: [
                  'Velocity is always numerically larger than speed',
                  'Speed includes direction; velocity does not',
                  'Velocity specifies direction; speed does not',
                  'They are the same quantity measured in different units',
                ],
                correct: 2,
                exp: 'Velocity is speed with a specified direction — it is a vector quantity, while speed is a scalar.',
              },
            ],
          },
          {
            id: 'acceleration',
            title: 'Acceleration',
            duration: '10 min',
            paragraphs: [
              'Acceleration is the rate of change of velocity: a = Δv / Δt. Since velocity is a vector, any change — speeding up, slowing down, or changing direction — constitutes acceleration. A car braking at 4 m/s² is accelerating (negatively) just as much as one speeding up at 4 m/s².',
              'Free fall is a special case: near Earth\'s surface, gravity accelerates objects at 9.8 m/s² downward (often rounded to 10 m/s²). An object dropped from rest reaches roughly 98 m/s after 10 seconds, ignoring air resistance. Velocity-time graphs make this linear relationship clear — the slope equals the acceleration.',
            ],
            keyPoints: [
              'a = Δv / Δt; units: m/s²',
              'Negative acceleration (deceleration) is still acceleration',
              'Free-fall acceleration near Earth\'s surface ≈ 9.8 m/s² downward',
              'On a v-t graph, slope = acceleration',
            ],
            quiz: [
              {
                q: 'A train goes from 0 to 30 m/s in 10 seconds. What is its acceleration?',
                opts: ['300 m/s²', '3 m/s²', '0.33 m/s²', '30 m/s²'],
                correct: 1,
                exp: 'a = Δv / Δt = (30 − 0) / 10 = 3 m/s².',
              },
              {
                q: 'An object is in free fall. Which of these describes its motion?',
                opts: [
                  'Constant velocity of 9.8 m/s downward',
                  'Constant acceleration of 9.8 m/s² downward',
                  'Decreasing velocity as it falls',
                  'Zero acceleration because gravity is constant',
                ],
                correct: 1,
                exp: 'In free fall, gravity provides a constant downward acceleration of 9.8 m/s². Velocity increases with time; acceleration is constant.',
              },
              {
                q: 'What does the slope of a velocity-time graph represent?',
                opts: ['Distance', 'Displacement', 'Acceleration', 'Speed'],
                correct: 2,
                exp: 'Slope = rise/run = Δv/Δt = acceleration. A steeper slope means greater acceleration.',
              },
            ],
          },
        ],
      },
      {
        id: 'forces',
        title: 'Unit 2 — Forces',
        lessons: [
          {
            id: 'newtons-first',
            title: 'Newton\'s First Law',
            duration: '8 min',
            paragraphs: [
              'Newton\'s First Law states that an object at rest stays at rest, and an object in motion stays in motion at the same speed and direction, unless acted on by a net external force. This property of matter — resistance to changes in motion — is called inertia. More massive objects have greater inertia.',
              'Everyday life obscures this law because friction and air resistance are always present. A hockey puck sliding on ice comes much closer to demonstrating it — reducing friction allows the puck to travel far with little force. In space, without air resistance, objects genuinely continue at constant velocity indefinitely.',
            ],
            keyPoints: [
              'An object maintains its state of motion unless a net force acts',
              'Inertia is the resistance to changes in velocity',
              'Inertia increases with mass',
              'Net force = zero → constant velocity (which includes rest)',
            ],
            quiz: [
              {
                q: 'A book sits motionless on a table. What must be true about the forces on it?',
                opts: [
                  'There are no forces on the book',
                  'Only gravity acts on the book',
                  'The net force on the book is zero',
                  'The table pushes up with more force than gravity pulls down',
                ],
                correct: 2,
                exp: 'Newton\'s First Law: if the book is not accelerating, the net force must be zero. Gravity pulls down and the normal force pushes up equally.',
              },
              {
                q: 'Why does a passenger lurch forward when a bus brakes suddenly?',
                opts: [
                  'The brakes push the passenger forward',
                  'The passenger\'s inertia keeps them moving forward while the bus slows',
                  'Friction acts forward on the passenger',
                  'Gravity increases during braking',
                ],
                correct: 1,
                exp: 'The passenger\'s inertia resists the change in motion. The bus decelerates; the passenger continues forward until a force (seat belt, seat) acts on them.',
              },
              {
                q: 'Which situation best approximates Newton\'s First Law?',
                opts: [
                  'A ball rolling across carpet',
                  'A skydiver reaching terminal velocity',
                  'A hockey puck sliding on frictionless ice',
                  'A pendulum swinging back and forth',
                ],
                correct: 2,
                exp: 'A frictionless surface removes the net force opposing motion, so the puck approaches constant velocity — the condition described by Newton\'s First Law.',
              },
            ],
          },
          {
            id: 'newtons-second',
            title: 'Newton\'s Second Law',
            duration: '10 min',
            paragraphs: [
              'Newton\'s Second Law quantifies the relationship between force, mass, and acceleration: F_net = m × a. A larger net force on the same mass produces more acceleration. The same force applied to a larger mass produces less acceleration. Force is measured in Newtons (N), where 1 N = 1 kg·m/s².',
              'When multiple forces act on an object, you must find the net (resultant) force before applying the law. Forces are vectors, so opposing forces partially or fully cancel. On a free-body diagram, you draw each force as an arrow from the object in its direction; the net force is their vector sum.',
            ],
            keyPoints: [
              'F = ma; rearranges to a = F/m and m = F/a',
              '1 Newton = 1 kg·m/s²',
              'Net force is the vector sum of all forces on an object',
              'Greater mass → less acceleration for the same force',
            ],
            quiz: [
              {
                q: 'A 5 kg box is pushed with a net force of 20 N. What is its acceleration?',
                opts: ['100 m/s²', '0.25 m/s²', '4 m/s²', '25 m/s²'],
                correct: 2,
                exp: 'a = F/m = 20 N / 5 kg = 4 m/s².',
              },
              {
                q: 'What is the net force on a 3 kg object accelerating at 6 m/s²?',
                opts: ['0.5 N', '2 N', '9 N', '18 N'],
                correct: 3,
                exp: 'F = ma = 3 kg × 6 m/s² = 18 N.',
              },
              {
                q: 'Two equal and opposite 10 N forces act on an object. What is the net force?',
                opts: ['20 N', '10 N', '0 N', '5 N'],
                correct: 2,
                exp: 'Forces are vectors. Equal and opposite forces cancel: net force = 10 N − 10 N = 0 N. The object does not accelerate.',
              },
            ],
          },
          {
            id: 'newtons-third',
            title: 'Newton\'s Third Law',
            duration: '9 min',
            paragraphs: [
              'Newton\'s Third Law: for every action there is an equal and opposite reaction. Whenever object A exerts a force on object B, object B exerts an equal force back on A in the opposite direction. These action-reaction pairs always act on different objects — never on the same one.',
              'A rocket illustrates this perfectly: burning gases are pushed backward out of the engine (action), and the rocket is pushed forward (reaction). When you walk, your foot pushes backward on the ground; the ground pushes you forward. The key is that the two forces in a pair act on different objects and never cancel each other.',
            ],
            keyPoints: [
              'Action and reaction forces are equal in magnitude, opposite in direction',
              'They always act on different objects',
              'They never cancel each other (they\'re on different bodies)',
              'Rockets, walking, and swimming all rely on Newton\'s Third Law',
            ],
            quiz: [
              {
                q: 'A swimmer pushes backward on water with 80 N. How much force does the water exert on the swimmer?',
                opts: ['0 N', '40 N', '80 N forward', '160 N backward'],
                correct: 2,
                exp: 'Newton\'s Third Law: the water pushes back on the swimmer with 80 N in the forward direction — equal in magnitude, opposite in direction.',
              },
              {
                q: 'Why don\'t action-reaction forces cancel each other out?',
                opts: [
                  'They are not truly equal in magnitude',
                  'They act on different objects',
                  'One is always larger than the other',
                  'They point in the same direction',
                ],
                correct: 1,
                exp: 'Forces only cancel when they act on the same object. Action-reaction pairs act on two different objects, so they cannot cancel.',
              },
              {
                q: 'When a gun fires a bullet forward, the gun recoils backward. This is an example of:',
                opts: [
                  'Newton\'s First Law — inertia',
                  'Newton\'s Second Law — F = ma',
                  'Newton\'s Third Law — action-reaction',
                  'Conservation of energy',
                ],
                correct: 2,
                exp: 'The bullet is pushed forward (action); the gun is pushed backward with equal force (reaction). Classic Newton\'s Third Law.',
              },
            ],
          },
        ],
      },
      {
        id: 'energy',
        title: 'Unit 3 — Energy and Work',
        lessons: [
          {
            id: 'work',
            title: 'Work and Energy',
            duration: '8 min',
            paragraphs: [
              'In physics, work is done when a force displaces an object in the direction of the force: W = F × d × cos θ. If you push a wall and it doesn\'t move, you do zero work in the physics sense, even if you feel tired. Work is measured in joules (J); 1 J = 1 N·m.',
              'Energy is the capacity to do work. It comes in many forms — kinetic, potential, thermal, chemical, electrical. The work-energy theorem states that the net work done on an object equals its change in kinetic energy: W_net = ΔKE. This connects force, motion, and energy into a single powerful relationship.',
            ],
            keyPoints: [
              'W = Fd cos θ; unit is the joule (J)',
              'No displacement → no work (physics definition)',
              'Energy is the capacity to do work',
              'Net work = change in kinetic energy',
            ],
            quiz: [
              {
                q: 'A 10 N force moves a box 5 m in the direction of the force. How much work is done?',
                opts: ['2 J', '15 J', '50 J', '0.5 J'],
                correct: 2,
                exp: 'W = F × d = 10 N × 5 m = 50 J (θ = 0°, so cos 0° = 1).',
              },
              {
                q: 'You hold a heavy book stationary at arm\'s length. How much work do you do on the book?',
                opts: ['Positive work equal to the book\'s weight × height', 'Negative work', 'Zero work', 'Work equal to your muscle force'],
                correct: 2,
                exp: 'Work requires displacement. The book doesn\'t move, so displacement = 0 and W = F × 0 = 0 J.',
              },
              {
                q: 'Which best states the work-energy theorem?',
                opts: [
                  'Work equals force times acceleration',
                  'Net work done on an object equals its change in kinetic energy',
                  'Energy is always conserved in a closed system',
                  'Work and power are identical quantities',
                ],
                correct: 1,
                exp: 'The work-energy theorem: W_net = ΔKE. The net work done on an object equals how much its kinetic energy changes.',
              },
            ],
          },
          {
            id: 'ke-pe',
            title: 'Kinetic and Potential Energy',
            duration: '10 min',
            paragraphs: [
              'Kinetic energy (KE) is the energy of motion: KE = ½mv². Doubling speed quadruples kinetic energy. Gravitational potential energy (PE) is stored energy due to height: PE = mgh, where h is measured from a chosen reference level. Both are measured in joules.',
              'As objects move, energy converts between KE and PE. A roller coaster at the top of a hill has maximum PE and minimum KE; at the bottom it has maximum KE and minimum PE. At any intermediate point, total mechanical energy (KE + PE) stays constant if we ignore friction.',
            ],
            keyPoints: [
              'KE = ½mv²; doubling v → 4× the KE',
              'PE = mgh (gravitational)',
              'Energy converts between KE and PE during motion',
              'Total mechanical energy = KE + PE (no friction)',
            ],
            quiz: [
              {
                q: 'A 2 kg ball moves at 3 m/s. What is its kinetic energy?',
                opts: ['3 J', '6 J', '9 J', '12 J'],
                correct: 2,
                exp: 'KE = ½mv² = ½ × 2 × 3² = ½ × 2 × 9 = 9 J.',
              },
              {
                q: 'A 5 kg rock sits 4 m above the ground (g = 10 m/s²). What is its gravitational PE?',
                opts: ['2 J', '20 J', '200 J', '50 J'],
                correct: 2,
                exp: 'PE = mgh = 5 × 10 × 4 = 200 J.',
              },
              {
                q: 'At the top of a pendulum\'s swing it momentarily stops. Which best describes the energy?',
                opts: [
                  'Maximum KE, minimum PE',
                  'Maximum PE, maximum KE',
                  'Maximum PE, minimum KE',
                  'Both KE and PE are zero',
                ],
                correct: 2,
                exp: 'At the top, velocity = 0 so KE = 0 (minimum). Height is maximum so PE is maximum. Total mechanical energy is unchanged.',
              },
            ],
          },
          {
            id: 'conservation-energy',
            title: 'Conservation of Energy',
            duration: '9 min',
            paragraphs: [
              'The Law of Conservation of Energy states that energy cannot be created or destroyed — only converted from one form to another. In a closed system without non-conservative forces (like friction), total mechanical energy is constant: KE₁ + PE₁ = KE₂ + PE₂.',
              'When friction is present, mechanical energy decreases — but it doesn\'t disappear. It converts to thermal energy (heat) in the surfaces involved. The total energy of the universe remains constant; it just spreads into less useful forms. This is why perpetual motion machines are impossible.',
            ],
            keyPoints: [
              'Energy is never created or destroyed, only transformed',
              'KE₁ + PE₁ = KE₂ + PE₂ (no friction)',
              'Friction converts mechanical energy to thermal energy',
              'Total energy of a closed system is always conserved',
            ],
            quiz: [
              {
                q: 'A ball is dropped from 5 m. Just before hitting the ground, assuming no air resistance, its energy is:',
                opts: [
                  'All PE, no KE',
                  'Half PE, half KE',
                  'All KE, no PE (relative to ground)',
                  'Less than its original PE because some was lost',
                ],
                correct: 2,
                exp: 'With no air resistance, all the initial PE has converted to KE just before impact. No energy is lost. PE = mgh, KE = ½mv², and at ground level h = 0 so PE = 0.',
              },
              {
                q: 'A roller coaster slows due to friction. Where does the "lost" mechanical energy go?',
                opts: [
                  'It is destroyed',
                  'It converts to thermal energy in the wheels and track',
                  'It converts back to potential energy',
                  'It is stored in the atmosphere',
                ],
                correct: 1,
                exp: 'Friction converts mechanical energy to thermal energy (heat). Total energy is conserved; mechanical energy is not.',
              },
              {
                q: 'Why is a perpetual motion machine impossible?',
                opts: [
                  'Machines always need more force over time',
                  'Energy is always lost to heat and other forms, so no machine can run indefinitely without energy input',
                  'Potential energy eventually runs out',
                  'Friction does not exist in closed systems',
                ],
                correct: 1,
                exp: 'Real machines always lose some mechanical energy to heat (friction, air resistance). Conservation of energy means they can\'t generate more energy than they consume.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    color: '#A855F7',
    Icon: FlaskConical,
    units: [
      {
        id: 'atoms',
        title: 'Unit 1 — Atomic Structure',
        lessons: [
          {
            id: 'the-atom',
            title: 'Inside the Atom',
            duration: '9 min',
            paragraphs: [
              'Atoms are the smallest units of an element that retain its chemical properties. Each atom has a dense nucleus containing protons (positive charge) and neutrons (no charge), surrounded by electrons (negative charge) in energy levels or shells. The number of protons — the atomic number — defines the element.',
              'Isotopes are atoms of the same element with different numbers of neutrons, and thus different mass numbers (protons + neutrons). Carbon-12 and carbon-14 are both carbon atoms (6 protons) but carbon-14 has 2 extra neutrons. Isotopes have nearly identical chemical behaviour but different nuclear stability.',
            ],
            keyPoints: [
              'Protons: positive, in nucleus; defines the element',
              'Neutrons: neutral, in nucleus; defines the isotope',
              'Electrons: negative, in shells around nucleus',
              'Atomic number = protons; mass number = protons + neutrons',
            ],
            quiz: [
              {
                q: 'What determines which element an atom belongs to?',
                opts: ['Its number of neutrons', 'Its number of electrons', 'Its number of protons', 'Its mass number'],
                correct: 2,
                exp: 'The atomic number (number of protons) uniquely identifies an element. Carbon always has 6 protons; oxygen always has 8.',
              },
              {
                q: 'Carbon-12 and Carbon-14 are isotopes. What do they have in common?',
                opts: [
                  'The same number of neutrons',
                  'The same mass number',
                  'The same number of protons',
                  'The same number of electrons and neutrons',
                ],
                correct: 2,
                exp: 'Isotopes of the same element have the same number of protons (same atomic number) but different numbers of neutrons.',
              },
              {
                q: 'An atom has 8 protons, 8 neutrons, and 8 electrons. What is its mass number?',
                opts: ['8', '16', '24', '0'],
                correct: 1,
                exp: 'Mass number = protons + neutrons = 8 + 8 = 16. This is Oxygen-16.',
              },
            ],
          },
          {
            id: 'periodic-table',
            title: 'Reading the Periodic Table',
            duration: '10 min',
            paragraphs: [
              'The periodic table organises elements by increasing atomic number into periods (rows) and groups (columns). Elements in the same group share similar chemical properties because they have the same number of valence electrons. Metals are on the left and centre, nonmetals on the upper right, and metalloids along the staircase boundary.',
              'Key periodic trends: atomic radius decreases across a period (left to right) and increases down a group. Electronegativity (attraction for electrons in a bond) increases across a period and decreases down a group. Ionisation energy (energy to remove an electron) follows the same pattern as electronegativity.',
            ],
            keyPoints: [
              'Periods = rows; groups = columns',
              'Elements in the same group have the same number of valence electrons',
              'Atomic radius: increases down, decreases across a period',
              'Electronegativity & ionisation energy: increase across, decrease down',
            ],
            quiz: [
              {
                q: 'Why do elements in the same group react similarly?',
                opts: [
                  'They have the same atomic mass',
                  'They are all metals',
                  'They have the same number of valence electrons',
                  'They occupy the same period',
                ],
                correct: 2,
                exp: 'Valence electrons determine chemical behaviour. Elements in the same group have identical numbers of valence electrons, giving them similar reactivity.',
              },
              {
                q: 'Moving left to right across Period 3, what happens to electronegativity?',
                opts: ['It decreases', 'It stays constant', 'It increases', 'It first increases then decreases'],
                correct: 2,
                exp: 'Electronegativity increases across a period because nuclear charge increases while shielding stays roughly the same, pulling bonding electrons closer.',
              },
              {
                q: 'Which element has the largest atomic radius: Na (Period 3), Li (Period 2), or K (Period 4) — all in Group 1?',
                opts: ['Li', 'Na', 'K', 'They are equal'],
                correct: 2,
                exp: 'Atomic radius increases going down a group because each successive period adds a new electron shell. K (Period 4) has the most shells and the largest radius.',
              },
            ],
          },
          {
            id: 'electron-config',
            title: 'Electron Configuration',
            duration: '10 min',
            paragraphs: [
              'Electrons occupy energy levels (shells) around the nucleus: the first shell holds up to 2 electrons, the second up to 8, and the third also up to 8 for most main-group elements. The outermost electrons — valence electrons — are the ones involved in chemical bonding.',
              'The octet rule states that atoms tend to gain, lose, or share electrons to achieve 8 valence electrons (a full outer shell), matching the stable configuration of noble gases. Atoms with 1–3 valence electrons tend to lose them; atoms with 5–7 tend to gain them; atoms with 4 often share. Noble gases (Group 18) already have full shells.',
            ],
            keyPoints: [
              'Shell 1: max 2 electrons; Shell 2 & 3: max 8 each',
              'Valence electrons = electrons in the outermost shell',
              'Octet rule: atoms aim for 8 valence electrons',
              'Noble gases are stable because their outer shells are full',
            ],
            quiz: [
              {
                q: 'Oxygen has atomic number 8. How many valence electrons does it have?',
                opts: ['2', '6', '8', '4'],
                correct: 1,
                exp: 'Oxygen\'s 8 electrons fill shell 1 (2 electrons) and shell 2 (6 electrons). The 6 electrons in the outermost shell are its valence electrons.',
              },
              {
                q: 'Sodium (11 protons) tends to lose one electron in reactions. Why?',
                opts: [
                  'Sodium has 11 electrons which is unstable',
                  'Losing 1 electron gives sodium a full outer shell of 8, matching neon',
                  'Sodium gains electrons to fill its outer shell',
                  'Sodium has 2 valence electrons',
                ],
                correct: 1,
                exp: 'Sodium: shell 1 (2), shell 2 (8), shell 3 (1). Losing the single valence electron reveals a full second shell — very stable, like neon.',
              },
              {
                q: 'Which group of elements is chemically inert (barely reacts)?',
                opts: ['Alkali metals (Group 1)', 'Halogens (Group 17)', 'Noble gases (Group 18)', 'Transition metals'],
                correct: 2,
                exp: 'Noble gases already have full valence shells (8 electrons, or 2 for helium), so they have no tendency to gain or lose electrons.',
              },
            ],
          },
        ],
      },
      {
        id: 'bonding',
        title: 'Unit 2 — Chemical Bonding',
        lessons: [
          {
            id: 'ionic-bonds',
            title: 'Ionic Bonding',
            duration: '9 min',
            paragraphs: [
              'Ionic bonds form when one atom transfers electrons to another, creating oppositely charged ions that attract each other. Metals tend to lose electrons and form positive ions (cations); nonmetals gain electrons and form negative ions (anions). Sodium chloride (table salt) is the classic example: Na loses one electron to Cl.',
              'Ionic compounds form crystal lattices — repeating 3D grids of alternating cations and anions. This gives them high melting points (strong ionic attractions), brittle structures (displacing layers causes like-charges to align and repel), and electrical conductivity when dissolved in water or melted (ions become free to move).',
            ],
            keyPoints: [
              'Ionic bond = electron transfer between metal and nonmetal',
              'Cation (positive) + anion (negative) form a lattice',
              'High melting points due to strong electrostatic attraction',
              'Conduct electricity when dissolved or melted',
            ],
            quiz: [
              {
                q: 'Which pair of elements is most likely to form an ionic bond?',
                opts: ['Carbon and oxygen', 'Sodium and chlorine', 'Hydrogen and oxygen', 'Carbon and hydrogen'],
                correct: 1,
                exp: 'Ionic bonds typically form between metals and nonmetals. Sodium is a metal (tends to lose electrons) and chlorine is a nonmetal (tends to gain electrons).',
              },
              {
                q: 'When NaCl dissolves in water, it conducts electricity. Why?',
                opts: [
                  'Water itself is a good conductor',
                  'The Na⁺ and Cl⁻ ions are free to move and carry charge',
                  'The ionic bond becomes a covalent bond in water',
                  'Salt releases electrons into the water',
                ],
                correct: 1,
                exp: 'In solid NaCl, ions are locked in a lattice. When dissolved, they separate and move freely, allowing them to carry electric charge (electrical conduction).',
              },
              {
                q: 'What is the charge of a calcium ion (Ca, Group 2)?',
                opts: ['−2', '−1', '+1', '+2'],
                correct: 3,
                exp: 'Calcium is in Group 2 with 2 valence electrons. Losing both gives it a full outer shell and a 2+ charge: Ca²⁺.',
              },
            ],
          },
          {
            id: 'covalent-bonds',
            title: 'Covalent Bonding',
            duration: '10 min',
            paragraphs: [
              'Covalent bonds form when two nonmetals share electrons rather than transfer them. Sharing allows each atom to effectively complete its outer shell. Hydrogen gas (H₂) is the simplest example — each H atom shares its single electron to form one shared pair (a single bond).',
              'Atoms can share one, two, or three pairs of electrons, forming single, double, or triple bonds. More shared pairs mean shorter, stronger bonds. Polar covalent bonds form when one atom attracts the shared electrons more strongly (higher electronegativity), creating partial charges (δ+ and δ−). Water (H₂O) is a famous polar covalent molecule.',
            ],
            keyPoints: [
              'Covalent bond = shared electrons between nonmetals',
              'Single bond (1 pair), double (2 pairs), triple (3 pairs)',
              'More bonds → shorter and stronger',
              'Polar covalent: unequal sharing due to electronegativity difference',
            ],
            quiz: [
              {
                q: 'What type of bond holds the two atoms in O₂ (oxygen gas) together?',
                opts: ['Ionic bond', 'Metallic bond', 'Covalent bond', 'Hydrogen bond'],
                correct: 2,
                exp: 'O₂ consists of two nonmetal atoms sharing electrons — a covalent bond (specifically a double bond, sharing 4 electrons total).',
              },
              {
                q: 'In a polar covalent bond, what causes the partial charges?',
                opts: [
                  'One atom completely transfers its electrons',
                  'The two atoms have different electronegativities, causing unequal sharing',
                  'The molecule is charged overall',
                  'Electrons move back and forth at equal rates',
                ],
                correct: 1,
                exp: 'When electronegativity differs, the more electronegative atom attracts the shared electrons more, gaining a partial negative charge (δ−) while the other gets δ+.',
              },
              {
                q: 'Compare a C=C double bond to a C−C single bond. The double bond is:',
                opts: [
                  'Longer and weaker',
                  'Longer and stronger',
                  'Shorter and weaker',
                  'Shorter and stronger',
                ],
                correct: 3,
                exp: 'Double bonds share 2 pairs of electrons vs 1 pair for single bonds. More shared electrons pull the atoms closer together (shorter) and hold them more tightly (stronger).',
              },
            ],
          },
          {
            id: 'reactions-intro',
            title: 'Chemical Equations',
            duration: '9 min',
            paragraphs: [
              'A chemical equation shows reactants on the left converting to products on the right, separated by an arrow. Balancing an equation requires the same number of each type of atom on both sides — conservation of mass means atoms can\'t be created or destroyed in a reaction.',
              'Coefficients (numbers in front of formulas) are adjusted to balance equations; subscripts (numbers within a formula) cannot be changed as they define the compound. 2H₂ + O₂ → 2H₂O: we can read this as "2 molecules of hydrogen react with 1 molecule of oxygen to produce 2 molecules of water," with 4 H and 2 O on each side.',
            ],
            keyPoints: [
              'Reactants → Products; law of conservation of mass',
              'Adjust coefficients, never subscripts, to balance',
              'Same number of each atom on both sides',
              'Coefficients show molar ratios of reactants and products',
            ],
            quiz: [
              {
                q: 'Why must chemical equations be balanced?',
                opts: [
                  'To make the equation look symmetrical',
                  'Atoms must be conserved — matter cannot be created or destroyed',
                  'To ensure products are always on the right side',
                  'Balanced equations react faster',
                ],
                correct: 1,
                exp: 'The law of conservation of mass: the total mass (and number of each type of atom) must be the same before and after the reaction.',
              },
              {
                q: 'In the equation H₂ + Cl₂ → 2HCl, how many hydrogen atoms are on each side?',
                opts: ['1 on each side', '2 on the left, 2 on the right', '2 on the left, 1 on the right', '1 on the left, 2 on the right'],
                correct: 1,
                exp: 'Left: H₂ = 2 H atoms. Right: 2 HCl = 2 × 1 H = 2 H atoms. Balanced: 2 H on each side.',
              },
              {
                q: 'How do you balance __ Fe + __ O₂ → __ Fe₂O₃?',
                opts: ['1 Fe + 1 O₂ → 1 Fe₂O₃', '2 Fe + O₂ → Fe₂O₃', '4 Fe + 3 O₂ → 2 Fe₂O₃', '3 Fe + 2 O₂ → Fe₂O₃'],
                correct: 2,
                exp: '4 Fe + 3 O₂ → 2 Fe₂O₃: Left: 4 Fe, 6 O. Right: 4 Fe (2×2), 6 O (2×3). Balanced.',
              },
            ],
          },
        ],
      },
      {
        id: 'reactions',
        title: 'Unit 3 — Reactions and Acids',
        lessons: [
          {
            id: 'types-reactions',
            title: 'Types of Chemical Reactions',
            duration: '9 min',
            paragraphs: [
              'Synthesis (combination): two or more reactants form one product (A + B → AB). Decomposition: one reactant breaks into two or more products (AB → A + B). Single displacement: one element replaces another in a compound (A + BC → AC + B). Double displacement: two compounds exchange partners (AB + CD → AD + CB).',
              'Combustion reactions involve a fuel reacting rapidly with oxygen to release energy as heat and light, producing carbon dioxide and water when the fuel is a hydrocarbon. CH₄ + 2O₂ → CO₂ + 2H₂O. Recognising reaction types allows you to predict products and balance equations more efficiently.',
            ],
            keyPoints: [
              'Synthesis: A + B → AB',
              'Decomposition: AB → A + B',
              'Single displacement: A + BC → AC + B',
              'Combustion: fuel + O₂ → CO₂ + H₂O + energy',
            ],
            quiz: [
              {
                q: '2H₂ + O₂ → 2H₂O. What type of reaction is this?',
                opts: ['Decomposition', 'Single displacement', 'Synthesis (combination)', 'Double displacement'],
                correct: 2,
                exp: 'Two reactants (H₂ and O₂) combine to form one product (H₂O). That is a synthesis/combination reaction.',
              },
              {
                q: 'CaCO₃ → CaO + CO₂. What type of reaction?',
                opts: ['Synthesis', 'Decomposition', 'Combustion', 'Single displacement'],
                correct: 1,
                exp: 'One reactant breaks down into two products — decomposition.',
              },
              {
                q: 'Propane (C₃H₈) burns in oxygen. What are the products?',
                opts: [
                  'C + H₂',
                  'CO₂ and H₂O',
                  'CO₂ and H₂',
                  'C₃H₈O and water',
                ],
                correct: 1,
                exp: 'Complete combustion of a hydrocarbon always produces CO₂ and H₂O. C₃H₈ + 5O₂ → 3CO₂ + 4H₂O.',
              },
            ],
          },
          {
            id: 'acids-bases',
            title: 'Acids, Bases, and pH',
            duration: '10 min',
            paragraphs: [
              'Acids donate hydrogen ions (H⁺) in water; bases accept H⁺ or donate hydroxide ions (OH⁻). The pH scale (0–14) measures hydrogen ion concentration: pH 7 is neutral, below 7 is acidic (more H⁺), above 7 is basic (more OH⁻). Each pH unit is a factor of 10 difference in concentration.',
              'When an acid and a base react, they neutralise each other: acid + base → salt + water. HCl + NaOH → NaCl + H₂O. Strong acids (like HCl, H₂SO₄) and strong bases (like NaOH) fully dissociate in water; weak acids and bases only partially dissociate. Indicators like litmus turn red in acid and blue in base.',
            ],
            keyPoints: [
              'Acid: donates H⁺; Base: accepts H⁺ or donates OH⁻',
              'pH < 7 = acidic; pH 7 = neutral; pH > 7 = basic',
              'Each pH unit = 10× difference in [H⁺]',
              'Neutralisation: acid + base → salt + water',
            ],
            quiz: [
              {
                q: 'A solution has pH 4. Another has pH 6. How do their acidities compare?',
                opts: [
                  'pH 6 is 2× more acidic',
                  'pH 4 is 2× more acidic',
                  'pH 4 is 100× more acidic',
                  'They are equally acidic',
                ],
                correct: 2,
                exp: 'Each pH unit is a factor of 10 in [H⁺]. A difference of 2 units = 10² = 100× more acidic for pH 4.',
              },
              {
                q: 'Bleach has pH 13. It is:',
                opts: ['Strongly acidic', 'Weakly acidic', 'Neutral', 'Strongly basic'],
                correct: 3,
                exp: 'pH > 7 means basic; pH 13 is near the top of the scale — strongly basic.',
              },
              {
                q: 'What are the products of a neutralisation reaction between HNO₃ and KOH?',
                opts: [
                  'H₂ + KNO₃',
                  'KNO₃ + H₂O',
                  'K + HNO₂ + O',
                  'K₂O + HNO₃',
                ],
                correct: 1,
                exp: 'Acid + Base → salt + water. HNO₃ + KOH → KNO₃ (salt) + H₂O.',
              },
            ],
          },
          {
            id: 'reaction-rates',
            title: 'Factors Affecting Reaction Rate',
            duration: '8 min',
            paragraphs: [
              'For a reaction to occur, particles must collide with sufficient energy (activation energy) and proper orientation. Anything that increases the frequency of successful collisions increases the reaction rate. The four main factors are: concentration, temperature, surface area, and catalysts.',
              'Increasing concentration puts more particles in a given volume — collisions happen more often. Raising temperature gives particles more kinetic energy so more collisions exceed activation energy. Grinding a solid increases surface area, exposing more particles. Catalysts provide an alternative reaction pathway with lower activation energy, speeding up the reaction without being consumed.',
            ],
            keyPoints: [
              'Reactions require collisions with enough energy (activation energy)',
              'Higher concentration → more frequent collisions',
              'Higher temperature → more energetic collisions',
              'Catalysts lower activation energy without being used up',
            ],
            quiz: [
              {
                q: 'Why does a crushed tablet dissolve faster than a whole tablet?',
                opts: [
                  'It weighs less',
                  'Crushing changes its chemical composition',
                  'Increased surface area exposes more particles to react',
                  'Crushing lowers its activation energy',
                ],
                correct: 2,
                exp: 'Crushing increases surface area, exposing more particles to the solvent. More collisions per unit time → faster rate.',
              },
              {
                q: 'A catalyst speeds up a reaction. What happens to the catalyst at the end?',
                opts: [
                  'It is consumed and must be replaced',
                  'It is unchanged — it is recovered at the end',
                  'It becomes part of the product',
                  'It raises the activation energy',
                ],
                correct: 1,
                exp: 'A catalyst lowers activation energy and provides an alternative pathway but is not consumed. It is regenerated and can catalyse many reaction cycles.',
              },
              {
                q: 'Which change would NOT increase the rate of a reaction between a solid and an acid?',
                opts: [
                  'Heating the acid',
                  'Using a more concentrated acid',
                  'Powdering the solid',
                  'Cooling the mixture',
                ],
                correct: 3,
                exp: 'Cooling reduces particle kinetic energy, meaning fewer collisions exceed the activation energy. The reaction rate decreases, not increases.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'biology',
    name: 'Biology',
    color: '#10B981',
    Icon: Leaf,
    units: [
      {
        id: 'cells',
        title: 'Unit 1 — Cell Biology',
        lessons: [
          {
            id: 'cell-theory',
            title: 'Cell Theory',
            duration: '8 min',
            paragraphs: [
              'Cell theory has three core statements: (1) all living things are made of cells, (2) the cell is the basic unit of life, and (3) all cells come from pre-existing cells. These principles, developed by Schleiden, Schwann, and Virchow in the 19th century, unified biology and remain foundational.',
              'Cells come in two broad types. Prokaryotes (bacteria and archaea) have no membrane-bound nucleus; their DNA floats freely in the cytoplasm. Eukaryotes (plants, animals, fungi, protists) have a true nucleus enclosed by a nuclear envelope, and also contain membrane-bound organelles. Eukaryotic cells are generally 10× larger than prokaryotic cells.',
            ],
            keyPoints: [
              'Cell theory: cells are the basic unit of life; all from existing cells',
              'Prokaryotes: no nucleus; DNA in cytoplasm',
              'Eukaryotes: true nucleus + membrane-bound organelles',
              'Eukaryotes are generally larger and more complex',
            ],
            quiz: [
              {
                q: 'Which statement is part of the cell theory?',
                opts: [
                  'Cells require oxygen to survive',
                  'All cells have a nucleus',
                  'All living organisms are made of one or more cells',
                  'Cells can only reproduce by binary fission',
                ],
                correct: 2,
                exp: 'Cell theory: (1) all living things are made of cells, (2) cell is the basic unit of life, (3) all cells come from existing cells. Not all cells have nuclei (prokaryotes lack one).',
              },
              {
                q: 'A bacterium and a human cell both have DNA. How do they differ in storing DNA?',
                opts: [
                  'Bacteria store DNA in a nucleus; human cells do not',
                  'Bacteria have no DNA; they use RNA instead',
                  'Human cells store DNA in a membrane-bound nucleus; bacteria have DNA free in the cytoplasm',
                  'They store DNA identically',
                ],
                correct: 2,
                exp: 'Bacteria are prokaryotes: no nuclear membrane, DNA floats in cytoplasm. Human cells are eukaryotes with DNA enclosed in a nucleus.',
              },
              {
                q: 'What does "all cells come from pre-existing cells" mean for how life arises?',
                opts: [
                  'Life can spontaneously appear from non-living matter at any time',
                  'New cells only form by division of existing cells — life comes from life',
                  'Cells can form from chemicals alone in a lab',
                  'All cells originated from a single cell 100 years ago',
                ],
                correct: 1,
                exp: 'This principle (biogenesis) means new cells only arise by division of existing cells, ruling out spontaneous generation of cells from non-living matter.',
              },
            ],
          },
          {
            id: 'organelles',
            title: 'Cell Organelles',
            duration: '11 min',
            paragraphs: [
              'Organelles are specialised structures within eukaryotic cells. The nucleus houses DNA and controls cell activities. The mitochondria ("powerhouse of the cell") carry out cellular respiration, producing ATP from glucose and oxygen. Ribosomes (found on rough ER or free in cytoplasm) synthesise proteins from mRNA instructions.',
              'The endoplasmic reticulum (ER) has two forms: rough ER (studded with ribosomes) processes proteins; smooth ER synthesises lipids. The Golgi apparatus packages and dispatches proteins and lipids to their destinations. The cell membrane controls what enters and exits. Plant cells additionally have a rigid cell wall, large central vacuole, and chloroplasts for photosynthesis.',
            ],
            keyPoints: [
              'Nucleus: DNA storage; control centre',
              'Mitochondria: ATP production via cellular respiration',
              'Ribosomes: protein synthesis',
              'Chloroplasts (plant cells only): photosynthesis',
            ],
            quiz: [
              {
                q: 'Which organelle produces ATP via cellular respiration?',
                opts: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'],
                correct: 2,
                exp: 'Mitochondria carry out aerobic respiration: glucose + O₂ → ATP + CO₂ + H₂O. They are the main source of energy for most eukaryotic cells.',
              },
              {
                q: 'A student finds chloroplasts in a cell. What can they conclude?',
                opts: [
                  'The cell is from an animal',
                  'The cell is from a bacterium',
                  'The cell is from a plant or photosynthetic organism',
                  'The cell is from a fungus',
                ],
                correct: 2,
                exp: 'Chloroplasts carry out photosynthesis and are found in plants (and some protists). Animal cells and fungi lack chloroplasts.',
              },
              {
                q: 'Rough ER is "rough" because of the presence of:',
                opts: ['Lipid droplets', 'Ribosomes on its surface', 'DNA strands', 'Vacuoles'],
                correct: 1,
                exp: 'Ribosomes attached to the outer surface of the ER give it a bumpy, "rough" appearance. These ribosomes synthesise proteins that are processed in the ER.',
              },
            ],
          },
          {
            id: 'cell-transport',
            title: 'Cell Transport',
            duration: '10 min',
            paragraphs: [
              'Passive transport moves substances from high to low concentration without energy. Simple diffusion (e.g., oxygen entering cells) and osmosis (water moving across a semi-permeable membrane) are passive. Facilitated diffusion uses protein channels to help larger molecules move down their gradient, still without ATP.',
              'Active transport moves substances against their concentration gradient — from low to high concentration — and requires ATP. The sodium-potassium pump is a classic example, actively moving 3 Na⁺ out and 2 K⁺ into neurons to maintain the electrical gradient. Endocytosis and exocytosis move bulk materials in and out by folding the membrane.',
            ],
            keyPoints: [
              'Passive: high → low concentration; no ATP needed',
              'Osmosis: water moves to lower water concentration (higher solute)',
              'Active transport: low → high concentration; requires ATP',
              'Na⁺/K⁺ pump: classic active transport example',
            ],
            quiz: [
              {
                q: 'A red blood cell is placed in pure water. Water moves into the cell. This is:',
                opts: ['Active transport', 'Exocytosis', 'Osmosis', 'Facilitated diffusion'],
                correct: 2,
                exp: 'Osmosis is the passive movement of water across a semi-permeable membrane from high water concentration (pure water) to low water concentration (cell interior, which contains solutes).',
              },
              {
                q: 'Why does active transport require ATP?',
                opts: [
                  'To heat the cell membrane',
                  'Because it moves substances against their concentration gradient',
                  'Because the cell membrane is impermeable to all molecules',
                  'Passive transport uses ATP; active transport does not',
                ],
                correct: 1,
                exp: 'Moving substances against a gradient (from low to high concentration) requires energy input, which comes from ATP hydrolysis.',
              },
              {
                q: 'Oxygen moves from the lungs into blood without requiring energy. This is:',
                opts: ['Active transport', 'Endocytosis', 'Passive diffusion', 'Osmosis'],
                correct: 2,
                exp: 'Oxygen diffuses from high concentration (alveoli) to low concentration (blood) — down the gradient, no ATP required. This is passive (simple) diffusion.',
              },
            ],
          },
        ],
      },
      {
        id: 'genetics',
        title: 'Unit 2 — Genetics',
        lessons: [
          {
            id: 'dna-structure',
            title: 'DNA Structure',
            duration: '9 min',
            paragraphs: [
              'DNA (deoxyribonucleic acid) is a double helix: two strands wound around each other, connected by complementary base pairs. The four bases are adenine (A), thymine (T), guanine (G), and cytosine (C). A always pairs with T; G always pairs with C. Each strand\'s sequence is the complement of the other.',
              'The backbone of each strand consists of alternating deoxyribose sugars and phosphate groups. The sequence of bases along a DNA strand encodes genetic information. In eukaryotes, DNA is tightly coiled around histone proteins forming chromatin, which condenses into visible chromosomes during cell division.',
            ],
            keyPoints: [
              'Double helix: two complementary antiparallel strands',
              'Base pairs: A–T and G–C',
              'Backbone: alternating deoxyribose and phosphate',
              'DNA coils around histones → chromatin → chromosomes',
            ],
            quiz: [
              {
                q: 'If one strand of DNA reads 5′-ATCG-3′, what is the complementary strand?',
                opts: ['5′-ATCG-3′', '5′-TAGC-3′', '3′-TAGC-5′', '5′-UAGC-3′'],
                correct: 2,
                exp: 'Complementary base pairing: A pairs with T, C pairs with G. The complementary strand runs antiparallel (3′ to 5′). ATCG → TAGC, reading 3′→5′.',
              },
              {
                q: 'A DNA sample is 30% adenine. What percentage is guanine?',
                opts: ['30%', '20%', '70%', '10%'],
                correct: 1,
                exp: 'A pairs with T, so A% = T% = 30%. Since A + T + G + C = 100%, G + C = 40%, so G = C = 20%.',
              },
              {
                q: 'What is the role of histone proteins in DNA packaging?',
                opts: [
                  'They copy DNA during replication',
                  'DNA winds around them to compact into chromatin',
                  'They transcribe DNA into mRNA',
                  'They repair DNA damage',
                ],
                correct: 1,
                exp: 'DNA wraps around spool-like histone proteins, forming nucleosomes. This compacts the DNA enormously — 2 m of DNA fits into a cell nucleus roughly 6 µm across.',
              },
            ],
          },
          {
            id: 'protein-synthesis',
            title: 'Protein Synthesis',
            duration: '11 min',
            paragraphs: [
              'Protein synthesis has two main stages. Transcription: in the nucleus, RNA polymerase reads a DNA template strand and synthesises a complementary mRNA strand (RNA uses uracil U instead of thymine T). The mRNA travels out of the nucleus to ribosomes.',
              'Translation: ribosomes read the mRNA in triplets of bases called codons (each codon = one amino acid). Transfer RNA (tRNA) molecules carry the correct amino acid to each codon. As the ribosome moves along the mRNA, amino acids are linked into a growing polypeptide chain. The sequence of bases in DNA ultimately determines the sequence of amino acids in proteins.',
            ],
            keyPoints: [
              'Transcription: DNA → mRNA (in nucleus)',
              'Translation: mRNA → protein (at ribosomes)',
              'Codon = 3 bases on mRNA; codes for one amino acid',
              'tRNA brings the correct amino acid to each codon',
            ],
            quiz: [
              {
                q: 'During transcription, the template DNA strand is 3′-TACG-5′. What is the mRNA produced?',
                opts: ['3′-AUGC-5′', '5′-AUGC-3′', '5′-ATGC-3′', '3′-UACG-5′'],
                correct: 1,
                exp: 'mRNA is synthesised complementary and antiparallel to the template strand. T→A, A→U, C→G, G→C. Template 3′-TACG-5′ → mRNA 5′-AUGC-3′.',
              },
              {
                q: 'What is the role of tRNA in translation?',
                opts: [
                  'It transcribes DNA into mRNA',
                  'It carries amino acids to the ribosome matching each mRNA codon',
                  'It provides energy for protein synthesis',
                  'It edits the mRNA before translation',
                ],
                correct: 1,
                exp: 'Each tRNA molecule has an anticodon that base-pairs with a codon on mRNA, and it carries the corresponding amino acid. It physically delivers amino acids to build the protein.',
              },
              {
                q: 'How many nucleotides in the mRNA code for one amino acid?',
                opts: ['1', '2', '3', '4'],
                correct: 2,
                exp: 'A codon is a triplet of three mRNA nucleotides that specifies one amino acid. With 4 possible bases, 4³ = 64 codons are possible, enough to code for 20 amino acids plus stop signals.',
              },
            ],
          },
          {
            id: 'inheritance',
            title: 'Mendelian Inheritance',
            duration: '11 min',
            paragraphs: [
              'Gregor Mendel\'s experiments with pea plants established the rules of inheritance. Each organism inherits two alleles (versions) of each gene — one from each parent. Dominant alleles mask recessive ones. If an organism has two identical alleles (BB or bb), it is homozygous; two different alleles (Bb) make it heterozygous.',
              'A Punnett square predicts the probability of offspring genotypes and phenotypes. For Bb × Bb: offspring are 1 BB : 2 Bb : 1 bb (genotype ratio) and 3 dominant phenotype : 1 recessive phenotype. Mendel\'s Law of Segregation states that alleles separate during gamete formation; his Law of Independent Assortment states that alleles for different genes segregate independently.',
            ],
            keyPoints: [
              'Dominant allele masks recessive; written in capitals (B) vs lowercase (b)',
              'Homozygous: BB or bb; Heterozygous: Bb',
              'Punnett square predicts offspring ratios',
              'Monohybrid Bb × Bb → 3:1 phenotype ratio',
            ],
            quiz: [
              {
                q: 'Two heterozygous parents (Bb × Bb) cross. What fraction of offspring will be recessive (bb)?',
                opts: ['1/2', '1/4', '3/4', '0'],
                correct: 1,
                exp: 'Punnett square for Bb × Bb: BB, Bb, Bb, bb = 1:2:1 genotype ratio. Only 1 out of 4 is bb (recessive phenotype). Probability = 1/4 = 25%.',
              },
              {
                q: 'A child has blue eyes (recessive). Both parents have brown eyes (dominant). What must be the parents\' genotypes?',
                opts: [
                  'Both BB',
                  'Both bb',
                  'Both Bb (heterozygous)',
                  'One BB and one Bb',
                ],
                correct: 2,
                exp: 'Blue eyes (bb) requires b from both parents. Brown-eyed parents must each carry one b allele (Bb) to pass b to the child. They must both be heterozygous.',
              },
              {
                q: 'What does Mendel\'s Law of Segregation state?',
                opts: [
                  'Dominant alleles are more common in populations over time',
                  'Genes from different chromosomes assort independently',
                  'The two alleles of a gene separate during gamete formation',
                  'All offspring of two heterozygous parents will be heterozygous',
                ],
                correct: 2,
                exp: 'Segregation: the two alleles in a parent separate (segregate) during meiosis so that each gamete receives only one allele for each gene.',
              },
            ],
          },
        ],
      },
      {
        id: 'ecology',
        title: 'Unit 3 — Ecology',
        lessons: [
          {
            id: 'ecosystems',
            title: 'Ecosystems',
            duration: '8 min',
            paragraphs: [
              'An ecosystem comprises all the living organisms (biotic factors) and non-living components (abiotic factors — sunlight, water, temperature, soil) in an area, all interacting together. Ecosystems can be as small as a puddle or as large as a tropical rainforest. The key is that energy and matter flow among all components.',
              'Within an ecosystem, populations (all individuals of one species in an area) form communities (all populations). Biomes are broad ecological regions defined by climate and vegetation — examples include tropical rainforest, tundra, desert, and coral reef. Each biome has characteristic species adapted to its conditions.',
            ],
            keyPoints: [
              'Ecosystem = biotic (living) + abiotic (non-living) components',
              'Population = same species in one area',
              'Community = all populations in an ecosystem',
              'Biome = large-scale ecosystem defined by climate and vegetation',
            ],
            quiz: [
              {
                q: 'Which is an abiotic factor in a forest ecosystem?',
                opts: ['Oak trees', 'Earthworms', 'Soil bacteria', 'Soil pH'],
                correct: 3,
                exp: 'Abiotic factors are non-living components. Soil pH is a chemical property of the environment. Oak trees, earthworms, and bacteria are living (biotic) components.',
              },
              {
                q: 'What is the difference between a population and a community?',
                opts: [
                  'A population includes multiple species; a community includes one',
                  'A population is all individuals of one species; a community includes all populations in an area',
                  'They are the same concept at different scales',
                  'A community includes only abiotic factors',
                ],
                correct: 1,
                exp: 'Population: all members of one species in an area. Community: all the different populations (of different species) living together in that area.',
              },
              {
                q: 'The Amazon rainforest and the Sahara desert are examples of different:',
                opts: ['Populations', 'Communities', 'Biomes', 'Habitats of the same ecosystem'],
                correct: 2,
                exp: 'Biomes are large regions characterised by climate and dominant vegetation types. The rainforest (warm, wet) and desert (hot, dry) are distinct biomes.',
              },
            ],
          },
          {
            id: 'energy-flow',
            title: 'Energy Flow in Ecosystems',
            duration: '9 min',
            paragraphs: [
              'Energy enters ecosystems through producers (plants, algae) via photosynthesis, converting sunlight to chemical energy. Primary consumers (herbivores) eat producers; secondary consumers eat primary consumers; tertiary consumers sit at the top. These feeding levels are called trophic levels.',
              'Energy transfer between trophic levels is inefficient — roughly 10% of energy is passed up each level. The rest is lost as heat or used for the organism\'s own metabolism. This is why food chains rarely exceed 4–5 levels: too little energy remains at higher levels to support large populations. Energy pyramids graphically show this diminishing energy at each trophic level.',
            ],
            keyPoints: [
              'Energy enters via photosynthesis (producers)',
              'Trophic levels: producer → primary → secondary → tertiary consumer',
              '~10% of energy transferred to next trophic level',
              'Energy pyramids are wide at base, narrow at top',
            ],
            quiz: [
              {
                q: 'A meadow produces 10 000 kJ of energy. Approximately how much is available to primary consumers (herbivores)?',
                opts: ['10 000 kJ', '5 000 kJ', '1 000 kJ', '100 kJ'],
                correct: 2,
                exp: 'About 10% of energy passes to the next trophic level. 10% × 10 000 = 1 000 kJ reaches primary consumers.',
              },
              {
                q: 'Why are food chains rarely longer than five trophic levels?',
                opts: [
                  'There are not enough species to fill higher levels',
                  'Top predators eat everything below them',
                  'Too little energy remains at higher levels to sustain populations',
                  'Photosynthesis does not provide enough energy for more than five levels',
                ],
                correct: 2,
                exp: 'With only ~10% energy transfer at each level, by the fifth level only 0.001% of the original energy remains — not enough to sustain a viable population.',
              },
              {
                q: 'Which organism occupies the base of every energy pyramid?',
                opts: ['Top predator', 'Decomposer', 'Producer (e.g., plant)', 'Primary consumer'],
                correct: 2,
                exp: 'Producers (plants, algae) capture sunlight energy via photosynthesis and form the base of all food chains and energy pyramids.',
              },
            ],
          },
          {
            id: 'human-impact',
            title: 'Human Impact on Ecosystems',
            duration: '9 min',
            paragraphs: [
              'Humans alter ecosystems through deforestation, pollution, overfishing, and habitat fragmentation. Deforestation removes carbon sinks, increases CO₂, and destroys habitats — driving biodiversity loss. Nutrient run-off from agriculture causes eutrophication in waterways: excess nitrogen and phosphorus trigger algal blooms, which deplete oxygen and kill aquatic life.',
              'Introduced (invasive) species disrupt ecosystems by outcompeting native species that have no defence against them. Climate change, driven by greenhouse gas emissions, shifts temperature and precipitation patterns, pushing species beyond their thermal tolerances and altering migration and breeding cycles. Conservation strategies include protected areas, habitat corridors, captive breeding, and international agreements.',
            ],
            keyPoints: [
              'Deforestation: habitat loss + increased CO₂',
              'Eutrophication: nutrient run-off → algal bloom → oxygen depletion',
              'Invasive species: outcompete natives with no natural predators',
              'Climate change: shifts habitats and disrupts life cycles',
            ],
            quiz: [
              {
                q: 'Agricultural run-off containing nitrates and phosphates reaches a lake. What is the likely outcome?',
                opts: [
                  'The lake water becomes more acidic and kills fish',
                  'Algal bloom → oxygen depletion → fish die-off (eutrophication)',
                  'Native plants grow more quickly, absorbing the nutrients',
                  'The lake becomes saltier, changing the species present',
                ],
                correct: 1,
                exp: 'Excess nutrients trigger eutrophication: rapid algal growth shades out other plants, then the decomposition of dead algae depletes oxygen, suffocating fish and invertebrates.',
              },
              {
                q: 'Why are invasive species particularly damaging to native ecosystems?',
                opts: [
                  'They release toxins that kill native species',
                  'Native species have no evolved defences or predators against them',
                  'Invasive species prevent native species from reproducing',
                  'They always carry diseases that spread to native species',
                ],
                correct: 1,
                exp: 'Native species have not evolved alongside the invader, so lack natural predators, diseases, or competitive strategies to resist it. Invasive species often grow unchecked.',
              },
              {
                q: 'Which strategy directly addresses habitat fragmentation?',
                opts: [
                  'Carbon credits',
                  'Wildlife habitat corridors connecting isolated patches',
                  'Reducing plastic waste',
                  'Marine protected areas',
                ],
                correct: 1,
                exp: 'Habitat corridors are strips of natural habitat that link isolated patches, allowing animals to move, find mates, and maintain genetic diversity despite surrounding development.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'earth',
    name: 'Earth Science',
    color: '#F59E0B',
    Icon: Mountain,
    units: [
      {
        id: 'interior',
        title: 'Unit 1 — Earth\'s Structure',
        lessons: [
          {
            id: 'layers',
            title: 'Layers of the Earth',
            duration: '8 min',
            paragraphs: [
              'Earth has four main layers. The thin outer crust (5–70 km thick) is the rigid surface we live on. Below it, the mantle (down to ~2 900 km) is solid rock that behaves plastically over long timescales — it flows very slowly. The outer core (~2 900–5 150 km) is liquid iron-nickel; the inner core is solid iron-nickel under immense pressure.',
              'We know Earth\'s internal structure largely through seismology. P-waves (compressional) and S-waves (shear) travel through Earth after earthquakes and change speed and direction at layer boundaries (refraction) and cannot pass through liquids (S-waves). Analysing seismic wave paths allows geologists to infer each layer\'s depth, composition, and state.',
            ],
            keyPoints: [
              'Crust → Mantle → Outer core (liquid) → Inner core (solid)',
              'Mantle is solid rock that flows very slowly (plastic)',
              'Outer core: liquid iron-nickel; generates Earth\'s magnetic field',
              'Seismic waves reveal Earth\'s interior structure',
            ],
            quiz: [
              {
                q: 'Which layer of Earth generates the planet\'s magnetic field?',
                opts: ['Crust', 'Mantle', 'Outer core', 'Inner core'],
                correct: 2,
                exp: 'The liquid outer core, composed of iron-nickel, creates a geodynamo through convection — this circulation generates Earth\'s magnetic field.',
              },
              {
                q: 'S-waves (shear waves) cannot travel through liquids. What does this tell us about the outer core?',
                opts: [
                  'The outer core is solid',
                  'The outer core is liquid',
                  'The outer core is made of rock',
                  'S-waves are too weak to reach the outer core',
                ],
                correct: 1,
                exp: 'S-waves disappear (create a shadow zone) where the outer core begins, showing that the outer core is liquid — S-waves cannot propagate through fluids.',
              },
              {
                q: 'Moving from Earth\'s surface to its centre, what is the correct order of layers?',
                opts: [
                  'Mantle → Crust → Outer core → Inner core',
                  'Crust → Outer core → Mantle → Inner core',
                  'Crust → Mantle → Outer core → Inner core',
                  'Inner core → Outer core → Mantle → Crust',
                ],
                correct: 2,
                exp: 'From surface inward: Crust (thinnest), Mantle (largest volume), Outer core (liquid), Inner core (solid, centre).',
              },
            ],
          },
          {
            id: 'plate-tectonics',
            title: 'Plate Tectonics',
            duration: '11 min',
            paragraphs: [
              'Earth\'s lithosphere (crust + upper mantle) is broken into about 15 major tectonic plates that move over the softer asthenosphere at rates of 1–10 cm per year — roughly as fast as a fingernail grows. The driving force is mantle convection: heat from Earth\'s interior sets up circulation cells that drag the overlying plates.',
              'Plates interact at boundaries in three ways. Divergent boundaries: plates move apart, new oceanic crust forms (mid-ocean ridges), e.g., Mid-Atlantic Ridge. Convergent boundaries: plates collide — denser oceanic crust subducts under continental crust, causing volcanoes and deep-ocean trenches, e.g., the Andes. Transform boundaries: plates slide past each other horizontally, producing earthquakes, e.g., San Andreas Fault.',
            ],
            keyPoints: [
              'Lithosphere is broken into ~15 major tectonic plates',
              'Plates move via mantle convection (~1–10 cm/yr)',
              'Divergent: plates separate; new crust forms',
              'Convergent: plates collide; subduction, volcanoes, mountains',
            ],
            quiz: [
              {
                q: 'New oceanic crust is continually being created at which type of plate boundary?',
                opts: ['Convergent', 'Transform', 'Divergent', 'Subduction zone'],
                correct: 2,
                exp: 'At divergent boundaries (mid-ocean ridges), plates move apart and magma wells up to form new oceanic crust. The Atlantic Ocean is widening by ~2–3 cm/year.',
              },
              {
                q: 'The Himalayas formed when India collided with Asia. What type of boundary is this?',
                opts: ['Divergent', 'Transform', 'Convergent (continent-continent)', 'Hot spot'],
                correct: 2,
                exp: 'When two continental plates converge, neither subducts (both are buoyant). Instead, the crust buckles upward, building mountain ranges like the Himalayas.',
              },
              {
                q: 'What drives tectonic plate movement?',
                opts: [
                  'The Moon\'s gravitational pull',
                  'Rotation of Earth\'s inner core',
                  'Convection currents in the mantle',
                  'Ocean currents pushing on continental crust',
                ],
                correct: 2,
                exp: 'Heat from Earth\'s interior drives convection in the mantle. Hot material rises, spreads sideways under the lithosphere, drags plates, cools, and sinks again — forming a convection cell.',
              },
            ],
          },
          {
            id: 'earthquakes',
            title: 'Earthquakes',
            duration: '9 min',
            paragraphs: [
              'Earthquakes occur when stress accumulated along faults (fractures in rock) is suddenly released, generating seismic waves. The focus (or hypocenter) is the underground point where the rupture begins; the epicentre is the point on the surface directly above the focus. Most earthquakes occur at tectonic plate boundaries, particularly at convergent and transform boundaries.',
              'Seismographs record seismic waves: P-waves arrive first (fast, compressional), S-waves next (slower, shear), then surface waves (slowest, most destructive). The Richter scale and moment magnitude scale (Mw) measure earthquake energy; each whole-number increase represents ~31.6× more energy released. Tsunamis are triggered when underwater earthquakes vertically displace the seafloor, generating long-wavelength ocean waves.',
            ],
            keyPoints: [
              'Focus: underground rupture point; Epicentre: surface directly above',
              'P-waves arrive first; S-waves second; surface waves most destructive',
              'Mw scale: each +1 unit ≈ 31.6× more energy',
              'Subduction-zone megaquakes commonly trigger tsunamis',
            ],
            quiz: [
              {
                q: 'The epicentre of an earthquake is:',
                opts: [
                  'The underground point where the fault ruptures',
                  'The point on the surface directly above the focus',
                  'The city closest to the fault',
                  'The point of maximum shaking',
                ],
                correct: 1,
                exp: 'The focus (hypocenter) is the underground rupture origin. The epicentre is directly above it on the surface — this is where shaking is usually most intense.',
              },
              {
                q: 'Which seismic waves arrive at a seismograph first?',
                opts: ['Surface waves', 'S-waves', 'P-waves', 'L-waves'],
                correct: 2,
                exp: 'P-waves (primary/compressional) travel fastest through rock and arrive first. S-waves arrive second; surface waves travel slowest but carry the most destructive energy.',
              },
              {
                q: 'A magnitude 7 earthquake releases how much more energy than a magnitude 6?',
                opts: ['2×', '10×', '~32×', '100×'],
                correct: 2,
                exp: 'Each integer step on the moment magnitude scale corresponds to ~31.6× more energy released (approximately 10^1.5 ≈ 31.6). Magnitude 7 = ~32× the energy of magnitude 6.',
              },
            ],
          },
        ],
      },
      {
        id: 'atmosphere',
        title: 'Unit 2 — Atmosphere and Climate',
        lessons: [
          {
            id: 'atm-layers',
            title: 'Layers of the Atmosphere',
            duration: '8 min',
            paragraphs: [
              'Earth\'s atmosphere is divided into layers by temperature profile. The troposphere (0–12 km) contains 75% of atmospheric mass and all weather; temperature decreases with altitude. The stratosphere (12–50 km) contains the ozone layer that absorbs harmful UV; temperature increases with altitude here.',
              'Above the stratosphere: the mesosphere (50–80 km) where temperature again decreases and meteors burn up; and the thermosphere (80–600 km) where temperature rises dramatically as thin gas absorbs solar X-rays and UV. The International Space Station orbits in the thermosphere. The exosphere, above ~600 km, gradually fades into space.',
            ],
            keyPoints: [
              'Troposphere: weather; temperature decreases with height',
              'Stratosphere: ozone layer; temperature increases with height',
              'Mesosphere: meteors burn up; temperature decreases',
              'Thermosphere: ISS orbits here; extremely hot but very thin',
            ],
            quiz: [
              {
                q: 'Where does all Earth\'s weather occur?',
                opts: ['Stratosphere', 'Mesosphere', 'Troposphere', 'Thermosphere'],
                correct: 2,
                exp: 'The troposphere contains most of the atmosphere\'s mass and all its water vapor. All weather — clouds, rain, wind, storms — occurs here.',
              },
              {
                q: 'In which layer does the ozone layer protect Earth from UV radiation?',
                opts: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Exosphere'],
                correct: 1,
                exp: 'The ozone layer sits in the stratosphere (~15–35 km altitude), where ozone molecules absorb most of the Sun\'s harmful ultraviolet radiation before it reaches the surface.',
              },
              {
                q: 'Meteors from space typically burn up in which atmospheric layer?',
                opts: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
                correct: 2,
                exp: 'Meteors usually burn up in the mesosphere (~50–80 km altitude) due to friction with atmospheric gas. This is why we see "shooting stars" high in the sky.',
              },
            ],
          },
          {
            id: 'weather-climate',
            title: 'Weather vs. Climate',
            duration: '9 min',
            paragraphs: [
              'Weather is the day-to-day state of the atmosphere at a specific place — temperature, humidity, wind speed, precipitation. Climate is the long-term average of weather patterns over 30+ years for a region. "Climate is what you expect; weather is what you get." London\'s climate is mild and rainy, but any specific day could be sunny and dry.',
              'Climate zones are controlled by latitude, altitude, ocean currents, and distance from the sea. The Coriolis effect — deflection of moving air by Earth\'s rotation — drives prevailing winds and shapes global circulation cells (Hadley, Ferrel, Polar cells). These circulation cells determine where deserts, rainforests, and temperate zones form.',
            ],
            keyPoints: [
              'Weather: short-term atmospheric conditions at one location',
              'Climate: 30-year average weather patterns for a region',
              'Climate controlled by latitude, altitude, ocean currents',
              'Coriolis effect deflects winds due to Earth\'s rotation',
            ],
            quiz: [
              {
                q: 'A meteorologist says it will rain tomorrow. A climatologist says the region is arid. Which best illustrates the difference between weather and climate?',
                opts: [
                  'They are both wrong — you can\'t predict either',
                  'Weather (tomorrow\'s rain) is a short-term event; the arid climate is the long-term average condition',
                  'Climate predicts tomorrow; weather describes the past',
                  'They describe the same thing at different times',
                ],
                correct: 1,
                exp: 'Weather is a specific short-term event (tomorrow\'s rain). Climate is the statistical average over decades — a typically arid region can still have rare rain events.',
              },
              {
                q: 'Why does temperature generally decrease as altitude increases in the troposphere?',
                opts: [
                  'There is less gravity at higher altitudes',
                  'Air pressure increases with altitude',
                  'The surface is the primary source of heat; air loses heat with distance from it',
                  'The Sun heats the atmosphere from above',
                ],
                correct: 2,
                exp: 'Earth\'s surface absorbs solar radiation and warms the air above it. As you move higher, you\'re farther from this heat source and the air is less dense, so temperature drops.',
              },
              {
                q: 'The Coriolis effect causes moving air to deflect. In the Northern Hemisphere, air deflects:',
                opts: ['Leftward (counterclockwise)', 'Rightward (clockwise)', 'Directly toward the poles', 'Directly toward the equator'],
                correct: 1,
                exp: 'In the Northern Hemisphere, Earth\'s rotation causes moving objects (including air) to deflect to the right. This creates clockwise rotation in high-pressure systems.',
              },
            ],
          },
          {
            id: 'climate-change',
            title: 'Climate Change',
            duration: '10 min',
            paragraphs: [
              'The greenhouse effect is a natural process: atmospheric gases (CO₂, water vapor, methane) absorb infrared radiation from Earth\'s surface and radiate it back, warming the planet. Without it, Earth would be about −18 °C on average. Human activities — burning fossil fuels, deforestation, agriculture — have increased atmospheric CO₂ from ~280 ppm pre-industrial to over 420 ppm today, enhancing the greenhouse effect.',
              'Consequences of anthropogenic (human-caused) climate change include rising global average temperatures, melting ice sheets and glaciers, rising sea levels, more frequent extreme weather events, and shifts in species ranges and phenology (timing of life-cycle events). The IPCC (Intergovernmental Panel on Climate Change) synthesises global scientific research on these trends. Mitigation strategies include transitioning to renewable energy, improving energy efficiency, and protecting forests.',
            ],
            keyPoints: [
              'Greenhouse effect is natural; enhancement is human-caused',
              'CO₂ risen from ~280 ppm to 420+ ppm since industrialisation',
              'Consequences: temperature rise, sea-level rise, extreme weather',
              'Mitigation: renewables, efficiency, reforestation',
            ],
            quiz: [
              {
                q: 'Without the natural greenhouse effect, Earth\'s average temperature would be:',
                opts: ['Similar to today', 'About 30 °C warmer', 'About 33 °C colder (roughly −18 °C)', 'Impossible to determine'],
                correct: 2,
                exp: 'The natural greenhouse effect keeps Earth roughly 33 °C warmer than it would be otherwise. Without it, the average surface temperature would be about −18 °C.',
              },
              {
                q: 'Which human activity is the largest single contributor to increased atmospheric CO₂?',
                opts: [
                  'Agriculture',
                  'Deforestation',
                  'Burning fossil fuels (coal, oil, gas)',
                  'Manufacturing cement',
                ],
                correct: 2,
                exp: 'Burning fossil fuels (for energy and transport) is responsible for approximately 75% of global CO₂ emissions, making it the dominant driver of the enhanced greenhouse effect.',
              },
              {
                q: 'Rising sea levels from climate change are primarily caused by:',
                opts: [
                  'Increased rainfall filling the oceans',
                  'Thermal expansion of seawater and melting of land ice',
                  'Tectonic subsidence of ocean floor',
                  'Reduced evaporation from warmer seas',
                ],
                correct: 1,
                exp: 'Two main factors: (1) water expands as it warms (thermal expansion) and (2) ice sheets and glaciers on land melt, adding water to the ocean. Together they account for observed sea-level rise.',
              },
            ],
          },
        ],
      },
      {
        id: 'space',
        title: 'Unit 3 — Oceans and Space',
        lessons: [
          {
            id: 'ocean-structure',
            title: 'Ocean Structure',
            duration: '8 min',
            paragraphs: [
              'Oceans cover 71% of Earth\'s surface and average 3 700 m in depth. They are layered by temperature and light. The sunlit zone (0–200 m) receives enough light for photosynthesis and supports most marine life. Below it, the twilight zone (200–1 000 m) has dim light. Below 1 000 m, no sunlight penetrates at all — the midnight zone is cold, dark, and at high pressure.',
              'Ocean currents redistribute heat globally. Surface currents are driven by wind; deep currents form from density differences caused by temperature and salinity — this global circulation is the thermohaline circulation (or "ocean conveyor belt"). El Niño events occur when trade winds weaken and warm Pacific water spreads east, disrupting weather worldwide.',
            ],
            keyPoints: [
              'Sunlit zone (0–200 m): photosynthesis, most marine life',
              'Below 1 000 m: no light, high pressure, cold',
              'Surface currents: wind-driven; deep currents: density-driven',
              'Thermohaline circulation redistributes global heat',
            ],
            quiz: [
              {
                q: 'Why does most marine life concentrate in the sunlit zone (0–200 m)?',
                opts: [
                  'The pressure is lowest at the surface',
                  'Sunlight enables photosynthesis by phytoplankton, forming the base of the food web',
                  'Salt concentration is highest near the surface',
                  'Temperatures are colder at depth, limiting life',
                ],
                correct: 1,
                exp: 'Sunlight drives photosynthesis by phytoplankton and algae, producing the primary energy that supports virtually all marine food webs. Without light, this base disappears.',
              },
              {
                q: 'What drives deep-ocean (thermohaline) circulation?',
                opts: [
                  'Wind acting on the ocean surface',
                  'Tides from the Moon',
                  'Differences in temperature and salinity creating density differences',
                  'Volcanic activity at mid-ocean ridges',
                ],
                correct: 2,
                exp: 'Cold, salty water is denser and sinks; warm, fresher water is less dense and rises. These density differences drive the global thermohaline circulation ("ocean conveyor belt").',
              },
              {
                q: 'An El Niño event is associated with:',
                opts: [
                  'Stronger-than-normal trade winds cooling the Pacific',
                  'Weakening trade winds and warmer-than-normal sea surface temperatures in the eastern Pacific',
                  'A sudden increase in deep-ocean currents',
                  'Increased volcanic activity in the Pacific',
                ],
                correct: 1,
                exp: 'During El Niño, trade winds weaken, allowing warm water pooled in the western Pacific to flow east. This raises sea-surface temperatures in the central/eastern Pacific, altering weather patterns globally.',
              },
            ],
          },
          {
            id: 'solar-system',
            title: 'The Solar System',
            duration: '10 min',
            paragraphs: [
              'Our solar system formed ~4.6 billion years ago from a collapsing cloud of gas and dust. The Sun (a G-type main-sequence star) contains 99.8% of the system\'s mass. The eight planets orbit in roughly the same plane, in order from the Sun: Mercury, Venus, Earth, Mars (terrestrial, rocky planets), then Jupiter, Saturn, Uranus, Neptune (gas and ice giants).',
              'Between Mars and Jupiter lies the asteroid belt. Beyond Neptune are the Kuiper Belt (icy bodies including Pluto) and the Oort Cloud (very distant reservoir of comets). Planets stay in orbit because gravity provides the centripetal force balancing their forward momentum. A planet with more orbital velocity would fly off; less and it would spiral inward — the balance produces a stable elliptical orbit.',
            ],
            keyPoints: [
              'Inner planets (1–4): rocky terrestrial; outer (5–8): gas/ice giants',
              'Sun = 99.8% of solar system mass',
              'Asteroid belt between Mars and Jupiter',
              'Gravity provides centripetal force for stable orbits',
            ],
            quiz: [
              {
                q: 'Which planet is the largest in our solar system?',
                opts: ['Saturn', 'Neptune', 'Jupiter', 'Uranus'],
                correct: 2,
                exp: 'Jupiter is by far the largest planet — more than twice the mass of all other planets combined. It is a gas giant composed mostly of hydrogen and helium.',
              },
              {
                q: 'What keeps Earth in a stable orbit around the Sun rather than flying off into space or falling into the Sun?',
                opts: [
                  'Earth\'s magnetic field repels the Sun',
                  'The Moon\'s gravity balances the Sun\'s pull',
                  'The balance between Earth\'s orbital velocity (centrifugal tendency) and the Sun\'s gravity',
                  'Dark matter surrounding the solar system',
                ],
                correct: 2,
                exp: 'Earth\'s tangential orbital velocity and the Sun\'s gravitational pull are in balance. Gravity provides the centripetal force curving Earth\'s path into a stable orbit.',
              },
              {
                q: 'Pluto is classified as a dwarf planet partly because it:',
                opts: [
                  'Is smaller than the Moon',
                  'Has no moons',
                  'Has not cleared the neighbourhood of its orbit',
                  'Is made of gas rather than rock',
                ],
                correct: 2,
                exp: 'The IAU definition of a planet requires "clearing the neighbourhood" of its orbital path. Pluto shares its orbital region with many Kuiper Belt objects, so it was reclassified as a dwarf planet in 2006.',
              },
            ],
          },
          {
            id: 'stars-galaxies',
            title: 'Stars and Galaxies',
            duration: '10 min',
            paragraphs: [
              'Stars are enormous spheres of plasma powered by nuclear fusion: hydrogen nuclei fuse to form helium in the core, releasing tremendous energy. A star\'s life cycle depends on its mass. Sun-like stars spend billions of years on the main sequence, then expand into red giants before shedding their outer layers (forming a planetary nebula) and leaving a white dwarf. Massive stars end in supernova explosions, leaving neutron stars or black holes.',
              'Galaxies are vast collections of stars, gas, dust, and dark matter held together by gravity. The Milky Way is a barred spiral galaxy roughly 100 000 light-years across, containing 200–400 billion stars. Our solar system sits about 26 000 light-years from the centre. The universe contains an estimated 2 trillion galaxies, separated by mostly empty space. The Big Bang, roughly 13.8 billion years ago, marks the origin of the universe.',
            ],
            keyPoints: [
              'Stars are powered by hydrogen fusion in their cores',
              'A star\'s life cycle depends on its mass',
              'Sun-like stars → red giant → white dwarf',
              'Milky Way: barred spiral, ~100 000 light-years across',
            ],
            quiz: [
              {
                q: 'What process powers a star like our Sun?',
                opts: [
                  'Chemical combustion of hydrogen',
                  'Nuclear fission of uranium in the core',
                  'Nuclear fusion of hydrogen into helium',
                  'Gravitational compression alone',
                ],
                correct: 2,
                exp: 'Stars generate energy through nuclear fusion: four hydrogen nuclei (protons) fuse to form one helium nucleus, releasing enormous energy according to E = mc².',
              },
              {
                q: 'After exhausting its hydrogen fuel, a Sun-like star will first become:',
                opts: ['A neutron star', 'A black hole', 'A red giant', 'A white dwarf'],
                correct: 2,
                exp: 'When core hydrogen is exhausted, the core contracts and outer layers expand and cool, turning the star into a red giant. Our Sun will reach this phase in ~5 billion years.',
              },
              {
                q: 'The Milky Way galaxy is best described as:',
                opts: [
                  'An elliptical galaxy with no defined structure',
                  'A barred spiral galaxy containing hundreds of billions of stars',
                  'An irregular galaxy containing only young stars',
                  'A satellite galaxy of Andromeda',
                ],
                correct: 1,
                exp: 'The Milky Way is a barred spiral galaxy — it has a central bar-shaped structure and spiral arms. It contains 200–400 billion stars including our Sun.',
              },
            ],
          },
        ],
      },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function flatLessons(course: Course) {
  return course.units.flatMap(u => u.lessons.map(l => ({ unitTitle: u.title, unitId: u.id, lesson: l })));
}

const STORAGE_KEY = 'sciencespire-lessons-v1';

function loadProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveProgress(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch { /* quota */ }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LessonsPage({ onBreadcrumbChange }: LessonsPageProps) {
  const [courseId, setCourseId] = useState('physics');
  const [lessonId, setLessonId] = useState('what-is-motion');
  const [completed, setCompleted] = useState<Set<string>>(loadProgress);
  const [quizPhase, setQuizPhase] = useState<'idle' | 'active' | 'done'>('idle');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const course = COURSES.find(c => c.id === courseId)!;
  const ordered = useMemo(() => flatLessons(course), [course]);
  const currentEntry = ordered.find(e => e.lesson.id === lessonId) ?? ordered[0];
  const lesson = currentEntry.lesson;
  const currentIdx = ordered.indexOf(currentEntry);
  const prevEntry = currentIdx > 0 ? ordered[currentIdx - 1] : null;
  const nextEntry = currentIdx < ordered.length - 1 ? ordered[currentIdx + 1] : null;
  const lessonKey = `${courseId}:${lessonId}`;
  const isDone = completed.has(lessonKey);

  const score = useMemo(() => {
    if (quizPhase !== 'done') return null;
    return lesson.quiz.filter((q, i) => answers[i] === q.correct).length;
  }, [quizPhase, lesson.quiz, answers]);

  useEffect(() => {
    setQuizPhase('idle');
    setAnswers({});
  }, [lessonId]);

  useEffect(() => {
    if (!onBreadcrumbChange) return;
    onBreadcrumbChange([{ label: course.name }, { label: currentEntry.unitTitle }, { label: lesson.title }]);
  }, [course.name, currentEntry.unitTitle, lesson.title, onBreadcrumbChange]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const markComplete = () => {
    const next = new Set(completed);
    next.add(lessonKey);
    setCompleted(next);
    saveProgress(next);
    showToast('Lesson marked complete!');
    if (nextEntry) { setLessonId(nextEntry.lesson.id); }
  };

  const submitQuiz = () => {
    setQuizPhase('done');
    const s = lesson.quiz.filter((q, i) => answers[i] === q.correct).length;
    if (s === lesson.quiz.length) {
      const next = new Set(completed);
      next.add(lessonKey);
      setCompleted(next);
      saveProgress(next);
    }
    showToast(`Quiz scored: ${s}/${lesson.quiz.length}`);
  };

  const completedCount = ordered.filter(e => completed.has(`${courseId}:${e.lesson.id}`)).length;

  return (
    <div className="space-y-4 relative">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>
            Lessons
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Structured science courses — read, learn, quiz yourself
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
          {completedCount}/{ordered.length} lessons done
        </div>
      </div>

      {/* Course selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {COURSES.map(c => {
          const Icon = c.Icon;
          const active = c.id === courseId;
          return (
            <button
              key={c.id}
              onClick={() => { setCourseId(c.id); const first = flatLessons(c)[0]; setLessonId(first.lesson.id); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border shrink-0 transition-all duration-200"
              style={{
                backgroundColor: active ? c.color : 'var(--card)',
                color: active ? '#fff' : 'var(--text-secondary)',
                borderColor: active ? c.color : 'var(--border)',
                boxShadow: active ? `0 2px 8px ${c.color}40` : 'none',
              }}
            >
              <Icon size={16} />
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Main layout */}
      <div className="flex gap-5 items-start">
        {/* Outline sidebar — desktop */}
        <aside className="hidden lg:block w-60 shrink-0 rounded-xl border overflow-hidden sticky top-20" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b text-sm font-semibold" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
            <ListOrdered size={14} className="inline mr-1.5" />
            Course outline
          </div>
          <nav className="max-h-[70vh] overflow-y-auto p-2 space-y-1">
            {course.units.map(unit => (
              <div key={unit.id}>
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  {unit.title}
                </div>
                {unit.lessons.map(l => {
                  const done = completed.has(`${courseId}:${l.id}`);
                  const active = l.id === lessonId;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setLessonId(l.id)}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-xs transition-all"
                      style={{
                        backgroundColor: active ? 'var(--brand-bg)' : 'transparent',
                        color: active ? 'var(--brand)' : done ? 'var(--success)' : 'var(--text-secondary)',
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {done
                        ? <CheckCircle2 size={13} style={{ color: 'var(--success)', flexShrink: 0 }} />
                        : <span className="w-[13px] h-[13px] rounded-full border shrink-0 inline-block" style={{ borderColor: active ? 'var(--brand)' : 'var(--border)' }} />
                      }
                      <span className="line-clamp-2">{l.title}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Lesson content */}
        <div key={lessonId} className="flex-1 min-w-0 animate-fade-in">
          {/* Unit / lesson header */}
          <div className="rounded-xl border p-5 lg:p-6 mb-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: course.color }}>
                  {currentEntry.unitTitle}
                </p>
                <h2 className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>
                  {lesson.title}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} /> {lesson.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award size={12} /> {lesson.quiz.length}-question quiz
                  </span>
                  {isDone && (
                    <span className="flex items-center gap-1" style={{ color: 'var(--success)' }}>
                      <CheckCircle2 size={12} /> Complete
                    </span>
                  )}
                </div>
              </div>
              {/* Mobile outline button */}
              <button
                onClick={() => setOutlineOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                <Menu size={14} /> Outline
              </button>
            </div>
          </div>

          {/* Lesson body */}
          <div className="rounded-xl border p-5 lg:p-6 mb-4 space-y-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            {lesson.paragraphs.map((p, i) => (
              <p key={i} className="text-sm lg:text-base leading-relaxed" style={{ color: 'var(--text)' }}>{p}</p>
            ))}
            <div className="rounded-xl p-4 mt-2" style={{ backgroundColor: 'var(--brand-bg)' }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--brand)' }}>Key Points</p>
              <ul className="space-y-1.5">
                {lesson.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text)' }}>
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--brand)' }} />
                    {kp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quiz section */}
          <div className="rounded-xl border overflow-hidden mb-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Test yourself</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {lesson.quiz.length} multiple-choice questions on this lesson
                </p>
              </div>
              {quizPhase === 'idle' && (
                <button
                  onClick={() => setQuizPhase('active')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ backgroundColor: 'var(--brand)', color: '#fff' }}
                >
                  Start quiz
                </button>
              )}
              {quizPhase === 'done' && (
                <button
                  onClick={() => { setQuizPhase('idle'); setAnswers({}); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <RotateCcw size={13} /> Retry
                </button>
              )}
            </div>

            {quizPhase !== 'idle' && (
              <div className="p-5 space-y-6">
                {lesson.quiz.map((q, qi) => {
                  const chosen = answers[qi];
                  const revealed = quizPhase === 'done';
                  const correct = q.correct;
                  return (
                    <div key={qi} className="space-y-3">
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                        {qi + 1}. {q.q}
                      </p>
                      <div className="space-y-2">
                        {q.opts.map((opt, oi) => {
                          let bg = 'var(--bg)';
                          let border = 'var(--border)';
                          let color = 'var(--text)';
                          if (revealed) {
                            if (oi === correct) { bg = 'var(--success-bg)'; border = 'var(--success)'; color = 'var(--success)'; }
                            else if (oi === chosen && chosen !== correct) { bg = '#FEF2F2'; border = 'var(--error)'; color = 'var(--error)'; }
                          } else if (chosen === oi) {
                            bg = 'var(--brand-bg)'; border = 'var(--brand)'; color = 'var(--brand)';
                          }
                          return (
                            <button
                              key={oi}
                              disabled={revealed}
                              onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                              className="w-full text-left px-4 py-3 rounded-lg border text-sm transition-all"
                              style={{ backgroundColor: bg, borderColor: border, color }}
                            >
                              <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                            </button>
                          );
                        })}
                      </div>
                      {revealed && (
                        <div className="text-xs p-3 rounded-lg" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-secondary)' }}>
                          <span className="font-semibold" style={{ color: 'var(--text)' }}>Explanation: </span>{q.exp}
                        </div>
                      )}
                    </div>
                  );
                })}

                {quizPhase === 'active' && (
                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(answers).length < lesson.quiz.length}
                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                    style={{ backgroundColor: 'var(--brand)', color: '#fff' }}
                  >
                    Submit answers ({Object.keys(answers).length}/{lesson.quiz.length} answered)
                  </button>
                )}

                {quizPhase === 'done' && (
                  <div className="text-center py-2">
                    <div className="text-2xl font-bold" style={{ color: score === lesson.quiz.length ? 'var(--success)' : 'var(--text)' }}>
                      {score}/{lesson.quiz.length}
                    </div>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {score === lesson.quiz.length
                        ? 'Perfect! Lesson marked complete.'
                        : score! >= Math.ceil(lesson.quiz.length / 2)
                        ? 'Good effort! Review the explanations above.'
                        : 'Keep studying — the explanations above will help.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => prevEntry && setLessonId(prevEntry.lesson.id)}
              disabled={!prevEntry}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-40"
              style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--card)' }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {!isDone && (
              <button
                onClick={markComplete}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ backgroundColor: 'var(--success)', color: '#fff' }}
              >
                <CheckCircle2 size={16} />
                Mark complete {nextEntry ? '& continue' : ''}
              </button>
            )}
            {isDone && nextEntry && (
              <button
                onClick={() => setLessonId(nextEntry.lesson.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ backgroundColor: 'var(--brand)', color: '#fff' }}
              >
                Next lesson <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile outline sheet */}
      {outlineOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--surface-overlay)' }} onClick={() => setOutlineOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl animate-slide-in-left" style={{ backgroundColor: 'var(--card)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Course outline</span>
              <button onClick={() => setOutlineOpen(false)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>
            <nav className="overflow-y-auto p-2 space-y-1 h-full pb-20">
              {course.units.map(unit => (
                <div key={unit.id}>
                  <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    {unit.title}
                  </div>
                  {unit.lessons.map(l => {
                    const done = completed.has(`${courseId}:${l.id}`);
                    const active = l.id === lessonId;
                    return (
                      <button
                        key={l.id}
                        onClick={() => { setLessonId(l.id); setOutlineOpen(false); }}
                        className="w-full flex items-center gap-2 px-2 py-2.5 rounded-lg text-left text-sm transition-all"
                        style={{
                          backgroundColor: active ? 'var(--brand-bg)' : 'transparent',
                          color: active ? 'var(--brand)' : done ? 'var(--success)' : 'var(--text-secondary)',
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {done
                          ? <CheckCircle2 size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                          : <span className="w-[14px] h-[14px] rounded-full border shrink-0 inline-block" style={{ borderColor: active ? 'var(--brand)' : 'var(--border)' }} />
                        }
                        {l.title}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="px-5 py-3 rounded-xl shadow-lg text-sm font-medium" style={{ backgroundColor: 'var(--text)', color: 'var(--bg)' }}>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

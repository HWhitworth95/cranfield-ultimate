// Footwork drills from American football defensive-back and combine training.
// Each one now follows a specific published description (credited below),
// reworded and redrawn. The six earlier "extra" ultimate drills were removed or
// replaced by sourced versions in drills_library.js (Nov 2026 audit).
// Units: sources use yards; diagrams are in metres (5 yd ≈ 4.6 m).

const KDB = ['"Defensive Back Drills" (PDF hosted by Kalamazoo College athletics)', 'https://fsc.kzoo.edu/wp-content/uploads/sites/137/2021/03/DEFENSIVE_BACK_DRILLS.pdf'];
const GRIP = ['Grip Boost, "No Fly Zone: The Best Football Secondary Drills" (2025)', 'https://www.gripboost.com/blogs/news/best-football-secondary-drills'];
const TES = ['Topend Sports, "3 Cone Drill" (NFL Combine test)', 'https://www.topendsports.com/testing/tests/3-cone-drill.htm'];
const TTEST = ['Topend Sports, "Agility T-Test" (Semenick, NSCA Journal 1990)', 'https://www.topendsports.com/testing/tests/t-test.htm'];
const FV = [0, 0, 37, 50];

const EXTRA_DRILLS = [
  {
    id: 'fb-w-drill', title: 'W Drill', players: '1+', cat: 'Agility', tags: ['Defensive footwork', 'Agility', 'Backpedal'], credits: [KDB],
    summary: 'Backpedal, buzz your feet, sprint forward, buzz, backpedal again: a zig-zag of cones 5 yards apart.',
    setup: 'Five cones 5 yards (about 4.5 m) apart in a W (zig-zag). Start at the first cone.',
    steps: [{ text: 'Backpedal from the first cone to the second with shoulders square, seeing it in your peripheral vision. Buzz your feet and sprint forward to the third; buzz and backpedal to the fourth; buzz and sprint to the fifth. Finish by sprinting laterally (catching a disc if you have a partner).',
      dia: { view: FV, cones: [[8, 20], [12.6, 28], [17.2, 20], [21.8, 28], [26.4, 20]], o: [['P', 8, 20]], run: [[8, 20, 12.6, 27.5, 0], [12.6, 28, 17.2, 20.5, 0], [17.2, 20, 21.8, 27.5, 0], [21.8, 28, 26.2, 20.5, 0]] } }],
    rotation: '4 reps: 2 in each direction.',
    tips: ['Shoulders square; track the cones in your peripheral vision.', 'For ultimate: the backpedal-to-sprint transition is the move for closing on a cutter who stops and comes back.'],
  },
  {
    id: 'fb-t-step', title: 'Backpedal and Break', players: '2+', cat: 'Agility', tags: ['Defensive footwork', 'Agility', 'Backpedal'], credits: [KDB],
    summary: 'Backpedal to a middle cone, buzz your feet, then break to whichever of five cones your partner points at.',
    setup: 'A start cone, a middle cone 10 yards back, and five break cones 5 yards from the middle one: straight downfield, 45° downfield, 90° lateral, 45° upfield and straight upfield. A partner.',
    steps: [{ text: 'Backpedal to the middle cone with eyes on the disc, buzz your feet and break to one of the five cones, catching the throw during the break.',
      dia: { view: FV, cones: [[18, 40], [18, 30], [18, 25], [21.5, 26.5], [23, 30], [21.5, 33.5], [18, 35]], o: [['P', 18, 40], ['H', 18, 46]], disc: 'H',
        run: [[18, 40, 18, 30.5, 0], [18, 30, 21.3, 26.8, 0]], throw: [[18, 46, 21.5, 27.5, -2]] } }],
    rotation: '10 reps, breaking in every direction.',
    progressions: ['Make it reactive: your partner points to the break cone.'],
    tips: ['Clean buzz-down and sharp breaks; eyes on the disc.'],
  },
  {
    id: 'fb-speed-turn', title: 'T-Speed Turns', players: '2', cat: 'Agility', tags: ['Defensive footwork', 'Agility', 'Deep defence'], credits: [KDB],
    summary: 'Backpedal, break 90° on a point, then whip round in a speed turn when the point switches, tracing a T.',
    setup: 'A partner acting as the thrower.',
    steps: [{ text: 'Backpedal with eyes on the thrower. They point one way: buzz your feet and break 90°. They immediately point the other way: make an exaggerated speed turn, whipping your head round, and run back down the same line to make a T. Finish with a catch.',
      dia: { view: FV, o: [['P', 18, 34], ['H', 18, 44]], disc: 'H', run: [[18, 34, 18, 24, 0], [18, 24, 24, 24, 0], [24, 24, 11, 24, 0]] } }],
    rotation: '4 reps: 2 each way.',
    tips: ['React quickly to the signal; exaggerate the speed turn.', 'For ultimate: the turn you need when a cutter breaks deep past you.'],
  },
  {
    id: 'fb-hip-flip', title: 'Hip Flips', players: '2', cat: 'Agility', tags: ['Defensive footwork', 'Agility', 'Backpedal'], credits: [GRIP],
    summary: 'Backpedal and open your hips left or right on the coach\'s call, 2–3 times, then sprint forward.',
    setup: 'Start on a line (or a cone) in a backpedal stance, with a coach in front.',
    steps: [{ text: 'Backpedal at a controlled pace. On "flip left" or "flip right", open your hips and rotate that way, drop your hips and keep backpedalling in the new direction. After 2–3 flips, sprint forward and finish by breaking on a throw or the coach\'s signal.',
      dia: { view: FV, o: [['P', 18, 38], ['H', 18, 46]], disc: 'H', run: [[18, 38, 15, 32, 0], [15, 32, 21, 26, 0], [21, 26, 16, 20, 0], [16, 20, 17, 30, 0]] } }],
  },
  {
    id: 'fb-backpedal-weave', title: 'Weave Drill', players: '3', cat: 'Defence', tags: ['Defensive footwork', 'Deep defence', 'Backpedal'], credits: [KDB],
    summary: 'Backpedal-weave in front of a running receiver, keeping your leverage and cushion and seeing both receiver and thrower.',
    setup: 'A lane about 10 yards wide. Start with a 5-yard cushion from the receiver; a thrower behind them.',
    steps: [{ text: 'When the receiver starts, backpedal and weave to keep your leverage and cushion. Angle your hips so you can see both the receiver and the thrower. Stop at the end of the lane.',
      dia: { view: FV, o: [['C', 18, 40], ['H', 18, 48]], d: [['D', 18, 35]], disc: 'H', run: [[18, 40, 22, 30, 0], [22, 30, 15, 20, 0]], drun: [[18, 35, 22, 26, 0], [22, 26, 15, 16, 0]] } }],
    rotation: '4 reps: 2 with each leverage.',
    tips: ['Good pad level and backpedal technique.', 'Never let the receiver get level with you ("nose up").'],
  },
  {
    id: 'fb-four-corner', title: 'Square Drill', players: '2', cat: 'Agility', tags: ['Defensive footwork', 'Agility', 'Backpedal'], credits: [KDB],
    summary: 'Five backpedal-and-break patterns around a 10-yard square, building from jogging to full speed.',
    setup: 'A 10-yard square of four cones; a partner to throw.',
    steps: [{ text: 'Run each pattern once in each direction: (1) backpedal and jog, catching before the third cone; (2) backpedal, buzz at the second cone, jog to the third; (3) as 2 with a flip inside; (4) backpedal, buzz, break 45° to the fourth cone (¾ speed); (5) as 4 with a flip inside, full speed. Finish each with a catch.',
      dia: { view: FV, cones: [[13.4, 34], [13.4, 24.8], [22.6, 24.8], [22.6, 34]], o: [['P', 13.4, 34], ['H', 18, 44]], disc: 'H', run: [[13.4, 34, 13.4, 25.3, 0], [13.4, 24.8, 22.2, 33.6, 0]] } }],
    rotation: '4 reps, both directions.',
    tips: ['Good stance and backpedal; exaggerated thigh lift on the flip; eyes on the thrower throughout.'],
  },
  {
    id: 'fb-three-cone', title: '3-Cone Drill (L-Drill)', players: '1+', cat: 'Agility', tags: ['Agility', 'Change of direction', 'Fitness test'], credits: [TES],
    summary: 'The NFL Combine change-of-direction test: three cones 5 yards apart in an L.',
    setup: 'Three cones in an L, 5 yards apart: cone 1 at the start, cone 2 at the corner, cone 3 at the end. Flat, non-slip surface; stopwatch.',
    steps: [{ text: 'From a three-point stance at cone 1: sprint to cone 2 and touch the line; back to cone 1 and touch; back to cone 2 and round the outside of it; weave inside cone 3 and round the outside of it; round the outside of cone 2; finish at cone 1.',
      dia: { view: FV, cones: [[12, 40], [12, 24], [28, 24]], o: [['P', 9.5, 42]], note: [['1', 14, 41], ['2', 14, 22.5], ['3', 30, 22.5], ['5 yd apart (not to scale)', 22, 36]],
        run: [[10.5, 40.5, 11, 25.5, 0], [13, 25.5, 13, 38.5, 0], [11.5, 38.5, 10, 23, 1], [10.5, 21.5, 26.5, 26, 2], [26.5, 26, 30, 21.5, 1.5], [29.5, 20.5, 11, 20.5, -1], [9.5, 21.5, 9.5, 40, 0]] } }],
    tips: ['Keep moving forward through the changes of direction rather than stopping and restarting.', 'Run it both ways (curving left on one attempt, right on the other); best of two trials.'],
  },
  {
    id: 'fb-t-drill', title: 'Agility T-Test', players: '1+', cat: 'Agility', tags: ['Agility', 'Change of direction', 'Fitness test'], credits: [TTEST],
    summary: 'Sprint 10 yards, shuffle 5 left, 10 right, 5 back, then backpedal home: forwards, sideways and backwards in one rep.',
    setup: 'Cone A at the start; cone B 10 yards straight ahead; cones C and D 5 yards either side of B.',
    steps: [{ text: 'Sprint from A to B and touch its base; shuffle left to C and touch it; shuffle right to D and touch it; shuffle back to B and touch it; backpedal past A.',
      dia: { view: FV, cones: [[18, 42], [18, 22], [8, 22], [28, 22]], o: [['P', 18, 44.5]], note: [['A', 20, 43], ['B', 18, 19.5], ['C', 8, 19.5], ['D', 28, 19.5], ['10 yd', 21, 33], ['5 yd', 13, 25.5]],
        run: [[18, 43, 18, 23.5, 0], [17, 21.5, 9.5, 21.5, 0], [9.5, 23.5, 26.5, 23.5, 0], [26.5, 21, 19.5, 21, 0], [17, 23.5, 17, 42, 0]] } }],
    tips: ['Shuffle without crossing your feet.'],
  },
  {
    id: 'fb-ladder', title: 'Agility Ladder: One-Step, Ickey Shuffle, River Dance', players: '1+', cat: 'Agility', tags: ['Agility', 'Footwork', 'Warm-up'], credits: [GRIP],
    summary: 'Three ladder patterns: one foot per gap, the three-count Ickey shuffle, and the in-behind-out River Dance.',
    setup: 'An agility ladder.',
    steps: [
      { text: 'One-Step: lean slightly forward and move quickly and lightly through the ladder, one foot in each gap, on the balls of your feet with arms bent about 90°. Repeat, gradually faster.',
        dia: { view: [0, 0, 37, 30], cones: [], o: [['P', 18, 27]], run: [[18, 27, 18, 4, 0]], note: [['ladder', 22, 15]] } },
      { text: 'Ickey Shuffle: side-on to the ladder, step your inside foot into the gap, bring your outside foot into the same gap, then step the inside foot out past the far side. Steady three-count rhythm; both directions. River Dance: lead foot in, trail foot crosses behind into the next gap, lead foot out to the far side; switch sides.',
        dia: { view: [0, 0, 37, 30], o: [['P', 14, 27]], run: [[14, 27, 19, 24, 0], [19, 24, 14, 21, 0], [14, 21, 19, 18, 0], [19, 18, 14, 15, 0]] } },
    ],
    tips: ['Clean form before speed.'],
  },
];

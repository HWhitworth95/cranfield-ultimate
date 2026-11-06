// Drills seen in videos from Disc In (@ultimatefrisbee_training on Instagram),
// written up from the video and caption and drawn for the club. The reels
// give no written rules, so set-ups and rotations are our interpretation.

const DISCIN = 'https://www.instagram.com/reel/';

const SOCIAL_DRILLS = [
  {
    id: 'block-everything', title: 'Block Everything', players: '4+', cat: 'Defence',
    tags: ['Match defence', 'Positioning', 'Boxing out', 'Footwork'], url: DISCIN + 'Cp0S40rITgB/',
    summary: 'A one-on-one race to two target squares: the attacker picks one of three routes at a marker, and the defender uses body position to keep them out of both squares.',
    setup: 'Attacker/defender pairs queue at a start cone. Place a single "block" marker 15 m straight ahead. Mark two 5 × 5 m target squares about 10 m beyond the marker, one to each side. A thrower with discs stands to one side of the start (use two throwers, one per side, if you have them).',
    rotation: 'Attacker → defender → back of the queue; swap throwers every few minutes.',
    steps: [
      { text: 'On "go" the attacker runs straight at the block marker with the defender alongside. The defender should sit slightly in front and inside, ready to shut down either side.',
        dia: { view: [0, 0, 37, 46], cones: [[18, 40], [18, 25], [6, 12], [11, 12], [6, 17], [11, 17], [25, 12], [30, 12], [25, 17], [30, 17]],
          o: [['T', 6, 38], ['A', 17, 40]], d: [['D', 19, 39]], disc: 'T', run: [[17, 40, 17, 26, 0]], drun: [[19, 39, 19, 26.5, 0]] } },
      { text: 'At the marker the attacker chooses: break left to the left square, break right to the right square, or keep going and cut back into a square late. The thrower releases to whichever square the attacker attacks.',
        dia: { view: [0, 0, 37, 46], cones: [[18, 40], [18, 25], [6, 12], [11, 12], [6, 17], [11, 17], [25, 12], [30, 12], [25, 17], [30, 17]],
          o: [['T', 6, 38], ['A', 17, 26]], d: [['D', 19, 26.5]], disc: 'T',
          run: [[17, 26, 9, 15, 0], [17, 26, 27, 15, 0], [17, 26, 18, 8, 0]], note: [['1', 12, 21], ['2', 23, 21], ['3', 19.5, 12]] } },
      { text: 'The defender\'s job is to block the path, not chase the disc: get your body between the attacker and the square they want, take away the line early and redirect them away from the target. The attacker scores by catching inside a square.',
        dia: { view: [0, 0, 37, 46], cones: [[18, 40], [18, 25], [6, 12], [11, 12], [6, 17], [11, 17], [25, 12], [30, 12], [25, 17], [30, 17]],
          o: [['T', 6, 38], ['A', 21, 21]], d: [['D', 24, 19]], disc: 'T', run: [[21, 21, 26, 15, 0]], drun: [[24, 19, 26, 16.5, 0]], throw: [[6, 38, 27, 14, -3]] } },
    ],
    tips: [
      'Defenders: win the first step out of the marker. Once the attacker is level with you on their chosen side, it\'s usually too late.',
      'Read the hips, not the head or shoulders; the hips tell you where they are really going.',
      'Attackers: sell one route with your first step, then attack another. The late cut (option 3) is your best weapon against a defender who commits early.',
      'Make it competitive: keep score of catches in squares versus defensive stops.',
    ],
  },
];

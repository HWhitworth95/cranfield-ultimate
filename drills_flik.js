// Free drills from Flik (flikulti.com/drills), rewritten in our own words with
// our own diagrams. Each credits the original author and links back to Flik,
// where the animated originals live.
//
// Diagram format (pitch units are metres, attacking towards the top):
//   view:  [x0, y0, x1, y1]            visible window
//   side:  'left' | 'right'            draw a sideline at x = 0 / x = 37
//   ez:    y                           draw an endzone line at this y
//   o:     [[label, x, y], ...]        offence (navy)
//   d:     [[label, x, y], ...]        defence (yellow)
//   cones: [[x, y], ...]
//   disc:  label                       who holds the disc
//   run:   [[x1,y1, x2,y2, bend], ...] player movement (dashed)
//   throw: [[x1,y1, x2,y2, bend], ...] disc flight (solid orange)
//   drun:  [[x1,y1, x2,y2, bend], ...] defender movement (dashed yellow)
//   pitch: [x0,y0,x1,y1] and ezs: [y,...] for a small full pitch
//   note:  [[text, x, y], ...]

const FLIK = 'https://www.flikulti.com/drills/';

const FLIK_DRILLS = [
  {
    id: 'sideline-escape', title: '3-Person Sideline Escape', players: '6+', cat: 'Team play',
    tags: ['Sideline', 'Handler resets', 'Team cutting patterns', 'Match defence'],
    credit: 'Dave Trovell', url: FLIK + '3-person-sideline-escape/',
    summary: 'Two cutters work opposite lanes so a trapped thrower always has an up-line and a swing option, turning the trap into an attack.',
    setup: 'A has the disc on the sideline with D1 putting on a trap mark. B stands infield, level with A and facing them, marked by D2. C is the front of the stack (or an iso) in the middle of the field, marked by D3.',
    rotation: 'A → D1 → B → D2 → C → D3',
    steps: [
      { text: 'Start position. A is trapped on the sideline; B and C are the two outlets.',
        dia: { view: [0, 14, 26, 46], side: 'left', o: [['A', 2, 40], ['B', 11, 40], ['C', 16, 27]], d: [['D1', 4, 38], ['D2', 11, 37.5], ['D3', 16, 30]], disc: 'A' } },
      { text: 'B and C move as a pair in their own "lanes". When B attacks up the line, C comes back to the swing spot; when B drops back to the swing, C goes up the line. B always starts it and C reacts.',
        dia: { view: [0, 14, 26, 46], side: 'left', o: [['A', 2, 40], ['B', 11, 40], ['C', 16, 27]], d: [['D1', 4, 38], ['D2', 11, 37.5], ['D3', 16, 30]], disc: 'A',
          run: [[11, 40, 5, 30, 3], [16, 27, 13, 41, -3]] } },
      { text: 'If the disc goes up the line, the catcher swings it straight into the middle while the other cutter heads upfield.',
        dia: { view: [0, 14, 26, 46], side: 'left', o: [['A', 2, 40], ['B', 5, 30], ['C', 13, 40]], d: [['D1', 4, 38], ['D2', 7, 32], ['D3', 14, 37]], disc: 'B',
          throw: [[2, 40, 5, 30, 2], [5, 30, 15, 25, -2]], run: [[13, 40, 16, 25, -2]] } },
      { text: 'If the disc goes to the swing (level with A), that catcher throws straight into the middle as the other cutter breaks into the field.',
        dia: { view: [0, 14, 26, 46], side: 'left', o: [['A', 2, 40], ['B', 11, 40], ['C', 5, 30]], d: [['D1', 4, 38], ['D2', 13.5, 38.5], ['D3', 7.5, 32]], disc: 'B',
          throw: [[2, 40, 11, 40, -2], [11, 40, 15, 28, 2]], run: [[5, 30, 15, 28, 3]] } },
    ],
    tips: [
      'Run every cut all the way to the sideline and back. Half-cuts are easy to cover and wreck your partner\'s timing.',
      'Near the endzone, C faking the swing and then going down the line is very hard to stop, but watch for B\'s defender poaching.',
    ],
  },
  {
    id: 'away-to-open-under', title: 'Away to Open Under (V-cut)', players: '2+', cat: 'Cutting',
    tags: ['Cutting', 'Getting open', 'Catching', 'Timing'],
    credit: 'Brummie', url: FLIK + 'away-to-open-under/',
    summary: 'The classic V-cut: drive away from the disc, plant hard, and come back under towards the open side for the pass.',
    setup: 'A has the disc in the middle of the pitch (optionally marked by D1). B starts about 10 m downfield, facing A.',
    rotation: 'A → B',
    steps: [
      { text: 'B drives hard away from the disc for 5–10 m to push their defender back.',
        dia: { view: [6, 14, 32, 46], o: [['A', 18, 40], ['B', 18, 30]], d: [['D1', 16.5, 38]], disc: 'A', run: [[18, 30, 18, 21, 0]] } },
      { text: 'B plants and cuts back underneath at roughly 45° towards the open side. A releases as B turns, leading B into space.',
        dia: { view: [6, 14, 32, 46], o: [['A', 18, 40], ['B', 18, 21]], d: [['D1', 16.5, 38]], disc: 'A', run: [[18, 21, 26, 30, 0]], throw: [[18, 40, 26.5, 31, 2]] } },
    ],
    tips: [
      'Get the angle right. Cutting flat towards the sideline makes the throw long and wide; cutting straight back at the thrower crowds the stack and leaves no room to adjust. About 45° gains yards and gives you width to fix a poor throw.',
      'Sprint through the catch. Slowing down to catch lets defenders run past you for the block.',
      'Add a defender on the cutter once the timing is solid.',
    ],
  },
  {
    id: 'break-for-continuation', title: 'Breaking the Mark for Continuation', players: '5+', cat: 'Throwing',
    tags: ['Breaking the mark', 'Continuations', 'Lead pass', 'Throwing'],
    credit: 'Brummie', url: FLIK + 'breaking-the-mark-for-continuation/',
    summary: 'Where you put a break throw decides whether the catcher can keep the disc moving. Throw it wide, not short.',
    setup: 'Set up as a vertical or side stack: thrower A marked by D1, a break-side receiver B guarded by D2, and a continuation cutter C further up the break side. Adjust spacing to match your offence.',
    steps: [
      { text: 'A breaks the mark to B on the break side.',
        dia: { view: [0, 12, 28, 46], o: [['A', 16, 40], ['B', 7, 31], ['C', 10, 18]], d: [['D1', 17.5, 38.5], ['D2', 10, 29]], disc: 'A', throw: [[16, 40, 7, 31, -3]] } },
      { text: 'After a break, the downfield defence is briefly out of position. That gap is the chance for a quick continuation to the break side without needing to break the mark again.',
        dia: { view: [0, 12, 28, 46], o: [['A', 16, 40], ['B', 7, 31], ['C', 10, 18]], d: [['D1', 17.5, 38.5], ['D2', 10, 29]], disc: 'B', note: [['gap', 5, 22]] } },
      { text: 'Under-thrown: B has to turn back to the disc and ends up facing away from C. The continuation is now slow and hard.',
        dia: { view: [0, 12, 28, 46], o: [['A', 16, 40], ['B', 8, 35], ['C', 10, 18]], d: [['D1', 17.5, 38.5], ['D2', 9, 31]], disc: 'A', throw: [[16, 40, 8, 35.5, -2]], note: [['✗', 4, 35]] } },
      { text: 'Thrown wide into space: B catches already turned towards the break side and can hit C straight away.',
        dia: { view: [0, 12, 28, 46], o: [['A', 16, 40], ['B', 4, 30], ['C', 8, 18]], d: [['D1', 17.5, 38.5], ['D2', 8, 29]], disc: 'B', throw: [[16, 40, 4, 30, -4], [4, 30, 8, 18, -2]], note: [['✓', 2, 34]] } },
    ],
    tips: ['Aim break throws slightly wide and in front of the receiver so they catch facing upfield; the continuation comes for free.'],
  },
  {
    id: 'choosing-a-shoulder', title: 'Choosing a Shoulder', players: '4+', cat: 'Defence',
    tags: ['Match defence', 'Positioning', 'Handler resets', 'Sideline'],
    credit: 'Mish Phillips', url: FLIK + 'choosing-a-shoulder-2/',
    summary: 'Defenders stop reacting and start dictating: announce which shoulder the cutter will go past, then make it happen.',
    setup: 'A is on the sideline with a trap mark from D1. Reset B starts 5–10 m infield, level with A, guarded by D2.',
    rotation: 'D1 → A → D2 → B',
    steps: [
      { text: 'D2 sets up to protect the up-line cut and calls out loud which shoulder (left or right) they will send B past. D1 checks the disc in and B makes a single cut straight up the line. D2\'s job is to make B go past the shoulder they called.',
        dia: { view: [0, 20, 22, 46], side: 'left', o: [['A', 2, 40], ['B', 10, 40]], d: [['D1', 4, 38], ['D2', 8.5, 37.5]], disc: 'A', run: [[10, 40, 7, 28, -4]], note: [['"left!"', 12, 35]] } },
    ],
    tips: [
      'The point is control: you choose where the attacker goes rather than chasing them.',
      'B only ever cuts up the line. Practise sending them to both shoulders until either is automatic.',
    ],
  },
  {
    id: 'downfield-lateral-cut', title: 'Downfield Lateral Cut', players: '3+', cat: 'Cutting',
    tags: ['Cutting', 'Lead pass', 'Handler resets', 'Vert stack'],
    credit: 'Brummie', url: FLIK + 'downfield-lateral-cut/',
    summary: 'A flat cut across the field. Simple to describe, hard to do well; it can win the power position or give a reset.',
    setup: 'A has the disc in the middle, marked by D1. B stands about 10 m downfield, facing A.',
    rotation: 'D1 → A → B',
    steps: [
      { text: 'D1 checks the disc in. B sprints laterally across the field. A throws an outside-in curve into space so B runs onto the disc rather than waiting for it.',
        dia: { view: [6, 18, 34, 46], o: [['A', 18, 40], ['B', 18, 30]], d: [['D1', 16.5, 38.5]], disc: 'A', run: [[18, 30, 31, 30.5, 0]], throw: [[18, 40, 29, 29.5, 4]] } },
    ],
    tips: ['Curve the disc so it arrives well in front of the receiver; a disc thrown at the cutter is a disc the defender can reach.'],
  },
  {
    id: 'mini', title: 'Mini', players: '6+', cat: 'Games',
    tags: ['Game', 'Small-sided', 'Decision making'],
    credit: 'Brummie', url: FLIK + 'mini/',
    summary: 'A fast small-sided version of ultimate for small pitches or low-turnout sessions: lots of touches, lots of decisions.',
    setup: 'Field 18 m × 18 m with 6 m endzones. 3v3 or 4v4 works best.',
    rules: [
      'Make-it-take-it: play doesn\'t stop after a score. The scoring team turns straight round and attacks the other endzone.',
      'A goal is +1; any turnover (drop, out of bounds, stall, block) is −1.',
      'First to +3 wins the game; a team reaching −2 loses it. Play best of three games.',
      'Stall counts start at 6, and can be started anywhere on the field.',
    ],
    steps: [
      { text: 'The mini pitch.',
        dia: { view: [-2, -2, 20, 33.5], pitch: [0, 0, 18, 30], ezs: [6, 24],
          o: [['A', 9, 20], ['B', 4, 12], ['C', 14, 14]], d: [['', 10, 18.5], ['', 5, 10.5], ['', 13, 12]], disc: 'A',
          note: [['endzone', 9, 3], ['endzone', 9, 27.5], ['18 m × 30 m', 9, 32]] } },
    ],
    tips: ['Change the shape to change the lesson: a wider pitch rewards swings and space throws, a narrower one demands quick, accurate breaks.'],
  },
  {
    id: 'protecting-the-upline', title: 'Protecting the Up-line Cut', players: '4+', cat: 'Defence',
    tags: ['Match defence', 'Handler resets', 'Positioning', 'Sideline'],
    credit: 'Mish Phillips', url: FLIK + 'protecting-the-upline-cut/',
    summary: 'A defender commits completely to taking away the up-line handler cut from a trapped reset.',
    setup: 'A is on the sideline with a trap mark from D1. Reset B starts 5–10 m infield, level with A, guarded by D2.',
    steps: [
      { text: 'D2 sets up to deny the up-line cut. D1 checks the disc in and B makes one cut straight up the line. A only throws if B is genuinely open.',
        dia: { view: [0, 20, 22, 46], side: 'left', o: [['A', 2, 40], ['B', 10, 40]], d: [['D1', 4, 38], ['D2', 8, 37]], disc: 'A', run: [[10, 40, 6, 27, -2]], drun: [[8, 37, 5, 27, -1]] } },
    ],
    tips: [
      'If your player moves, you move. The moment B draws level with you they have the momentum and you\'ve lost the race.',
      'Know the priority. If the team has decided the up-line cut is the biggest danger, commit to stopping it, even at the cost of something else.',
      'Progression: once defenders have it, let B attack up the line however they like.',
      'Make it matter: if B gets the disc up the line, the whole defensive group owes 20 press-ups. Or run it as a contest: best defenders against best handlers.',
    ],
  },
  {
    id: 'switching-the-field-vert', title: 'Switching the Field in Vert Stack', players: '7', cat: 'Team play',
    tags: ['Vert stack', 'Swinging the disc', 'Handler resets', 'Sideline', 'Team cutting patterns'],
    credit: 'Brummie', url: FLIK + 'switching-the-field-in-vertical-stack/',
    summary: 'Keep a vert stack flowing by dumping off the sideline, swinging through the middle and hitting the next under cut, then do it all again from the other side.',
    setup: 'A has the disc near the sideline, with reset B 3–8 m infield, level with A. The stack runs downfield from C at the front (at least 5 m from A) through E, F and G to H at the back, angled slightly off the sideline.',
    rotation: 'A → B → C → E → F → G → H',
    steps: [
      { text: 'H cuts from the back but A looks it off and dumps to B.',
        dia: { view: [0, 6, 30, 46], side: 'left', o: [['A', 3, 40], ['B', 9, 41], ['C', 8, 32], ['E', 9, 27], ['F', 10, 22], ['G', 11, 17], ['H', 12, 12]], disc: 'A',
          run: [[12, 12, 18, 30, 3]], throw: [[3, 40, 9, 41, -1]] } },
      { text: 'G cuts away while H clears back into the stack. C comes under towards the open side and B swings to C. A moves downfield.',
        dia: { view: [0, 6, 30, 46], side: 'left', o: [['A', 3, 40], ['B', 9, 41], ['C', 8, 32], ['E', 9, 27], ['F', 10, 22], ['G', 11, 17], ['H', 18, 30]], disc: 'B',
          run: [[8, 32, 16, 36, -2], [11, 17, 11, 11, 0], [18, 30, 12, 13, -2]], throw: [[9, 41, 16, 36, 1]] } },
      { text: 'A and B clear into the stack (A becomes the new front). G plants and cuts back under; C hits G.',
        dia: { view: [0, 2, 30, 46], side: 'left', o: [['A', 9, 33], ['B', 12, 37], ['C', 16, 36], ['E', 9, 27], ['F', 10, 22], ['G', 11, 11], ['H', 14, 15.5]], disc: 'C',
          run: [[11, 11, 21, 22, -2]], throw: [[16, 36, 21, 22.5, 2]] } },
      { text: 'As soon as C throws, the whole stack shifts downfield and C becomes the reset. Now repeat from the other sideline, and keep going until you\'ve worked the disc from endzone to endzone.',
        dia: { view: [0, 2, 37, 46], o: [['A', 18, 18], ['B', 17, 14], ['C', 26, 31], ['E', 17, 10.5], ['F', 16, 7], ['G', 21, 22], ['H', 15, 3.5]], disc: 'G',
          run: [[16, 36, 26, 31, 1]] } },
    ],
    tips: [
      'Rotate everyone through every spot. The front of the stack runs further than the back.',
      'Start in the back of your own endzone and try to reach the far endzone without a turnover, then turn round and come back.',
    ],
  },
];

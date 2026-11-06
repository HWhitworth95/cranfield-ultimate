// Drills for the 2025/26 plan topics that had no drills (Hex, fast break,
// flood, pull plays, bracketing, junk) and the thin areas (zone offence,
// overheads, wind, laying out). Every drill here is taken from a named,
// published source and rewritten in our own words with our own diagrams.
// Nothing is added beyond what the source describes: where a source gives
// principles but no drill, `srcnote` says so plainly.
//
// Extra fields used by the library:
//   credits: [[text, url], ...]   who it came from (shown under the drill)
//   srcnote: string               honesty note about what the source does/doesn't give
//   time:    string               only when the source states a time
//   level:   string               only when the source states a level
// Same diagram format as drills_flik.js (metres, attacking up the page).

const SV = [0, 0, 37, 50]; // placeholder; fitViews() frames each drill

const FELIX = ['Felix Shardlow, "Training Hex offence with your team" (Ultimate Rob, 2016)', 'https://ultimaterob.com/2016/01/28/training-hex-offence-with-your-team/'];
const WEISBROD = ['Kyle Weisbrod, "Principles and mechanics of the fast break" (Ultiworld, 2016)', 'https://ultiworld.com/2016/02/03/principles-mechanics-fast-break/'];
const GRAVES = ['Matt Graves, "Score more efficiently with these four endzone plays" (Ultiworld, 2022)', 'https://ultiworld.com/2022/03/15/tuesday-tips-score-more-efficiently-with-these-four-endzone-plays'];
const LT = ['LT, "All the cool kids want to bracket" (Some Flow)', 'https://someflow.substack.com/p/all-the-cool-kids-want-to-bracket'];
const OWEN = ['Owen, "Ways to attack a zone" (Thinkulti, 2008)', 'https://thinkulti.blogspot.com/2008/01/ways-to-attack-zone.html'];
const GLAS4 = ['Glasgow Ultimate, Introduction to Ultimate, Lesson 4', 'https://glasgowultimate.quarto.pub/intro-to-ultimate/lesson4.html'];
const GLASZ = ['Glasgow Ultimate, "In the zone" training recap', 'https://glasgowultimate.co.uk/in-the-zone-training-recap/'];
const GDFU = ['"Throwing in wind" (Great Day for Ultimate blog, 2010)', 'https://greatdayforultimate.blogspot.com/2010/04/throwing-in-wind.html'];
const ROB_LAY = ['Ultimate Rob, "How to layout: all about the landing" (2011)', 'https://ultimaterob.com/2011/05/03/how-to-layout-all-about-the-landing/'];
const RUMMEL = ['Alex Rummelhart, "Tuesday Tips: How to lay out" (Ultiworld, 2015)', 'https://ultiworld.com/2015/08/18/tuesday-tips-how-to-lay-out/'];

// Hex 2-3-2 marker spots used by several drills.
const HEX = { b1: [13, 40], b2: [24, 40], w1: [6, 31], hat: [18.5, 31], w2: [31, 31], f1: [13, 22], f2: [24, 22] };
const HEXCONES = Object.values(HEX);
const CLEARCONES = [[18.5, 47], [18.5, 15], [2, 39], [35, 39], [2, 23], [35, 23]];

const SOURCED_DRILLS = [
  // =============================================================== HEX
  {
    id: 'hex-progression', title: 'Hex: 2v2 to 7v7 Progression', players: '4+', cat: 'Team play',
    tags: ['Hex', 'Spacing', 'Flow offence', 'Small-sided'], credits: [FELIX],
    summary: 'Build Hex offence one principle at a time: open pass at 2v2, connected at 3v3, triangles at 4v4, then don\'t surround the disc from 5v5 up.',
    setup: 'A box sized for the numbers. Play small-sided games, adding players and one focus per stage. Felix Shardlow, who devised Hex, suggests it for cold days or for a team happy to try things before they are explained.',
    rules: [
      'The Hex shape is 2-3-2: two backs nearest your own endzone, two wings (not within about 3 m of the sideline), one "hat" in the centre and two forwards nearest the attacking endzone.',
      '"Connected" means roughly 10 m apart: close enough to hear each other and throw accurately, able to cut any direction and receive.',
      'No fixed roles: fill whichever spot is free, and don\'t clear back to "your" spot after a cut or pass.',
    ],
    steps: [
      { text: '2v2: take the open pass. If the lateral is open, throw it. If the lateral is taken away, look for a lead pass downfield.',
        dia: { view: SV, o: [['A', 12, 36], ['B', 23, 36]], d: [['', 13.5, 34], ['', 23, 33.5]], disc: 'A', throw: [[12, 36, 23, 36, -2]], run: [[23, 36, 25, 24, -2]] } },
      { text: '3v3: stay connected without crowding. From a static disc make a triangle. If the other cutter moves away, follow to stay connected; if they cut towards or across you, move away or back to where they came from.',
        dia: { view: SV, o: [['A', 18, 38], ['B', 11, 29], ['C', 25, 29]], d: [['', 18, 35.5], ['', 11.5, 27], ['', 25, 27]], disc: 'A', run: [[11, 29, 17, 26, 2], [25, 29, 30, 34, -2]] } },
      { text: '4v4: make equilateral triangles. Either the thrower is part of two triangles, or the second triangle sits further downfield, formed by the downfield players.',
        dia: { view: SV, o: [['A', 18, 40], ['B', 11, 31], ['C', 25, 31], ['D', 18, 22]], d: [['', 18, 37.5], ['', 11.5, 29], ['', 25, 29], ['', 18, 24.5]], disc: 'A' } },
      { text: '5v5 to 7v7: don\'t surround the disc. Only three players connect to the thrower, all in their field of view; everyone else connects to a non-thrower to make more triangles.',
        dia: { view: SV, o: [['A', ...HEX.b1], ['B', ...HEX.b2], ['C', ...HEX.w1], ['D', ...HEX.hat], ['E', ...HEX.w2], ['F', ...HEX.f1], ['G', ...HEX.f2]], disc: 'A',
          throw: [[13, 40, 18.5, 31, -1]], note: [['3 connected to A', 1, 46]] } },
    ],
    tips: ['Take the open pass: Felix Shardlow calls this the number one principle, whatever the yardage, field position or stall count.',
      'If you are unsure where to go, make a triangle: get connected to two teammates without crowding them.',
      'After passing to the sideline from a back spot, don\'t clear downfield unless connected players want to replace you.'],
  },
  {
    id: 'hex-keepdisc', title: 'Hex: Keepdisc', players: '8+', cat: 'Games',
    tags: ['Hex', 'Game', 'Spacing', 'Conditioning'], credits: [FELIX], time: '60 s on, 30 s off per round (adjust to suit)',
    summary: 'Possession game in a big box played from the Hex shape. Whoever has the disc when the whistle goes scores.',
    setup: 'A spacious box, about half a pitch including the endzone for 7v7. Two even teams (8–16 players). Someone with a whistle.',
    rules: [
      'The offence keeps possession using the Hex shape. Turnovers change possession as normal.',
      'Play starts and stops on the whistle. The team holding the disc when it stops gets 1 point.',
    ],
    steps: [
      { text: 'Keep the disc in the Hex shape until the whistle.',
        dia: { view: SV, cones: [[1, 8], [36, 8], [1, 48], [36, 48]], o: [['A', ...HEX.b1], ['B', ...HEX.b2], ['C', ...HEX.w1], ['D', ...HEX.hat], ['E', ...HEX.w2], ['F', ...HEX.f1], ['G', ...HEX.f2]],
          d: [['', 14, 37.5], ['', 23, 37], ['', 8, 30], ['', 18.5, 28.5], ['', 29, 30], ['', 14, 24.5], ['', 23, 24.5]], disc: 'A', throw: [[13, 40, 24, 40, -2], [24, 40, 31, 31, 1]] } },
    ],
    progressions: ['Change the play and rest times.', 'Add an extra defender every 10–20 seconds.',
      'Put 3 or 4 coloured endzones round the box. After a while the whistle-blower calls a colour; scoring in that endzone is worth 2 points.'],
    tips: ['Not surrounding the disc is the big one: Felix Shardlow says it causes most of the turnovers in this game.',
      'Stay connected without crowding, and take the open pass.',
      'It is tiring, so move efficiently.'],
  },
  {
    id: 'hex-mex-puzzle', title: 'Hex: Mex Puzzle', players: '6+', cat: 'Team play',
    tags: ['Hex', 'Spacing', 'Communication', 'Pivots & fakes'], credits: [FELIX], time: '30–60 s bursts',
    summary: 'Cone-to-cone passing round a Hex of markers, with clearing cones outside, to learn the shape, timing and fakes.',
    setup: 'Seven marker cones in a regular Hex (2-3-2) and six clearing cones round the outside, between and further out from the marker cones. 6–13 players.',
    rotation: 'Rolling subs wait near the clearing cones, or play in short bursts at a pace the offence can sustain.',
    rules: [
      'Cut to any marker or clearing cone from anywhere in the shape.',
      'You may stand still on a marker cone, but keep moving near clearing cones.',
      'Passes go marker cone to marker cone and are caught in stride.',
      'Fake instead of throwing if the receiver arrives too early, two players cut to the same cone, or you\'re not happy with the pass.',
    ],
    steps: [
      { text: 'The disc starts on the edge of the shape. One player cuts out to a clearing cone to open the first pass.',
        dia: { view: SV, cones: [...HEXCONES, ...CLEARCONES], o: [['A', 6, 31], ['B', 13, 40], ['C', 18.5, 31], ['D', 24, 22], ['E', 31, 31]], disc: 'A',
          run: [[18.5, 31, 18.5, 16, 2]], note: [['clearing cone', 20, 14]] } },
      { text: 'Someone fills the empty marker cone and receives in stride; play keeps flowing marker to marker for 30–60 seconds.',
        dia: { view: SV, cones: [...HEXCONES, ...CLEARCONES], o: [['A', 6, 31], ['B', 13, 40], ['C', 18.5, 16], ['D', 24, 22], ['E', 31, 31]], disc: 'A',
          run: [[13, 40, 18, 32, -2]], throw: [[6, 31, 18, 31.5, 1]] } },
    ],
    tips: ['Heads up.', 'Create space for teammates.', 'Use fakes to keep the tempo.', 'Talk constantly, with voice and gestures.'],
  },
  {
    id: 'hex-mex-huck', title: 'Hex: Mex Huck', players: '8+', cat: 'Throwing',
    tags: ['Hex', 'Hucking', 'Breaking the mark', 'Continuations'], credits: [FELIX],
    summary: 'A rotating rhombus: break the force to a cutter, who throws long to the cutter turning deep.',
    setup: 'Players in a rhombus: thrower A with a marker at the bottom, a cutter on the open side, a cutter on the break side and one deep/forward. 8–13 players with a queue.',
    rotation: 'New player → force → break-thrower → long thrower (starts open side) → deep-to-under cutter (starts deep) → under-to-deep cutter (starts break side) → queue.',
    steps: [
      { text: 'The first cut goes from the open side across to the break side. At the same time the break-side cutter goes deep and the deep player comes under to the open side.',
        dia: { view: SV, o: [['A', 18, 42], ['B', 27, 32], ['C', 9, 32], ['D', 18, 20]], d: [['F', 20, 40.5]], disc: 'A',
          run: [[27, 32, 12, 34, 3], [9, 32, 12, 14, -3], [18, 20, 26, 30, 3]] } },
      { text: 'If A hits the break pass, the under cutter turns to go deep and the deep cutter turns to come under. The catcher throws long to the new deep cutter.',
        dia: { view: SV, o: [['A', 18, 42], ['B', 12, 34], ['C', 12, 14], ['D', 26, 30]], d: [['F', 20, 40.5]], disc: 'B',
          throw: [[18, 42, 12, 34, 2], [12, 34, 27, 10, -3]], run: [[26, 30, 27, 11, -2], [12, 14, 15, 26, 2]] } },
      { text: 'If no break is thrown, the cutters improvise a backup: often the first deep cutter comes under on the open side, then throws long to the original break-side cutter.',
        dia: { view: SV, o: [['A', 18, 42], ['B', 12, 34], ['C', 12, 14], ['D', 26, 30]], d: [['F', 20, 40.5]], disc: 'A',
          throw: [[18, 42, 26, 30, -2]] } },
    ],
    progressions: ['Add defenders.', 'Let the cutters choose which way the rotation goes.', 'Vary which cutter starts the downfield movement.',
      'Rotate the shape so the long thrower catches moving towards the endzone.', 'Switch to lateral movement as a swinging drill.', 'Use the open side when there is no break.'],
    tips: ['Practises long throws from motion and breaking the force.', 'Cutters start with hips facing the thrower and react to space as it appears, not just run the pattern.'],
  },
  {
    id: 'give-go-swill', title: 'Give-Go-Swill', players: '7+', cat: 'Handling',
    tags: ['Hex', 'Give and go', 'Match defence', 'Hucking'], credits: [FELIX],
    summary: 'One attacker and one defender work the disc up a zig-zag of static players using give-and-gos, then a contested "swilly" long throw.',
    setup: 'The active attacker O starts at the top with a defender D. Everyone else stands still in a zig-zag line up the far side, with the end target at the far end. 7–12 players.',
    rotation: 'Long thrower → top of the queue; static players zig-zag down one spot; O → first static player; D → becomes the active O.',
    rules: [
      'O must get the disc to the end player and must use at least one static player on the way.',
      'O can only throw to players they are connected to. Static players can\'t pass to each other.',
      'D tries to contain O, intercept or get a point block.',
    ],
    steps: [
      { text: 'O gives to a static player and goes, working the disc up the line.',
        dia: { view: SV, o: [['O', 15, 44], ['S1', 24, 38], ['S2', 18, 30], ['S3', 25, 22], ['E', 19, 12]], d: [['D', 13, 41]], disc: 'O',
          throw: [[15, 44, 24, 38, -1]], run: [[15, 44, 15, 33, 2]] } },
      { text: 'When the disc reaches the end player, they throw a long, floaty pass back towards the start, high enough for both O and D to contest.',
        dia: { view: SV, o: [['O', 20, 24], ['S1', 24, 38], ['S2', 18, 30], ['S3', 25, 22], ['E', 19, 12]], d: [['D', 18, 24]], disc: 'E',
          throw: [[19, 12, 16, 44, 6]], run: [[20, 24, 17, 42, -2]], drun: [[18, 24, 15, 41, 2]] } },
    ],
    tips: ['Misdirection, balance, flow and tempo.', 'Give-and-gos, even ones away from the end target, beat attacking the defender from a standstill.',
      'Tell the static players clearly when and where you want it back.'],
  },

  // ======================================================= FAST BREAK
  {
    id: 'fast-break-back-line', title: 'Fast Break: Bump, Set, Spike', players: '7+', cat: 'Team play',
    tags: ['Fast break', 'Team cutting patterns', 'Communication'], credits: [WEISBROD],
    summary: 'The back-line transition after a turnover deep in your half: bump it sideways, set up an under cut for big yards, then hit the streaker.',
    setup: 'A full line of 7 walks through a turnover far downfield, with cutters already past the disc. Add defenders once the pattern is smooth.',
    rules: [
      'Treat every turnover as a fast break until the disc is picked up: heads up, sprint to your spot. If the defence reacts in time, slow down and run your normal offence.',
      'Anyone can pick up the disc. Ideally the picker comes from behind it so they can see downfield.',
      'Move the disc straight away. Even a short lateral keeps the advantage; holding it for several seconds is worse than a stopped-disc offence.',
    ],
    steps: [
      { text: 'Bump: the picker moves the disc laterally at once. The furthest-downfield player cuts hard deep; everyone else goes wide to the sidelines.',
        dia: { view: SV, side: 'left', o: [['A', 16, 42], ['B', 23, 42], ['C', 19, 20], ['D', 10, 28], ['E', 28, 28], ['F', 12, 34], ['G', 25, 34]], disc: 'A',
          throw: [[16, 42, 23, 42, -1]], run: [[19, 20, 19, 6, 0], [10, 28, 3, 24, 1], [28, 28, 34, 24, -1], [12, 34, 4, 32, 1], [25, 34, 33, 32, -1]] } },
      { text: 'Set: if the deep cutter is open, throw it. If not, they plant and cut hard under into the middle for big yards, while the furthest-downfield sideline cutter sets up a cut into the deep space.',
        dia: { view: SV, side: 'left', o: [['B', 23, 42], ['C', 19, 8], ['D', 3, 24], ['E', 34, 24]], disc: 'B',
          run: [[19, 8, 18, 24, 2], [34, 24, 26, 6, 3]], throw: [[23, 42, 18, 25, -2]] } },
      { text: 'Spike: the under cutter turns and finds the streaking receiver for the score.',
        dia: { view: SV, side: 'left', o: [['C', 18, 25], ['E', 24, 6], ['D', 3, 24]], disc: 'C', throw: [[18, 25, 24, 6, -2]] } },
    ],
    tips: ['Front-line turnovers (an errant reset, a point block, a short incomplete throw) are simpler: there\'s no deep help, so look for a quick strike, otherwise move it to the next open player and repeat until you score or the defence sets.'],
  },
  {
    id: 'fast-break-games', title: 'Fast Break Scrimmage Formats', players: '10+', cat: 'Games',
    tags: ['Fast break', 'Game', 'Communication'], credits: [WEISBROD],
    summary: 'Five ways to bias a scrimmage so the team practises fast breaks, from whistled turnovers to "you must fast break every turn".',
    setup: 'Normal scrimmage. A coach or captain with a whistle for some versions.',
    srcnote: 'These are the practice formats from Weisbrod\'s article; the scrimmage size is up to you.',
    rules: [
      'Make-it, take-it: the team that scores takes possession going the other way. Practises the 180° switch in the space you attack (not the D-to-O transition itself).',
      'Whistle for turnovers: blow while the disc is in the air and the receiver must drop it, so you can rehearse a chosen front-line or back-line situation.',
      'Incentives: bonus points or bonus endzone reps for fast-break attempts or scores. Require specific calls, and remove the bonus if the communication isn\'t there.',
      'Mandatory fast breaks (Weisbrod\'s favourite, for low-stakes games): every turnover must be fast-broken, even 15 yards deep in your own endzone, so players learn where the limits are.',
      'Banned fast breaks: forbid them in obvious situations for a while, so the team is keen to use them once the ban lifts.',
    ],
    steps: [],
  },

  // ========================================================= BRACKETING
  {
    id: 'bracket-back-of-stack', title: 'Bracket the Back of the Stack', players: '5+', cat: 'Defence',
    tags: ['Bracketing', 'Team defence', 'Vert stack', 'Communication'], credits: [LT],
    summary: 'Two defenders share the two deepest cutters: one takes the deep space, the other the under space, then they go back to one-on-one.',
    setup: 'A thrower and the two cutters at the back of a vertical stack, with their two defenders. Add the rest of the stack and marks when ready.',
    srcnote: 'LT explains the basic bracket but doesn\'t give a drill. This sets up the exact situation he describes so you can rehearse it.',
    steps: [
      { text: 'The deep defender stays on the deep side of whichever cutter is deeper; the other stays on the under side of whichever cutter is underneath.',
        dia: { view: SV, o: [['T', 18, 44], ['C1', 18, 26], ['C2', 18, 20]], d: [['Du', 19.5, 29.5], ['Dd', 19.5, 15]], disc: 'T' } },
      { text: 'The cutters go: one deep, one under. The deep defender takes the deep cut and the under defender takes the under cut, whoever started on them.',
        dia: { view: SV, o: [['T', 18, 44], ['C1', 18, 26], ['C2', 18, 20]], d: [['Du', 19.5, 29.5], ['Dd', 19.5, 15]], disc: 'T',
          run: [[18, 26, 27, 10, -3], [18, 20, 12, 34, 3]], drun: [[19.5, 15, 25, 9, -1], [19.5, 29.5, 14, 33, 1]] } },
      { text: 'If a cutter moves towards the disc, the next-closest defender takes them. Once the two attackers are no longer near each other, the bracket ends and everyone goes back to one-to-one.',
        dia: { view: SV, o: [['T', 18, 44], ['C1', 27, 10], ['C2', 12, 34]], d: [['Du', 14, 33], ['Dd', 25, 9]], disc: 'T' } },
    ],
    tips: ['Set it up with eye contact and a nod, or a quick hand signal; or agree it on the sideline ("I like to bracket at the back of the stack, you down?").'],
  },

  // ======================================================== ENDZONE / PULL PLAYS
  {
    id: 'flood-side-stack', title: 'Flood Side Stack (Endzone Play)', players: '7+', cat: 'Endzone',
    tags: ['Endzone', 'Set play', 'Side stack', 'Flood'], credits: [GRAVES],
    summary: 'Isolate your best cutter in the middle, flood the stack across, and score with the back of the stack cutting under into the space left behind.',
    setup: 'Best cutter isolated in the middle of the endzone. Everyone else stacked on one side, with a reset directly behind the thrower.',
    steps: [
      { text: 'Start: iso in the middle, side stack on one side, reset behind the thrower.',
        dia: { view: SV, ez: 18, o: [['T', 18, 26], ['R', 18, 31], ['I', 18, 10], ['1', 29, 20], ['2', 29, 15], ['3', 29, 10], ['4', 29, 5]], disc: 'T' } },
      { text: 'On the tap-in, the stack floods towards the middle. The back of the stack waits a beat, then cuts under into the space that was left; T hits them for the goal.',
        dia: { view: SV, ez: 18, o: [['T', 18, 26], ['R', 18, 31], ['I', 18, 10], ['1', 29, 20], ['2', 29, 15], ['3', 29, 10], ['4', 29, 5]], disc: 'T',
          run: [[29, 15, 22, 13, 1], [29, 10, 22, 8, 1], [29, 5, 23, 4, 1], [29, 20, 31, 15, -1]], throw: [[18, 26, 30, 15, -2]] } },
    ],
    progressions: ['If the defence doesn\'t help on the iso, call the play off and use that player\'s space.',
      'Pick a different stack player to cut under.', 'If a defender poaches hard, the poached cutter comes under instead.'],
    tips: ['If it\'s covered, the thrower looks to the reset while the stack sorts itself into your normal endzone offence.'],
  },
  {
    id: 'reverse-zipper', title: 'Reverse Zipper (Pull Play)', players: '7+', cat: 'Endzone',
    tags: ['Endzone', 'Set play', 'Pull play', 'Vert stack'], credits: [GRAVES],
    summary: 'A vertical-stack pull play: front to the open-side back corner, second-from-bottom to the break-side front cone, middle cuts straight under for the goal.',
    setup: 'Vertical stack in front of the endzone, disc with the thrower after the pull.',
    steps: [
      { text: 'Front of the stack cuts to the back corner on the open side; second-from-bottom cuts to the front cone on the break side; the middle of the stack cuts straight under to the thrower.',
        dia: { view: SV, ez: 14, cones: [[3, 14], [34, 14]], o: [['T', 18, 42], ['1', 18, 34], ['2', 18, 30], ['3', 18, 26], ['4', 18, 22], ['5', 18, 18]], disc: 'T',
          run: [[18, 34, 32, 4, -4], [18, 22, 5, 15, 3], [18, 26, 18, 16, 0]] } },
      { text: 'Hit the open-side or break-side cut if either is open straight away. Otherwise throw into the space the middle cutter is heading to.',
        dia: { view: SV, ez: 14, cones: [[3, 14], [34, 14]], o: [['T', 18, 42], ['1', 32, 4], ['4', 5, 15], ['3', 18, 16]], disc: 'T',
          throw: [[18, 42, 18, 13, -2]] } },
    ],
    tips: ['If it\'s covered, the thrower keeps the reset and the stack reorganises into your endzone offence.'],
  },
  {
    id: 'the-play-reset-strike', title: '"The Play": Reset Strike', players: '7+', cat: 'Endzone',
    tags: ['Endzone', 'Set play', 'Pull play', 'Vert stack'], credits: [GRAVES],
    summary: 'Your fastest player sets up as the break-side reset, then sprints straight into the endzone on the tap-in.',
    setup: 'Vertical stack about 10 m or more out. Fastest player as the reset on the expected break side; primary handler with the disc at the front.',
    steps: [
      { text: 'On the tap-in, the reset sprints straight to the endzone and the handler throws to them. The bottom of the stack watches for a continuation cut to the side away from the reset.',
        dia: { view: SV, ez: 14, o: [['T', 18, 42], ['R', 11, 43], ['1', 18, 32], ['2', 18, 28], ['3', 18, 24], ['4', 18, 20]], disc: 'T',
          run: [[11, 43, 9, 8, 2], [18, 20, 26, 10, -2]], throw: [[18, 42, 9, 9, 3]] } },
    ],
    tips: ['If the defence poaches, or the mark shifts to help, the bottom of the stack makes the continuation cut.',
      'If it\'s covered, run your normal endzone offence after the reset, with the disc going to the bottom of the stack.'],
  },
  {
    id: 'system-endzone', title: 'System Endzone (Script)', players: '5+', cat: 'Endzone',
    tags: ['Endzone', 'Handler resets', 'Swinging the disc'], credits: [GRAVES],
    summary: 'A repeating script rather than a set play: sideline handler to middle reset, reset strikes, stack front fills, look break side, bounce it back, go again.',
    setup: 'Stack in the centre of the endzone. One handler mid-field and one by a sideline (ideally the open side). Can be run from anywhere on the pitch.',
    steps: [
      { text: 'The sideline handler throws to the mid-field reset. If that isn\'t open, the reset strikes and the front of the stack fills the reset spot.',
        dia: { view: SV, side: 'right', ez: 18, o: [['H1', 33, 30], ['H2', 18, 32], ['1', 18, 22], ['2', 18, 15], ['3', 18, 10], ['4', 18, 5]], disc: 'H1',
          run: [[18, 32, 30, 16, -3], [18, 22, 18, 31, 2]], throw: [[33, 30, 30, 17, 2]] } },
      { text: 'If the reset catches, look straight away to the break side for a continuation cut. If it isn\'t there, bounce back to the sideline handler and strike again.',
        dia: { view: SV, side: 'right', ez: 18, o: [['H1', 33, 30], ['H2', 18, 31], ['2', 18, 15], ['3', 18, 10]], disc: 'H2',
          throw: [[33, 30, 18, 31, 1]], run: [[18, 15, 6, 10, 2]] } },
    ],
    tips: ['Nobody holds the disc for more than four stall counts.', 'Risk: once the defence recognises the pattern it can poach or tighten up on key players.'],
  },

  // ======================================================= ZONE OFFENCE
  {
    id: 'zone-flood-weak-side', title: 'Zone O: Flood the Weak Side', players: '7+', cat: 'Team play',
    tags: ['Zone offence', 'Flood', 'Swinging the disc', 'Give and go'], credits: [OWEN],
    summary: 'Overload the far side: a handler and two poppers wait away from the disc, then give-and-go before the cup can shift.',
    setup: 'Against a cup. The disc on one side; a handler on the opposite side of the field with two poppers near them.',
    srcnote: 'Owen describes this as a way to attack a zone, not as a drill; run it as a walk-through, then against a live cup.',
    steps: [
      { text: 'The thrower is left alone with the four nearby defenders. The weak-side handler and two poppers set up on the far side.',
        dia: { view: SV, o: [['T', 7, 36], ['H', 29, 36], ['P1', 25, 28], ['P2', 32, 28]], d: [['', 8, 34], ['', 11, 32], ['', 6, 31], ['', 13, 36]], disc: 'T' } },
      { text: 'Swing it across with a hammer or a dump-swing. The poppers give-and-go before the cup arrives: "frisbees are faster than feet".',
        dia: { view: SV, o: [['T', 7, 36], ['H', 29, 36], ['P1', 25, 28], ['P2', 32, 28]], d: [['', 8, 34], ['', 11, 32], ['', 6, 31], ['', 13, 36]], disc: 'T',
          throw: [[7, 36, 29, 36, 5], [29, 36, 25, 28, 1]], run: [[29, 36, 27, 20, 2]] } },
    ],
  },
  {
    id: 'zone-popper-options', title: 'Zone O: Popper Options and the Hammer', players: '7+', cat: 'Team play',
    tags: ['Zone offence', 'Overheads', 'Pivots & fakes', 'Spacing'], credits: [OWEN, GLASZ],
    summary: 'Four ways through or over a cup: sneak in and pivot, stand in space for an overhead, a decoy run to open a gap, and flood deep to free a hammer.',
    setup: 'A handler with the disc against a cup (3 defenders round the disc), two poppers behind it, wings and deep players.',
    srcnote: 'These are Owen\'s methods for attacking a zone, with Glasgow\'s "through, around, over" summary. Neither gives a drill format; rehearse each option against a cup.',
    steps: [
      { text: 'Sneak in and pivot: a popper steps just inside the cup, leans in to take a very short pass (under a metre), then pivots past a defender and throws on. The disc goes through on the pivot, not thrown through the cup.',
        dia: { view: SV, o: [['H', 18, 40], ['P1', 15, 35], ['P2', 23, 30], ['W', 31, 26]], d: [['', 18, 38], ['', 14, 37], ['', 22, 37]], disc: 'H',
          throw: [[18, 40, 15.5, 36, 0], [15, 35, 23, 30, -1]] } },
      { text: 'Stand in space: poppers wait behind the cup in open space. If the wing defenders are busy, one should be free for a hammer, blade or scoober.',
        dia: { view: SV, o: [['H', 18, 40], ['P1', 13, 29], ['P2', 24, 29]], d: [['', 18, 38], ['', 14, 37], ['', 22, 37], ['', 29, 27]], disc: 'H',
          throw: [[18, 40, 13, 29, 4]] } },
      { text: 'Decoy run: one popper runs through the cup to drag a defender; the handler throws through the gap to the other popper, already waiting where the gap will open.',
        dia: { view: SV, o: [['H', 18, 40], ['P1', 15, 30], ['P2', 21, 30]], d: [['', 18, 38], ['', 14, 37], ['', 22, 37]], disc: 'H',
          run: [[15, 30, 14, 39, 1]], drun: [[14, 37, 12, 39, 0]], throw: [[18, 40, 21, 31, 1]] } },
      { text: 'Flood deep and hammer: three or four players go deep, each pulling a defender, which leaves one attacker open for a hammer or blade.',
        dia: { view: SV, o: [['H', 18, 40], ['P1', 26, 29], ['W1', 8, 26], ['W2', 30, 24], ['C', 18, 18]], d: [['', 18, 38], ['', 14, 37], ['', 22, 37]], disc: 'H',
          run: [[8, 26, 8, 8, 0], [30, 24, 30, 6, 0], [18, 18, 18, 4, 0]], throw: [[18, 40, 26, 29, 4]] } },
    ],
    tips: ['Keep the disc moving, keep the stall count low and keep it away from the sidelines (Glasgow).',
      'Explode once the wall is beaten: move the disc upfield fast, or back to the centre if a wing catches. Deep and wing receivers keep helping and don\'t turn or cut away (Glasgow).',
      'A warning from Owen (Thinkulti) about dump-and-swing until a wing is open: seven sideways passes at 90% each is more likely to turn over than not, and the disc never goes forward.'],
  },

  // ======================================================== ZONE / JUNK DEFENCE
  {
    id: 'junk-zone-roles', title: 'Junk Zone: Roles and Talk', players: '7+', cat: 'Defence',
    tags: ['Zone defence', 'Team defence', 'Communication'], credits: [GLASZ],
    summary: 'Who says what in a junk zone, how the wall moves, and how to switch straight into man.',
    setup: 'A full line on defence against an offence, walking through then playing live. A force, a wall in the middle, wings and a deep.',
    srcnote: 'Glasgow\'s recap lists the roles and principles from their junk-zone session but doesn\'t publish the drills; use these as the coaching points for a walk-through and a scrimmage.',
    steps: [
      { text: 'Positions: a force on the disc, a wall across the middle, wings either side and a deep.',
        dia: { view: SV, o: [['T', 10, 40], ['', 20, 40], ['', 6, 28], ['', 18, 26], ['', 30, 26], ['', 12, 14], ['', 26, 14]], d: [['F', 11, 38], ['W', 13, 31], ['W', 18, 31], ['W', 23, 31], ['Wg', 5, 24], ['Wg', 31, 22], ['Dp', 18, 12]], disc: 'T' } },
    ],
    rules: [
      'The sideline talks to everyone, especially the force.',
      'The middle of the wall keeps the wall in position.',
      'Wings tell the middle when to crash in.',
      'The deep talks to the wings and keeps them in place.',
      'The wall moves as one; any gap lets the offence through. The middle player can stand side-on, watch for cuts and block them off.',
      'Switching to man is immediate: on the call, pick up a mark and point at them. Deepest players switch first, and help each other find matchups.',
    ],
    tips: ['Zone works best in strong wind, where throws under pressure are hard.'],
  },

  // ======================================================== OVERHEADS
  {
    id: 'overheads-progression', title: 'Overheads: Pairs, Piggy, Overhead Tennis', players: '3+', cat: 'Throwing',
    tags: ['Overheads', 'Throwing', 'Zone offence'], credits: [GLAS4], level: 'Beginner', time: '15 min',
    summary: 'Learn the hammer in pairs, add a stationary piggy in the middle, then play Overhead Tennis over a line of "net" players.',
    setup: 'Pairs with a disc each, then groups of three, then two boxes with a line across the middle. About 5 discs per 10 people.',
    steps: [
      { text: 'Pairs: practise hammers (and other overheads if demonstrated). Forehand grip, disc above your head, let it drop behind the elbow then whip it towards the sky with a wrist snap.',
        dia: { view: SV, o: [['A', 10, 30], ['B', 26, 30]], disc: 'A', throw: [[10, 30, 26, 30, -6]] } },
      { text: 'Piggy in the middle: after a few minutes, add a player in the middle. They start stationary to make it easier for throwers.',
        dia: { view: SV, o: [['A', 8, 30], ['B', 28, 30]], d: [['M', 18, 30]], disc: 'A', throw: [[8, 30, 28, 30, -7]] } },
      { text: 'Overhead Tennis: in each box, 2 attackers and 1 defender. The other players are the "net", moving along the middle line but never leaving it. Throw overheads over the net to a teammate on the other side; the defence can block, and the attackers may pass on their own side first to set up a better throw.',
        dia: { view: SV, cones: [[2, 25], [35, 25]], o: [['A', 10, 40], ['B', 26, 38], ['C', 12, 12], ['D', 25, 10]], d: [['X', 14, 37], ['Y', 18, 13], ['N', 9, 25], ['N', 18, 25], ['N', 27, 25]], disc: 'A',
          throw: [[10, 40, 25, 11, -5]] } },
    ],
    rotation: 'Rotate positions in Overhead Tennis periodically so everyone gets a turn in each role.',
    tips: ['Keep hips and feet facing forward, or take a small step back with the pivot foot. Don\'t step forward: it over-rotates you.',
      'Right-handers aim left of the target. The receiver can point their left hand at the sky as a target.',
      'Overheads are especially useful against zones where the throwing lanes are blocked.'],
  },
  {
    id: 'freeze-game', title: 'Freeze', players: '6+', cat: 'Games',
    tags: ['Game', 'Spacing', 'Decision making', 'Pivots & fakes'], credits: [GLAS4], level: 'Beginner', time: '15 min',
    summary: 'Normal ultimate, except everyone stops dead whenever someone catches the disc, so the thrower must pivot and find a pass to static players.',
    setup: 'A normal pitch and teams (5v5 indoor or beach, 7v7 outdoor). Works indoors.',
    rules: [
      'Whoever picks up or catches the disc shouts "freeze", and everyone stops moving.',
      'The thrower can still pivot.',
      'Once the throw is released, everyone can move again.',
      'After a turnover or brick, players can keep moving until the disc is back in play.',
      'Variant: use a whistle instead of the call.',
    ],
    steps: [
      { text: 'A catches and calls "freeze". Everyone else is a statue; A pivots to find the open teammate.',
        dia: { view: SV, o: [['A', 18, 36], ['B', 10, 28], ['C', 27, 26], ['D', 18, 18]], d: [['', 18, 34], ['', 11, 26.5], ['', 25.5, 25], ['', 18, 20]], disc: 'A', throw: [[18, 36, 10, 28, 2]] } },
    ],
  },

  // ============================================================== WIND
  {
    id: 'wind-flags', title: 'Flags (Wind Game)', players: '2+', cat: 'Throwing',
    tags: ['Wind', 'Throwing', 'Small-sided', 'Hex'], credits: [FELIX],
    summary: 'Score by completing a pass across a "goal line" between two flags set up in line with the wind.',
    setup: 'Two flags (or tall cones) a few metres apart, one directly downwind of the other. The line between them is the goal line. Windier = longer line; better throwers or lighter wind = narrower.',
    steps: [
      { text: '2 players: complete throws across the goal line, throwing from where you catch.',
        dia: { view: SV, cones: [[18, 18], [18, 32]], o: [['A', 9, 25], ['B', 27, 22]], disc: 'A', throw: [[9, 25, 27, 22, -3]], note: [['wind ↓', 19.5, 15]] } },
      { text: '2v1: a turnover means the thrower becomes the defender. The defender\'s stall count is a shot clock from anywhere on the field, reset after each goal. Everyone moves freely and can pass on either side of the flags; only passes across the goal line (at any height) score.',
        dia: { view: SV, cones: [[18, 18], [18, 32]], o: [['A', 10, 22], ['B', 26, 28]], d: [['D', 12, 24]], disc: 'A', throw: [[10, 22, 26, 28, 2]], note: [['wind ↓', 19.5, 15]] } },
      { text: '3v2 or 4v3: add attackers and defenders, widen the flags or restrict the space round them.',
        dia: { view: SV, cones: [[18, 14], [18, 36]], o: [['A', 10, 22], ['B', 26, 28], ['C', 12, 34]], d: [['D', 12, 24], ['E', 24, 26]], disc: 'A', note: [['wind ↓', 19.5, 11]] } },
    ],
    tips: ['Trains spotting space and throwing in the wind; Felix Shardlow says it exposes weaknesses and challenges strengths.'],
  },
  {
    id: 'wind-throwing-pairs', title: 'Upwind and Downwind Throwing', players: '2', cat: 'Throwing',
    tags: ['Wind', 'Throwing', 'Warm-up'], credits: [GDFU],
    summary: 'Pairs 20 yards apart in the wind: 5 forehands and 5 backhands each way, upwind inside-out and low, downwind outside-in and higher.',
    setup: 'Pairs about 20 yards (18 m) apart, lined up with the wind. Check which way the wind is blowing first: drop some grass and watch, or look at a windsock.',
    steps: [
      { text: 'Upwind (into the wind): inside-out and keep it low, throw a little harder, with lots of spin. The wind catches the underside and lifts the disc.',
        dia: { view: SV, o: [['A', 18, 42], ['B', 18, 24]], disc: 'A', throw: [[18, 42, 18, 24, 3]], note: [['wind ↓', 20, 20]] } },
      { text: 'Downwind (with the wind): outside-in and keep it high(ish), throw a little softer, still with lots of spin. Hard downwind throws dive at the receiver\'s feet and are hard to catch for in-cutters.',
        dia: { view: SV, o: [['A', 18, 24], ['B', 18, 42]], disc: 'A', throw: [[18, 24, 18, 42, -3]], note: [['wind ↓', 20, 20]] } },
    ],
    tips: ['5 forehands and 5 backhands, then swap ends.', 'Crosswinds are a mix of the two.'],
  },

  // ======================================================== LAYING OUT
  {
    id: 'layout-progression', title: 'Laying Out Safely: Progression', players: '2+', cat: 'Fundamentals',
    tags: ['Laying out', 'Catching', 'Match defence'], credits: [ROB_LAY, RUMMEL],
    summary: 'From a standing dive onto your chest, to floaty layout catches, to layout Ds at an angle that keeps both players safe.',
    setup: 'A thrower and a catcher. Soft ground helps: a muddy day, sand or pole-vault mats. Keep layout drills short so the total impact is small.',
    steps: [
      { text: 'Standing dive (Ultimate Rob): someone holds the disc out and you dive from standing to practise the landing. Start slowly. Land on your chest with your body extended, legs straight behind you, not on your knees.',
        dia: { view: SV, o: [['H', 18, 26], ['C', 18, 34]], disc: 'H', run: [[18, 34, 18, 28, 0]] } },
      { text: 'Layout O drill (Ultiworld): thrower and cutter start on a sideline. The thrower floats a low pass towards the far sideline (about 40 yards) and the cutter must lay out to catch it. Swap and repeat ten times; fatigue forces the layouts.',
        dia: { view: [0, 0, 37, 50], side: 'left', o: [['T', 2, 40], ['C', 3, 44]], disc: 'T', run: [[3, 44, 30, 20, 4]], throw: [[2, 40, 31, 19, -4]] } },
      { text: 'Layout D drill (Ultiworld): three cones in a long triangle with a line at the middle point. One player runs the triangle while another chases from the midpoint and must run through or lay out to block. The thrower throws in front of the runner at the edge of the triangle, within layout range. The defender who laid out then runs offence.',
        dia: { view: SV, cones: [[8, 42], [28, 42], [18, 10]], o: [['T', 18, 46], ['R', 24, 28]], d: [['D', 18, 34]], disc: 'T', run: [[24, 28, 20, 16, 1]], drun: [[18, 34, 19, 18, 1]], throw: [[18, 46, 21, 17, -3]] } },
    ],
    tips: [
      'Catch with a rim or "hamburger" catch, never a pancake: pancakes greatly raise the injury risk (Rob).',
      'Shoulders: both sources warn of dislocations. Rob says arriving with too much speed, or reaching with both arms, has caused them; Ultiworld says keep both arms extended, as leaning with one can cause an awkward landing. Whichever you do, don\'t twist or land on your side or shoulder.',
      'Eyes, arms and chest up; slide forward rather than bracing or pushing down. Chest pain means your form is off and you\'re not sliding (Ultiworld).',
      'Bidding on D: expect another player between you and the disc, and bid at an angle that protects both of you. Know your range and when to stay on your feet (Ultiworld).',
      'If it hurts or your form is off, break it back down and go to a softer surface (Ultiworld). Don\'t overthink it, as that leads to hesitation (Rob).',
    ],
  },
];

// ---------------------------------------------------------------------------
// Playspedia (playspedia.com): community playbooks with step-by-step
// animations. Their pages can't be embedded, so we redraw the drill and link
// to the animation. Playspedia's creators keep ownership of their plays.
const PS = 'https://playspedia.com/play/';
const PLAYSPEDIA_DRILLS = [
  {
    id: 'swill-reading', title: 'Swill Drill: Reading the Deep Disc',
    alsoFrom: [['USA Ultimate, Skills and Drills Manual (revised 2019): "Big Man Drill"', 'https://archive.usaultimate.org/assets/1/Page/Skills%20and%20Drills%20manual_revised2019.pdf']], players: '3+', cat: 'Cutting',
    tags: ['Deep cuts', 'Boxing out', 'Catching', 'Hucking'], credit: 'isaac_davis', url: PS + '18823',
    summary: 'Two players chase a floaty huck: read the flight, don\'t overrun it, and get your body between your opponent and the landing spot.',
    setup: 'A thrower with discs, and pairs in a line next to them. For the progression, two cones a few metres apart, one in front of the other, beside the line.',
    steps: [
      { text: 'The thrower taps the disc and the two players run deep together. The thrower varies their throws so players get used to reading different flights.',
        dia: { view: SV, o: [['T', 16, 44], ['A', 19, 38], ['B', 22, 38]], disc: 'T', run: [[19, 38, 18, 16, 1], [22, 38, 22, 16, -1]], throw: [[16, 44, 20, 13, 4]] } },
      { text: 'Don\'t overrun the disc, and don\'t sit directly underneath it, because then you can\'t read its path. Work hard to get your body between the other player and where the disc will come down.',
        dia: { view: SV, o: [['T', 16, 44], ['A', 19, 17], ['B', 22, 15]], disc: 'T', throw: [[16, 44, 20, 13, 4]], run: [[22, 15, 20.5, 14, 0]] } },
      { text: 'Progression: the defender stands on the front cone facing downfield; the attacker starts behind on the back cone. The attacker runs past and taps the defender on the back as they go, then uses the head start to get between the defender and the disc, so they can win it even if they are shorter or slower.',
        dia: { view: SV, cones: [[24, 36], [24, 42]], o: [['T', 16, 44], ['O', 24, 42]], d: [['D', 24, 36]], disc: 'T',
          run: [[24, 42, 21, 16, 2]], drun: [[24, 36, 23, 18, -1]], throw: [[16, 44, 21, 13, 4]] } },
    ],
    progressions: ['USA Ultimate\'s "Big Man Drill" is the same idea with lines: the defensive line about 2 yards from the thrower and level with them, the offensive line 2 yards further and 2 yards ahead; on "go" the front pair sprint, the thrower floats it 35–40 yards, and the attacker has a slight head start. Jog the disc back and switch lines. Only players who can throw consistent floaty passes should throw (rated Beginner–Intermediate, 7+ players).'],
    tips: ['Read the disc early: stay where you can see its flight rather than under it.', 'Position beats height and speed: win the spot between your opponent and the landing point.'],
  },
  {
    id: 'twist-drill', title: 'Twist Drill: Timing the Continuation', players: '8+', cat: 'Team play',
    tags: ['Vert stack', 'Continuations', 'Timing', 'Deep cuts'], credit: 'SixPack', url: PS + '19696',
    summary: 'The back of the stack cuts open side; the moment that throw goes, the second player in the stack starts their cut deep for the continuation.',
    setup: 'A thrower with the disc and a vertical stack of seven in front of them, with someone setting the stack.',
    steps: [
      { text: 'The back of the stack makes the first cut to the open side.',
        dia: { view: SV, o: [['T', 18, 44], ['2', 18, 34], ['3', 18, 31], ['4', 18, 28], ['5', 18, 25], ['6', 18, 22], ['7', 18, 19]], disc: 'T', run: [[18, 19, 26, 28, -3]] } },
      { text: 'As the disc is thrown to that cutter, number 2 in the stack starts their cut, so they\'re already moving when the first cutter catches.',
        dia: { view: SV, o: [['T', 18, 44], ['2', 18, 34], ['3', 18, 31], ['4', 18, 28], ['5', 18, 25], ['6', 18, 22], ['7', 26, 28]], disc: 'T',
          throw: [[18, 44, 26, 29, -2]], run: [[18, 34, 11, 30, 2], [11, 30, 14, 10, 3]] } },
      { text: 'The first cutter catches and throws the continuation deep to number 2.',
        dia: { view: SV, o: [['T', 18, 44], ['2', 14, 12], ['7', 26, 28]], disc: '7', throw: [[26, 28, 14, 11, -3]] } },
    ],
    tips: ['The drill is about timing: number 2 goes on the throw, not on the catch.'],
  },
  {
    id: 'hot-box', title: 'Hot Box', players: '8+', cat: 'Games',
    alsoFrom: [['USA Ultimate, Skills and Drills Manual (revised 2019)', 'https://archive.usaultimate.org/assets/1/Page/Skills%20and%20Drills%20manual_revised2019.pdf'], ['Glasgow Ultimate, Introduction to Ultimate, Lesson 3', 'https://glasgowultimate.quarto.pub/intro-to-ultimate/lesson3.html']],
    tags: ['Game', 'Small-sided', 'Spacing', 'Give and go'], credit: 'cassidystiglbauer', url: PS + '24549',
    summary: 'Small-sided game: score by completing a pass to a teammate inside a small cone box in the middle; after each score, possession flips and the new team must clear it to the outside first.',
    setup: 'An outer border of cones and a small box of cones in the middle. Two teams (the source diagram shows 4v4).',
    rules: [
      'The offence starts with the disc on the outer border and sets up around the box.',
      'Complete passes and score by catching in the box in the middle.',
      'After a score, the other team gets possession.',
      'The new offence must clear the disc to a player on the outer border before they can score again.',
    ],
    steps: [
      { text: 'Work the disc round the box and hit a teammate cutting into it.',
        dia: { view: SV, cones: [[4, 18], [32, 18], [4, 44], [32, 44], [15, 28], [21, 28], [15, 34], [21, 34]],
          o: [['1', 6, 20], ['2', 28, 30], ['3', 14, 40], ['4', 30, 20]], d: [['', 8, 22], ['', 26, 31], ['', 16, 38], ['', 28, 22]], disc: '1',
          throw: [[6, 20, 30, 20, -2]], run: [[14, 40, 18, 31, 1]] } },
    ],
    progressions: ['USA Ultimate version: a box about 8 × 8 ft of four low cones, with two clearing markers about 30 yards away in opposite directions and no out of bounds. Both feet must be in the box to score; after a turnover, clear across either line first. Vary it with a stall count, moving the clearing markers, using one clearing line, or changing the box size.',
      'Glasgow Ultimate version (warm-up): a small box about 2–3 m across inside a larger one about 10–12 m across (the source writes "m²", but these read as side lengths); after a turnover, clear outside the big box. The scoring team keeps the disc and must clear it again before scoring; three scores in a row and possession changes. Encourage give-and-gos, quick disc movement and aggressive pivots and fakes.'],
  },
];

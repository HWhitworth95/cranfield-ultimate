// Diagrams used inside the written pages (not drills). A page includes
// <div class="pdia" data-key="..."></div> and app.js draws the matching entry
// with the drill-library renderer. Same diagram format as the drills.
const PAGE_DIAS = {
  // ---- Cutting basics
  'cut-deep': { cap: 'Going deep: start shallow and stay wide of the throwing lane (blue), so the throw goes up the lane into space ahead of you. Cutting straight up the lane (grey) blocks it and puts the throw over your head.',
    dia: { view: [4, 4, 34, 46], o: [['T', 16, 40], ['C', 23, 30]], d: [['M', 14, 38.5]], disc: 'T', run: [[23, 30, 24, 8, 0]], throw: [[16, 40, 23.5, 9.5, 2]], opt: [[17.5, 36, 17, 10, 0]], note: [['throwing lane', 11, 20], ['wide of the lane', 30, 16]] } },
  'cut-under': { cap: 'Coming under: cut in at an angle (blue). You get past your defender, give the thrower a bigger target and catch already facing upfield. A flat cut straight at the thrower (grey) leaves you facing the wrong way with the defender behind you.',
    dia: { view: [4, 4, 34, 46], o: [['T', 16, 40], ['C', 25, 21]], d: [['M', 14, 38.5], ['D', 23, 18.5]], disc: 'T', run: [[25, 21, 25, 15, 0], [25, 15, 18, 29, 0]], throw: [[16, 40, 18.2, 30.5, 1]], opt: [[25, 23.5, 19, 37, 0]], note: [['angled', 14, 22], ['flat', 26, 32]] } },
  'cut-continuation': { cap: 'Continuation: as the first cutter catches, the next cutter is already sprinting into the space ahead, so the new thrower can release straight away.',
    dia: { view: [4, 4, 34, 46], o: [['T', 16, 40], ['1', 18, 28], ['2', 12, 22]], disc: 'T', throw: [[16, 40, 18, 29.5, 1], [18, 28, 11.5, 8.5, 2]], run: [[12, 22, 11, 7, 0]] } },

  // ---- Side stack
  'ss-setup': { cap: 'Side stack: the stack sits on one sideline, leaving the whole space in front of the disc for one isolated cutter. The first cutter (E) attacks that space; if they don\'t get it, they clear back to the front of the stack.',
    dia: { view: [0, 2, 37, 46], side: 'left', o: [['H', 6, 40], ['R', 15, 41], ['A', 6, 30], ['B', 6, 26], ['C', 6, 22], ['D', 6, 18], ['E', 6, 14]], disc: 'H', run: [[6, 14, 16, 8, 0], [16, 8, 21, 25, 0]], opt: [[21, 25, 8.5, 33, 0]], note: [['space for one cutter', 23, 18]] } },
  'ss-continuation': { cap: 'Continuation: the next cut always comes from the back of the stack, timed to start as the first cutter makes their first turn, so the thrower has two options in sequence.',
    dia: { view: [0, 2, 37, 46], side: 'left', o: [['H', 6, 40], ['E', 21, 25], ['D', 6, 18], ['C', 6, 22], ['B', 6, 26], ['A', 6, 30]], disc: 'H', run: [[21, 25, 8.5, 33, 0], [6, 18, 13, 12, 0], [13, 12, 20, 6, 0]], throw: [[6, 40, 19.5, 7.5, 2]] } },
  'ss-swing': { cap: 'When the disc swings to the far side, the stack floods across to the other sideline to reopen the space in front of the disc. Only the next cutter stays to set up a new cut.',
    dia: { view: [0, 2, 37, 46], o: [['H', 6, 40], ['R', 28, 41], ['A', 6, 30], ['B', 6, 26], ['C', 6, 22], ['D', 6, 18]], disc: 'H', throw: [[6, 40, 27.5, 40.5, 1]], run: [[6, 30, 31, 28, 0], [6, 26, 31, 24, 0], [6, 22, 31, 20, 0]], note: [['flood across', 18, 15]] } },

  // ---- Person defence
  'pd-zones': { cap: 'The three races, in priority order: (1) the open-side under space right in front of the thrower, the danger zone; (2) deep, where teammates can help; (3) the break side, which the mark protects.',
    dia: { view: [0, 2, 37, 46], o: [['T', 14, 40], ['C', 21, 24]], d: [['M', 12, 38.5], ['D', 20.5, 27]], disc: 'T', note: [['1 · danger zone', 22, 33], ['2 · deep', 21, 10], ['3 · break side', 6, 26], ['open side →', 28, 40]] } },
  'pd-buffer': { cap: 'Keep a buffer: stand a couple of steps off, between your player and the danger zone, hips facing the space you\'re protecting. Accelerate as they accelerate and you win the race to the danger zone.',
    dia: { view: [4, 4, 34, 46], o: [['T', 14, 40], ['C', 22, 22]], d: [['M', 12, 38.5], ['D', 20, 25.5]], disc: 'T', run: [[22, 22, 19, 33, 0]], drun: [[20, 25.5, 18, 32, 0]], note: [['buffer', 25, 25]] } },

  // ---- Help defence and set-ups
  'hd-sandwich': { cap: 'Marking as a pair: with two attackers close together, one defender sits under and one deep. The under defender takes the first under cut; the deep defender gets tight on the other player.',
    dia: { view: [4, 4, 34, 46], o: [['T', 22, 40], ['A', 13, 24], ['B', 16.5, 24]], d: [['M', 24, 38.5], ['U', 15, 28], ['DP', 15, 19.5]], disc: 'T', note: [['under', 10, 30], ['deep', 10, 18]] } },
  'hd-ho': { cap: 'Set-up against a horizontal stack: inside-out mark, handler defenders dropping into the lanes early, the open-side defender underneath their player, the break-side defender protecting the middle, and a deep guard who still marks a break-side player.',
    dia: { view: [0, 2, 37, 46], o: [['H', 18, 40], ['H2', 10, 40], ['H3', 27, 40], ['A', 5, 22], ['B', 13, 22], ['C', 23, 22], ['E', 31, 22]], d: [['M', 20, 38.5], ['', 12, 34], ['', 25, 34], ['', 30, 26], ['', 22, 26], ['', 12, 25.5], ['DG', 9, 12]], disc: 'H', note: [['deep guard', 9, 8.5], ['IO mark', 23.5, 44]] } },
  'hd-vert': { cap: 'Set-up against a vertical stack: inside-out mark, tight on the reset and the front of the stack, two defenders sharing the open-side unders (one takes the first cut, one starts wider), one on the break side, and a deep guard at the back watching the disc.',
    dia: { view: [0, 2, 37, 46], o: [['H', 18, 40], ['R', 10, 40], ['1', 18, 30], ['2', 18, 26], ['3', 18, 22], ['4', 18, 18], ['5', 18, 14]], d: [['M', 20, 38.5], ['', 10, 37.5], ['', 20.5, 31], ['', 21, 26], ['', 25, 24], ['', 15, 22], ['DG', 18, 10]], disc: 'H', note: [['unders', 28, 29], ['break side', 9, 18]] } },

  // ---- Horizontal stack additions
  'ho-spacing': { cap: 'Horizontal stack spacing: cutters about 10–15 m from the handlers. Any further and the handlers can\'t reach the deep space; any closer and the under space collapses into the handlers\' lane.',
    dia: { view: [0, 2, 37, 46], o: [['H1', 10, 40], ['H2', 18, 41], ['H3', 27, 40], ['C1', 5, 27], ['C2', 14, 27], ['C3', 23, 27], ['C4', 32, 27]], disc: 'H2', note: [['10–15 m', 33, 34], ['deep space', 18, 12], ['under space', 14, 33.5]] } },
  'ho-sweep': { cap: 'Sweep cut: C1 cuts flat across the field at full speed, which makes their defender turn their hips; C2, C3 and C4 clear deep with good timing and then come back under after the catch, giving three continuation options.',
    dia: { view: [0, 2, 37, 46], o: [['H', 18, 40], ['C1', 5, 27], ['C2', 14, 27], ['C3', 23, 27], ['C4', 32, 27]], disc: 'H', run: [[5, 27, 22, 30, 0], [14, 27, 13, 14, 0], [23, 27, 25, 13, 0], [32, 27, 32, 13, 0]], throw: [[18, 40, 21.5, 31.5, 1]] } },

  // ---- Vertical stack additions
  'vs-central': { cap: 'Six-cutter central stack: first cuts come from either end (C6 at the back, C1 at the front) and cutters clear into the middle of the stack (C3–C4), so the sequence can repeat.',
    dia: { view: [0, 2, 37, 46], o: [['H', 15, 40], ['C1', 18, 32], ['C2', 18, 28], ['C3', 18, 24], ['C4', 18, 20], ['C5', 18, 16], ['C6', 18, 12]], disc: 'H', run: [[18, 12, 13, 15, 0], [13, 15, 25, 27, 0]], opt: [[18, 32, 9, 26, 0]], note: [['back: first cut', 26, 9], ['front: up the line', 9, 23]] } },
  'vs-pull-play': { cap: 'Side-stack pull play: (1) the nearest cutter swings it from the handler; (2) the middle cutters clear under while the last-but-one fakes deep; (3) that player comes towards the disc and the last player goes deep for the score.',
    dia: { view: [0, 2, 37, 46], side: 'left', o: [['H', 6, 40], ['C1', 6, 31], ['C2', 6, 27], ['C3', 6, 23], ['C4', 6, 19], ['C5', 6, 15], ['C6', 6, 11]], disc: 'H', run: [[6, 31, 16, 38, 0], [6, 15, 10, 9, 0], [10, 9, 16, 22, 0], [6, 11, 20, 4, 0]], opt: [[6, 27, 9, 34, 0], [6, 23, 11, 32, 0], [6, 19, 13, 30, 0]], throw: [[6, 40, 15.5, 38.5, 1]], note: [['1', 12, 41], ['3', 21, 8]] } },
  // ---- Wall zone (1-3-3) and hybrids
  'wz-middle': { cap: '1-3-3 wall in the middle of the field: the chase forces towards the nearer sideline, the three-player wall stands a few metres off the disc to block upfield throws, two mids patrol behind the wall, and the deep stays just behind the deepest attacker.',
    dia: { view: [0, 2, 37, 46], o: [['H', 18, 38], ['H2', 9, 39], ['H3', 27, 39], ['A', 9, 22], ['B', 18, 20], ['C', 27, 22], ['E', 18, 9]], d: [['CH', 16.5, 36], ['W', 14.5, 32], ['W', 18, 31.5], ['W', 21.5, 32], ['M', 11, 25], ['M', 25, 25], ['DP', 18, 5]], disc: 'H', note: [['wall', 26, 31], ['mids', 4, 26], ['deep', 23, 4]] } },
  'wz-trap': { cap: 'Sideline trap: the chase moves round the back to stop the swing off the line, the wall angles in to block throws back to the middle, the near mid takes the up-line throw past the wall, the far mid drifts in, and the deep watches for the long shot down the line.',
    dia: { view: [0, 2, 37, 46], side: 'left', o: [['H', 3, 36], ['H2', 11, 41], ['H3', 22, 38], ['A', 5, 18], ['B', 15, 20], ['C', 26, 22], ['E', 14, 7]], d: [['CH', 5.5, 37.5], ['W', 6, 31.5], ['W', 9.5, 32.5], ['W', 13, 34], ['M', 5, 23], ['M', 19, 24], ['DP', 9, 4]], disc: 'H', note: [['chase round the back', 17, 44.5]] } },
  'hy-fred': { cap: 'Fred: four handler defenders, two mids and a deep. "Fred" stands right in the open-side throwing lane; the mark forces back towards Fred; the other handler defenders close off the upfield space. Sideways and backwards passes are allowed, the next upfield throw is not.',
    dia: { view: [0, 2, 37, 46], o: [['H', 18, 38], ['H2', 9, 39], ['H3', 27, 39], ['A', 9, 22], ['B', 18, 20], ['C', 27, 22], ['E', 18, 9]], d: [['M', 19.5, 36], ['F', 15, 31], ['', 9, 35], ['', 25, 34], ['', 11, 25], ['', 25, 25], ['DP', 18, 5]], disc: 'H', note: [['Fred', 15, 27.5], ['force back to Fred', 25, 44]] } },
};

// Curated entry points into the drill library, and ready-made session plans.
// Everything here only points at drills that already exist in the library;
// edit the id lists to change them. Template timings are left blank on
// purpose: coaches fill them in for their own group.

const COLLECTIONS = [
  { id: 'first-session', title: 'First session', blurb: 'For complete beginners: games, a first throw, catching on the run and a small-sided game.',
    ids: ['foxes-and-hounds', 'throwing-in-pairs', '100-throws', 'pass-and-move', 'lead-passes', 'cutting-shapes', 'give-go-continuation', 'mini'] },
  { id: 'warm-ups', title: 'Warm-ups', blurb: 'Drills that get everyone moving, throwing and catching before training or a game.',
    ids: ['shallow-deep-vs', 'throwing-progression-4-lines', 'x-drill', 'box-drill', 'speed-flow', 'frisbee-tag', 'endzone-7v7-warmup'] },
  { id: 'breaking-the-mark', title: 'Throwing and breaking the mark', blurb: 'From pairs throwing to beating an active mark with a cutter on the move.',
    ids: ['speed-flow', 'break-force', 'three-person-break-mark', 'moving-break-mark', 'go-to-line-drills', 'breakmark-slash', 'break-throwing', 'hot-seat'] },
  { id: 'handler-resets', title: 'Handlers and resets', blurb: 'Getting the disc off the sideline and keeping it moving.',
    ids: ['break-side-reset', 'oddo-reset', 'live-reset-2v2', 'sideline-trap-two-handlers', 'triangle-reset-branches', 'swing-party', 'off-the-line', 'handler-weave'] },
  { id: 'defence-block', title: 'Person defence', blurb: 'Footwork and positioning first, then live one-on-one reps and team switching.',
    ids: ['positioning-triangle', 'hip-turn-cones', 'triangle-cone-chase', 'open-side-unders', 'defensive-positioning', 'gauntlet', 'five-rep-downfield-d', 'bracket-back-of-stack'] },
  { id: 'zone-week', title: 'Zone week', blurb: 'Cup basics, small-sided zone games, then attacking and defending a full zone.',
    ids: ['d-circle', 'four-corner-cup', 'cup-movement', 'swinging-vs-zone', 'zone-tube-4v3', 'zone-popper-options', 'zone-flood-weak-side', 'junk-zone-roles', 'scores-for-turns'] },
  { id: 'hex', title: 'Hex offence', blurb: 'The season-plan Hex block, from 2v2 principles to full possession games.',
    ids: ['hex-progression', 'hex-mex-puzzle', 'hex-keepdisc', 'hex-mex-huck', 'give-go-swill'] },
  { id: 'endzone', title: 'End zone', blurb: 'Dump-swing patterns, set plays and goal-line games.',
    ids: ['mushroom', 'seattle', 'flood-side-stack', 'reverse-zipper', 'the-play-reset-strike', 'system-endzone', 'goal-line-baseball', 'double-score'] },
  { id: 'small-numbers', title: 'Low turnout (3–6 players)', blurb: 'Good sessions when only a handful of people turn up.',
    ids: ['wipers', 'yo-yos', 'three-person-break-mark', 'lateral-vs-face-guard', 'box-possession-3v3', 'uneven-3v4', 'mini', 'bump-boom'] },
];

const TEMPLATES = [
  { id: 't-beginners', name: 'Beginners: first session', length: '60 min', ids: ['foxes-and-hounds', 'throwing-in-pairs', 'pass-and-move', 'cutting-shapes', 'mini'] },
  { id: 't-hex', name: 'Hex offence', length: '90 min', ids: ['shallow-deep-vs', 'hex-progression', 'hex-mex-puzzle', 'hex-mex-huck', 'hex-keepdisc'] },
  { id: 't-zone', name: 'Zone offence and defence', length: '90 min', ids: ['speed-flow', 'd-circle', 'four-corner-cup', 'zone-tube-4v3', 'zone-popper-options', 'scores-for-turns'] },
  { id: 't-endzone', name: 'End zone', length: '60 min', ids: ['x-drill', 'mushroom', 'seattle', 'flood-side-stack', 'goal-line-baseball'] },
  { id: 't-defence', name: 'Person defence', length: '90 min', ids: ['agility-cones', 'positioning-triangle', 'hip-turn-cones', 'gauntlet', 'five-rep-downfield-d', 'bracket-back-of-stack', 'incentivized-scrimmage'] },
  { id: 't-resets', name: 'Handler resets', length: '60 min', ids: ['three-person-break-mark', 'oddo-reset', 'live-reset-2v2', 'triangle-reset-branches', 'off-the-line'] },
  { id: 't-transition', name: 'Fast break and transition', length: '60 min', ids: ['give-go-continuation', 'fast-break-back-line', 'speed-savage', 'short-field-miti', 'fast-break-games'] },
];

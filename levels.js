// Suggested levels for drills whose source doesn't give one.
// These are Claude's judgement (Nov 2026), not the source's: coaches should
// change any they disagree with. B = Beginner, I = Intermediate, A = Advanced.
// Rough rule: B = one skill, little decision-making, works in a first season;
// I = needs reliable throws and stack basics, some reading of defence;
// A = team systems, set plays, zone/hybrid schemes or fine timing under pressure.
const SUGGESTED_LEVELS = {
  B: ['throwing-in-pairs', 'box-drill', 'lead-passes', 'wipers', 'pull-practice', 'curve-into-goal',
    'wind-throwing-pairs', 'under-cuts', 'three-player-weave', 'attack-the-under', 'away-to-open-under', 'triangle-cutting',
    'swill-reading', 'sideline-dump', 'give-and-go', 'defensive-positioning', 'open-side-unders', 'mirror-defending',
    'triangle-marking', 'buffering', 'block-everything', 'aerial-battles', 'hockey-stop', 'short-slalom',
    'quarter-turn', 'shuffle-cone-touch', 'agility-cones', 'fb-w-drill', 'fb-t-step', 'fb-speed-turn', 'fb-hip-flip',
    'fb-backpedal-weave', 'fb-four-corner', 'fb-three-cone', 'fb-t-drill', 'fb-ladder', 'mini', 'rondo', 'hot-seat',
    'race-to-100', 'humans-v-zombies', 'frisbee-tag', 'hot-box', 'mushroom', 'clear-and-in',
    'positioning-triangle', 'wind-flags', 'two-disc-catch-release', 'shallow-deep-vs', 'mta', 'consistency-markers',
    'fast-release', 'throw-and-go', 'aggressive-catching', 'throwing-progression-4-lines', 'mirror-line'],
  I: ['five-ten', 'layout-progression', 'break-throwing', 'swiss-drill', 'diagonal-lead-passes', 'x-drill', 'line-break-active-force',
    'continuations-to-huck', 'intelligent-hucking', 'break-for-continuation', 'bucket-swings', 'throwing-toolbox',
    'hucking-from-flow', 'hillman', 'upline-break-cuts', 'upline-slash-deep', 'sideline-isolation', 'timing-under-cuts',
    'peppermills-3v3', 'windmill-under', 'ho-diamonds-pistons', 'sideline-power-position', 'sideline-bounce-cut', 'sealing-the-lane',
    'handler-weave', 'inverse-give-and-go', 'break-side-reset', 'alpha-bravo', 'bail-cut', 'give-go-swill',
    'phases-horizontal', 'switching-the-field-vert', 'sideline-trap-two-handlers', 'stack-positioning-downfield',
    'handler-cutter-timing-ho', 'swinging-vs-zone', 'team-triangle-cutting', 'receive-the-pull', 'hex-progression',
    'hex-mex-puzzle', 'fast-break-back-line', 'zone-flood-weak-side', 'zone-popper-options', 'twist-drill', 'seattle',
    'orbiting-endzone-d', 'system-endzone', 'd-circle', 'choosing-a-shoulder', 'protecting-the-upline',
    'setting-a-sideline-trap', 'shutting-down-open-lane', 'deep-defending', 'picking-up-players', 'triangle-forcing',
    'positioning-as-disc-swings', 'bracket-back-of-stack', 'junk-zone-roles', 'defensive-footwork', 'hex-keepdisc',
    'fast-break-games', 'side-stack-two-set', 'zipper-under', 'zipper-away', 'flood-side-stack', 'the-play-reset-strike', 'bamf-drill', 'breakmark-slash', 'continuous-cutting',
    'endzone-7v7-warmup', 'gauntlet', 'salmon-ladder', 'double-score', 'short-field-miti', 'paused-miti', 'three-hell',
    'incentivized-scrimmage', 'franks-rules', 'speed-savage', 'team-cutting-lane-game', 'backhands-only', 'space-disc',
    'unfair-scrimmage', 'scores-for-turns', 'bullies-scrimmage', 'oddo-reset', 'box-possession-3v3',
    'live-reset-2v2', 'continuous-five-box', 'lateral-vs-face-guard', 'uneven-3v4', 'triangle-cone-chase', 'triangle-plus-live',
    'hip-turn-cones', 'five-rep-downfield-d', 'off-the-line', 'zone-tube-4v3', 'four-corner-cup', 'waterfall-stack', 'goal-line-baseball'],
  A: ['cyclone-huck', 'hex-mex-huck', 'japanese-handler-2v2', 'sideline-power-play', 'cyclone-handler-flow', 'peppermill-flow',
    'beating-poaches-side-stack', 'chevron-brick', 'reverse-zipper', 'poaching-the-lanes', 'cup-movement',
    'whole-cup-wings', 'break-containment', 'hasami-markers', 'triangle-reset-branches',
    'swing-party', 'bump-boom', 'sideline-break-scoring', 'wheel-sideline-cycle', 'triangle-of-death'],
};

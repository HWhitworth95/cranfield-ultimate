// Fitness section pages, built from:
//  - "GBJO March/April Fitness Plan" (Daily Bassline + Tiger / Grizzly / Raptor)
//  - "Workouts for Lecco" (12-week track programme, shuttle drills, gym sessions)
// Each page: { slug, title, section, html }. YouTube links are plain links
// because the hosting frame cannot embed other sites.

const yt = (url, label) =>
  `<a class="vid" href="${url}" target="_blank" rel="noopener">${label}</a>`;

// Shared video links used across the plans.
const V = {
  lungeMatrix: 'https://www.youtube.com/watch?v=ESYkudkZsQ8',
  situps: 'https://www.youtube.com/watch?v=EnQZpbX09_c',
  sidePlank: 'https://www.youtube.com/watch?v=aFIeCPokJFE',
  calfRaises: 'https://www.youtube.com/watch?v=4TWkdEz1IMw',
  rotatorCuff: 'https://www.youtube.com/watch?v=cGkrpIGlKJ0',
  singleLegSquat: 'https://www.youtube.com/watch?v=gXk5F-g8-ps',
  burpees: 'https://www.youtube.com/watch?v=N1yWBNgRHrc',
  hamstringRaises: 'https://www.youtube.com/watch?v=rOCK8Mhk3xY',
  backRaises: 'https://www.youtube.com/watch?v=g8yFrS-S8m0',
};

// 12-week Road to Lecco track schedule: [week, sunday (speed), wednesday (endurance)]
const LECCO_WEEKS = [
  [1, '1×800m slow, 2 shuttles', '1–3 miles (depending on current fitness)'],
  [2, '1×800m slow, 1×200m slow, 3 shuttles', '1–3 miles'],
  [3, '1×600m slow, 3 shuttles', '2–4 miles'],
  [4, '2–3 miles, rest, 1×800m slow', '1×800m slow, 1×400m slow, 2 shuttles'],
  [5, '1–2 miles, 1×800m slow, rest, 3 shuttles', '2–5 miles'],
  [6, '2×400m fast, 3 shuttles', '1 mile, 2×400m medium, 1×800m slow'],
  [7, '1×400m medium, 3×200m fast, 2 shuttles (begin scheduling starts)', '2×800m medium-fast, 2×400m medium, 1×800m slow'],
  [8, '3 shuttles, 3×400m medium', '1×800m medium, 1×400m fast, 3×200m fast'],
  [9, '2×800m medium, 3×400m medium, 2×100m medium', '3 shuttles, 3×200m fast, 1×400m slow-medium, 2×200m fast'],
  [10, '5 shuttles, 3×100m fast, 1×200m fast, 3×50m fast', '2 fartleks, 4×200m fast, 4×100m fast'],
  [11, '5 shuttles, 4×100m fast, 10×50m fast', '2×200m fast, 4 fartleks'],
  [12, '2 shuttles, 10×50m fast, 3 shuttles, 4×100m fast', '6 fartleks'],
];

const leccoTable = () => `
<div class="table-wrap"><table class="plan" data-track="lecco">
  <thead><tr><th>Week</th><th>Sunday <span class="muted">(speed)</span></th><th>Wednesday <span class="muted">(endurance)</span></th></tr></thead>
  <tbody>
  ${LECCO_WEEKS.map(([w, sun, wed]) => `
    <tr class="phase-${w <= 5 ? 'base' : w <= 9 ? 'build' : 'sharpen'}">
      <td><strong>${w}</strong></td><td>${sun}</td><td>${wed}</td>
    </tr>`).join('')}
  </tbody>
</table></div>
<p class="legend"><span class="sw base"></span>Weeks 1–5: base &nbsp; <span class="sw build"></span>Weeks 6–9: build &nbsp; <span class="sw sharpen"></span>Weeks 10–12: speed</p>`;

const FITNESS_PAGES = [
  {
    slug: 'fitness',
    title: 'Fitness',
    section: 'Fitness',
    html: `
<p class="lede">Everything you need to be fit enough to play your best ultimate, in one place. Pick the plan that matches where you are in the season, and stick it on your wall.</p>
<div class="cards">
  <a class="card" href="#fitness-bassline"><h3>Daily Bassline</h3><p>15 minutes, every day. The foundation everything else sits on.</p></a>
  <a class="card" href="#fitness-weekly"><h3>Tiger, Grizzly &amp; Raptor</h3><p>Three ~40-minute sessions a week: shuttles, strength and plyometrics.</p></a>
  <a class="card" href="#fitness-lecco-track"><h3>Road to Lecco: Track</h3><p>A 12-week, two-sessions-a-week track programme building from base to speed.</p></a>
  <a class="card" href="#fitness-shuttles"><h3>Shuttle Drills</h3><p>The five cone drills used throughout the track programme.</p></a>
  <a class="card" href="#fitness-gym"><h3>Gym Sessions</h3><p>Legs, core, chest/triceps, back/biceps and shoulders.</p></a>
  <a class="card" href="#fitness-26-weeks"><h3>26 Weeks of Hell</h3><p>The long-form strength, core and plyo plan with tutorial videos.</p></a>
</div>
<h2>How the plans fit together</h2>
<table class="simple">
  <tr><th>Every day</th><td>Daily Bassline (15 min)</td></tr>
  <tr><th>Each week</th><td>Tiger, Grizzly and Raptor once each, spread out, not on three days in a row</td></tr>
  <tr><th>Tournament block</th><td>Road to Lecco track sessions (Sun + Wed) plus 1–2 gym sessions</td></tr>
  <tr><th>Every session</th><td>Do the <a href="#warmup">warm-up</a> first and the warm-down stretches after</td></tr>
</table>
<div class="callout warn"><strong>Safety first.</strong> If anything feels weird, too much or painful, stop and speak to a captain. Don't add extra reps at the end of a session because you feel good. Make changes to a plan in advance, not mid-workout. Stretching matters for injury prevention <em>and</em> speed, so do the warm-down stretches in front of the TV.</div>`,
  },
  {
    slug: 'fitness-bassline',
    title: 'Daily Bassline',
    section: 'Fitness',
    html: `
<p class="lede">How do you make something good? Stick a big, dirty bassline on it.</p>
<p>The bassline is the daily routine that lets us manage everything else. It should take about <strong>15 minutes a day</strong>. Feel free to add a little more if you're feeling good, but be careful not to overdo it.</p>
<ol class="checklist" data-track="bassline">
  <li><label><input type="checkbox" data-tick="bl-1"> 10 press-ups</label></li>
  <li><label><input type="checkbox" data-tick="bl-2"> 20 sit-ups</label></li>
  <li><label><input type="checkbox" data-tick="bl-3"> 20 squats</label></li>
  <li><label><input type="checkbox" data-tick="bl-4"> 10 single-leg squats on each leg</label></li>
  <li><label><input type="checkbox" data-tick="bl-5"> 10 calf raises on each leg (on a stair)</label></li>
  <li><label><input type="checkbox" data-tick="bl-6"> 10 tricep dips</label></li>
  <li><label><input type="checkbox" data-tick="bl-7"> 20 hamstring raises</label> ${yt(V.hamstringRaises, 'video')}</li>
  <li><label><input type="checkbox" data-tick="bl-8"> 20 back raises</label> ${yt(V.backRaises, 'video')}</li>
  <li><label><input type="checkbox" data-tick="bl-9"> Lunge matrix on each leg</label> ${yt(V.lungeMatrix, 'video')}</li>
</ol>
<p><button class="btn" data-reset="bassline">Reset today's ticks</button></p>`,
  },
  {
    slug: 'fitness-weekly',
    title: 'Tiger, Grizzly & Raptor',
    section: 'Fitness',
    html: `
<p class="lede">On top of the Daily Bassline, training and tour, do <strong>each of these three workouts once a week</strong>. Each should take about 40 minutes.</p>
<p>They shouldn't wipe you out completely, but plan each week (or fortnight) in advance so you don't squeeze them into three consecutive days. These may be adjusted if they turn out too easy or too hard.</p>

<section class="workout tiger">
<h2>Tiger Smash! <span class="tag">Shuttles</span></h2>
<p>Place 4 cones 10 m apart and number them 0, 1, 2, 3. Every sprint starts and finishes at cone 0.</p>
<p class="muted">Example: <strong>1-2-3</strong> = start at 0, sprint to 1, turn, back to 0, turn, sprint to 2, back to 0, sprint to 3, back to 0.</p>
<table class="simple">
  <tr><th>Run</th><th>Then</th></tr>
  <tr><td>1-2-3</td><td>45 s rest</td></tr>
  <tr><td>1-2-3-2-1</td><td>45 s rest</td></tr>
  <tr><td>3-3-3</td><td>45 s rest</td></tr>
  <tr><td>1-2-1-2-1</td><td>45 s rest</td></tr>
  <tr><td>3-2-1</td><td>4 min recovery</td></tr>
</table>
<p><strong>Repeat the whole block 4 times in total.</strong></p>
</section>

<section class="workout grizzly">
<h2>Grizzly Attack! <span class="tag">Strength</span></h2>
<ul>
  <li>15 crossed-leg sit-ups ${yt(V.situps, 'video')}</li>
  <li>1 min side plank on each side ${yt(V.sidePlank, 'video')}</li>
  <li>Lunge matrix on each leg ${yt(V.lungeMatrix, 'video')}</li>
  <li>2×10 calf raises on each leg ${yt(V.calfRaises, 'video')}</li>
  <li>10 squat jumps</li>
  <li>2×10 single-leg hops on the spot (keep the landing soft)</li>
  <li>2×40 m sprints starting on your chest</li>
  <li>2×20 m bounding</li>
  <li>2×20 m power skips</li>
  <li>2×5 rotator cuff on each side ${yt(V.rotatorCuff, 'video')}</li>
</ul>
<p><strong>Repeat once (2 rounds in total).</strong></p>
</section>

<section class="workout raptor">
<h2>Raptor Plyo! <span class="tag">Assault</span></h2>
<p>Set out 4 cones 10 m apart (0–3). Plyos are done over 10 m only.</p>
<h3>Plyometrics</h3>
<ul>
  <li>1× double-leg jumps forwards</li>
  <li>1× double-leg jumps sideways</li>
  <li>1× double-leg jumps to the other side</li>
  <li>1× double-leg jumps backwards</li>
  <li>1× single-leg jumps forwards (each leg)</li>
</ul>
<h3>Core / sprint ladder</h3>
<ol>
  <li>Sprint 0→1. 6 jumping lunges. Sprint back to 0.</li>
  <li>Sprint 0→1. 6 jumping lunges. Sprint 1→2. 5 single-leg squats each leg ${yt(V.singleLegSquat, 'video')}. Sprint back to 0.</li>
  <li>Sprint 0→1. 6 jumping lunges. Sprint 1→2. 5 single-leg squats each leg. Sprint 2→3. 5 burpees ${yt(V.burpees, 'video')}. Sprint back to 0.</li>
</ol>
<p><strong>Then do the whole Raptor twice more (3 rounds in total).</strong></p>
</section>
`,
  },
  {
    slug: 'fitness-lecco-track',
    title: 'Road to Lecco: Track Programme',
    section: 'Fitness',
    html: `
<p class="lede">A 3-month track programme with <strong>two workouts a week</strong>: Sunday focuses on speed and quickness, Wednesday on endurance.</p>
<p>The days are only suggestions, chosen so you can fit in the rest of your training and recover before a similar session. On tournament weekends, either drop the Sunday session or move it within the week.</p>
<p>The programme starts with longer distances to build a solid base, then moves to shorter distances and speed work towards the end of the three months. The volume is deliberately quite low.</p>
${leccoTable()}
<p class="muted"><strong>Shuttles</strong>: any of the <a href="#fitness-shuttles">shuttle drills</a>; one "shuttle" = the full set of reps for that drill. <strong>Fartleks</strong>: continuous runs with unstructured changes of pace.</p>
<div class="callout warn"><strong>Don't sprint everything.</strong> Running every rep flat-out is how hamstrings get strained and torn. Hit the paces as written (slow / medium / fast). If you feel good at the end, resist adding another rep: it may have been meant as a recovery day. If the sessions aren't pushing you, change them in advance, not mid-workout.</div>`,
  },
  {
    slug: 'fitness-shuttles',
    title: 'Shuttle Drills',
    section: 'Fitness',
    html: `
<p class="lede">These are the "shuttles" in the <a href="#fitness-lecco-track">track programme</a>. Mix them up for variety: one shuttle on the schedule equals the number of reps listed for that drill.</p>
<div class="drill-grid">
  <div class="drill"><h3>20-yard shuttle</h3><p class="meta">5 reps · quickness &amp; cutting</p>
    <p>3 cones in a line, 10 yards apart. Start at the centre cone, sprint to a side cone, stop, cut back to the other side cone, stop, cut back to the centre.</p>
    <p class="muted">Variations: carioca, backpedal, shuffle.</p></div>
  <div class="drill"><h3>Zig-zag</h3><p class="meta">3 reps · cutting</p>
    <p>Two lines of cones about 5 yards apart, a cone every 5 yards for 25 yards, set for 90° cuts. Zig-zag between them.</p></div>
  <div class="drill"><h3>90 degree</h3><p class="meta">3 reps each side · cutting</p>
    <p>A lane ~1 yard wide for 10 yards that turns left or right for another 10. Build speed and cut while staying inside the cones.</p></div>
  <div class="drill"><h3>Stop sign</h3><p class="meta">5 reps · deceleration</p>
    <p>Start cones, then a finish line 15–20 yards away. Add cone pairs 2, 3 and 4 yards past the finish. Build speed, then stop as soon as you cross the line; the extra cones measure your stopping distance.</p></div>
  <div class="drill"><h3>Box runs</h3><p class="meta">5 reps · acceleration, lateral movement, hip rotation</p>
    <p>A 10-yard square. Sprint the first side, shuffle (or carioca) the second, backpedal the third, then turn and sprint out past the start cone.</p>
    <p class="muted">Variation: diagonal box run.</p></div>
</div>
<p>Rest fully between reps. Quality over quantity.</p>`,
  },
  {
    slug: 'fitness-gym',
    title: 'Gym Sessions',
    section: 'Fitness',
    html: `
<p class="lede">Gym work to complement track and pitch sessions. Pick 1–2 blocks per session; legs and core matter most for ultimate.</p>
<div class="callout"><strong>Technique before load.</strong> Power cleans in particular: if your technique isn't right you can injure yourself before a tournament. Get coached first. If you feel pain or discomfort, stop and rest. Training as a group helps keep everyone consistent.</div>
<div class="gym-grid">
  <div class="gym"><h3>Legs</h3><ul>
    <li>Single-leg calf raises: 3×15 each leg (+30 kg)</li>
    <li>Single-leg step-ups: 3×15 each leg (+30 kg)</li>
    <li>Forward hops over obstacle: 15 each leg</li>
    <li>Sideways hops over obstacle: 15 each leg</li>
    <li>Power cleans: 3×8–10</li>
    <li>Split squat: 3×10 (add 5 kg each hand if too easy)</li>
    <li>Skipping: 10 minutes</li></ul></div>
  <div class="gym"><h3>Core</h3><ul>
    <li>Side plank: 3×45 s each side</li>
    <li>Russian twist: 3×20</li>
    <li>V-ups: 3×10</li>
    <li>Plank: 3×10</li>
    <li>Reverse curl and extension: 3×10</li>
    <li>Knee tucks: 3×10</li>
    <li>Oblique knees to the side: 3×10</li></ul></div>
  <div class="gym"><h3>Chest &amp; Triceps</h3><ul>
    <li>Bench press: 3×10</li>
    <li>Decline bench press: 3×10</li>
    <li>Incline chest fly: 3×10</li>
    <li>Tricep extension: 3×10</li>
    <li>French rope press: 3×10</li></ul></div>
  <div class="gym"><h3>Back &amp; Biceps</h3><ul>
    <li>Lat pulldown: 3×10</li>
    <li>One-arm cable row: 3×10</li>
    <li>Upright row: 3×10</li>
    <li>Deadlift: 3×10</li>
    <li>Dumbbell bicep curl: 3×10</li>
    <li>Reverse bicep curl: 3×10</li>
    <li>Hyperextension twist: 3×10</li></ul></div>
  <div class="gym"><h3>Shoulders</h3><ul>
    <li>Military press: 3×10</li>
    <li>Front raise: 3×10</li>
    <li>Rotator cuff: 3×10 ${yt(V.rotatorCuff, 'video')}</li>
    <li>Reverse cable fly: 3×10</li></ul></div>
</div>`,
  },
];

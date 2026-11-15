// The living contour map behind the dark bands of the portfolio.
//
// A height field (a few slowly drifting hills, a tilt and a low swell) is sampled on a grid and its
// contour lines are traced with marching squares on a 2D canvas, every frame. The whole field sinks at a
// steady rate, so every line travels down its slope and new rings are born at the summits: the terrain
// reads as alive without anything jumping. The pointer (or a finger) is a hill of its own, so the lines
// bend around it; a press sends one ring of swell outward. Each band has its own landform, and when a
// band first comes on screen its relief rises and the lines sweep out before they settle.
//
// Cost: plain arithmetic and one stroke call per line weight. It runs only while its band is on screen
// and the tab is visible, coarsens its grid if a frame takes too long, and stops on a still drawing if
// the device still cannot keep up. It is never started under prefers-reduced-motion (the page keeps the
// static contour drawing there).

const STEP = 0.085; // height between two contour lines

// x, y: centre as a fraction of the band; r: reach, in units of 0.6 * sqrt(width * height);
// h: height (negative is a hollow); ax, ay, sp, ph: the slow drift of the centre.
const PRESETS = {
  // a massif standing beside the soil photograph, a spur at the lower left, a hollow off the corner
  massif: {
    tilt: [0.22, -0.12], swell: 0.17, flow: 0.03,
    hills: [
      { x: 0.74, y: 0.42, r: 0.46, h: 1.05, ax: 0.025, ay: 0.03, sp: 0.11, ph: 0 },
      { x: 0.24, y: 0.92, r: 0.34, h: 0.5, ax: 0.04, ay: 0.02, sp: 0.08, ph: 1.7 },
      { x: 1.0, y: 1.0, r: 0.3, h: -0.45, ax: 0.02, ay: 0.03, sp: 0.1, ph: 3.1 },
    ],
    tall: [
      { x: 0.56, y: 0.5, r: 0.5, h: 1.05, ax: 0.05, ay: 0.02, sp: 0.11, ph: 0 },
      { x: 0.1, y: 0.14, r: 0.36, h: 0.45, ax: 0.05, ay: 0.02, sp: 0.08, ph: 1.7 },
      { x: 0.95, y: 0.95, r: 0.34, h: -0.45, ax: 0.04, ay: 0.02, sp: 0.1, ph: 3.1 },
    ],
  },
  // terraces: a long slope, so the lines run across the band like strata, with one knoll and one gully
  terraces: {
    tilt: [0.2, 2.6], swell: 0.22, flow: 0.026,
    hills: [
      { x: 0.2, y: 0.3, r: 0.36, h: 0.34, ax: 0.05, ay: 0.03, sp: 0.09, ph: 0.6 },
      { x: 0.8, y: 0.66, r: 0.4, h: -0.38, ax: 0.04, ay: 0.03, sp: 0.07, ph: 2.4 },
    ],
  },
  // a basin with an island in it: the lines travel inward
  basin: {
    tilt: [-0.16, 0.1], swell: 0.16, flow: -0.028,
    hills: [
      { x: 0.8, y: 0.46, r: 0.44, h: -1.0, ax: 0.02, ay: 0.03, sp: 0.1, ph: 0.9 },
      { x: 0.84, y: 0.44, r: 0.12, h: 0.42, ax: 0.03, ay: 0.02, sp: 0.16, ph: 0 },
      { x: 0.12, y: 0.08, r: 0.34, h: 0.42, ax: 0.03, ay: 0.03, sp: 0.08, ph: 2.2 },
    ],
    tall: [
      { x: 0.6, y: 0.72, r: 0.48, h: -1.0, ax: 0.04, ay: 0.02, sp: 0.1, ph: 0.9 },
      { x: 0.66, y: 0.7, r: 0.13, h: 0.42, ax: 0.04, ay: 0.02, sp: 0.16, ph: 0 },
      { x: 0.1, y: 0.06, r: 0.36, h: 0.42, ax: 0.04, ay: 0.02, sp: 0.08, ph: 2.2 },
    ],
  },
};

export function startContours(canvas, tag, opts = {}) {
  const host = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  if (!host || !ctx) return () => {};

  const P = PRESETS[opts.preset] || PRESETS.massif;
  const lineColor = `rgba(244, 241, 232, ${opts.alpha ?? 0.13})`;
  const indexColor = `rgba(201, 182, 122, ${opts.indexAlpha ?? 0.3})`;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reach = fine ? 150 : 105; // the pointer's hill, in px
  const reachInv = 1 / (reach * reach);

  let w = 0, h = 0, dpr = 1, cell = fine ? 11 : 12, cols = 0, rows = 0, field = new Float32Array(0), unit = 1;
  let list = P.hills;
  const hills = [];
  let raf = 0, visible = false, running = false, last = 0, age = 0, time = 0, offset = 0;
  let ema = 0, frames = 0, tier = 0, frozen = false, shown = false, elev = null;
  const ptr = { x: 0, y: 0, tx: 0, ty: 0, k: 0, tk: 0, live: false, over: false };
  const rings = [];

  const resize = () => {
    w = host.clientWidth; h = host.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(3.2e6 / (w * h)));
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    cols = Math.ceil(w / cell) + 1; rows = Math.ceil(h / cell) + 1;
    field = new Float32Array(cols * rows);
    unit = 0.6 * Math.sqrt(w * h);
    list = h > w * 1.15 && P.tall ? P.tall : P.hills;
  };

  // the land at a point; bump adds what the pointer and the rings push up
  const land = (x, y, bump) => {
    let v = P.tilt[0] * (x / w) + P.tilt[1] * (y / h);
    for (let n = 0; n < hills.length; n++) {
      const H = hills[n], dx = x - H.x, dy = y - H.y;
      v += H.h * Math.exp(-(dx * dx + dy * dy) * H.inv);
    }
    v += P.swell * Math.sin(x * 0.0105 + y * 0.006 + time * 0.19) * Math.cos(y * 0.0118 - x * 0.0045 - time * 0.15);
    if (!bump) return v;
    if (ptr.k > 0.002) {
      const dx = x - ptr.x, dy = y - ptr.y;
      v += ptr.k * Math.exp(-(dx * dx + dy * dy) * reachInv);
    }
    for (let n = 0; n < rings.length; n++) {
      const R = rings[n], q = (Math.hypot(x - R.x, y - R.y) - R.front) / 64;
      if (q > -3 && q < 3) v += R.a * Math.exp(-q * q) * Math.sin(q * 2.4);
    }
    return v;
  };

  // rows j0 to j1 only: the part of the band that is on screen
  const draw = (j0, j1) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, j0 * cell, w, (j1 - j0) * cell);
    const thin = new Path2D(), index = new Path2D();
    for (let j = j0; j < j1; j++) {
      const y0 = j * cell, y1 = y0 + cell;
      for (let i = 0; i < cols - 1; i++) {
        const at = j * cols + i;
        const a = field[at], b = field[at + 1], d = field[at + cols], c = field[at + cols + 1];
        const lo = Math.min(a, b, c, d), hi = Math.max(a, b, c, d);
        const k1 = Math.floor(hi / STEP);
        let k = Math.ceil(lo / STEP);
        if (k > k1) continue;
        const x0 = i * cell, x1 = x0 + cell;
        for (; k <= k1; k++) {
          const L = k * STEP;
          const code = (a > L ? 1 : 0) | (b > L ? 2 : 0) | (c > L ? 4 : 0) | (d > L ? 8 : 0);
          if (code === 0 || code === 15) continue;
          const path = k % 5 === 0 ? index : thin;
          // where the line crosses each side of the cell (only the sides this case uses are read)
          const tx = x0 + cell * (L - a) / (b - a);
          const ry = y0 + cell * (L - b) / (c - b);
          const bx = x0 + cell * (L - d) / (c - d);
          const ly = y0 + cell * (L - a) / (d - a);
          switch (code) {
            case 1: case 14: path.moveTo(x0, ly); path.lineTo(tx, y0); break;
            case 2: case 13: path.moveTo(tx, y0); path.lineTo(x1, ry); break;
            case 3: case 12: path.moveTo(x0, ly); path.lineTo(x1, ry); break;
            case 4: case 11: path.moveTo(x1, ry); path.lineTo(bx, y1); break;
            case 6: case 9: path.moveTo(tx, y0); path.lineTo(bx, y1); break;
            case 7: case 8: path.moveTo(x0, ly); path.lineTo(bx, y1); break;
            case 5: path.moveTo(x0, ly); path.lineTo(tx, y0); path.moveTo(x1, ry); path.lineTo(bx, y1); break;
            default: path.moveTo(tx, y0); path.lineTo(x1, ry); path.moveTo(x0, ly); path.lineTo(bx, y1); // 10
          }
        }
      }
    }
    ctx.lineWidth = 1; ctx.strokeStyle = lineColor; ctx.stroke(thin);
    ctx.lineWidth = 1.3; ctx.strokeStyle = indexColor; ctx.stroke(index);
  };

  const step = (now, whole = false) => {
    const started = performance.now();
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now; age += dt; time += dt;

    // the relief rises and the lines sweep out when the band is first seen, then settle to a slow drift
    const rise = 1 - Math.pow(1 - Math.min(1, age / 2.6), 3);
    const amp = 0.28 + 0.72 * rise;
    offset += dt * P.flow * (1 + 10 * Math.exp(-age * 1.4));

    hills.length = 0;
    for (const H of list) {
      const r = H.r * unit;
      hills.push({
        x: (H.x + H.ax * Math.sin(time * H.sp + H.ph)) * w,
        y: (H.y + H.ay * Math.cos(time * H.sp * 0.8 + H.ph)) * h,
        inv: 1 / (r * r), h: H.h * amp,
      });
    }
    const follow = 1 - Math.exp(-dt * 10);
    ptr.x += (ptr.tx - ptr.x) * follow; ptr.y += (ptr.ty - ptr.y) * follow;
    ptr.k += (ptr.tk - ptr.k) * (1 - Math.exp(-dt * 5));
    for (let n = rings.length - 1; n >= 0; n--) {
      const R = rings[n], lived = time - R.born;
      if (lived > 3.2) { rings.splice(n, 1); continue; }
      R.front = lived * 360; R.a = 0.22 * Math.exp(-lived * 1.2);
    }

    // only the rows inside the window are worked out and drawn (all of them for a still drawing)
    let j0 = 0, j1 = rows - 1;
    if (!whole) {
      const top = -host.getBoundingClientRect().top;
      j0 = Math.max(0, Math.floor(top / cell) - 1);
      j1 = Math.min(rows - 1, Math.ceil((top + window.innerHeight) / cell) + 1);
    }
    if (j1 > j0) {
      for (let j = j0; j <= j1; j++) {
        const y = j * cell;
        for (let i = 0, at = j * cols; i < cols; i++, at++) field[at] = land(i * cell, y, true) - offset;
      }
      draw(j0, j1);
    }

    if (tag) {
      const on = fine && ptr.live && !ptr.over;
      tag.classList.toggle('is-on', on);
      if (on) {
        tag.style.transform = `translate3d(${(ptr.x + 18).toFixed(1)}px, ${(ptr.y + 20).toFixed(1)}px, 0)`;
        const now_ = Math.round(640 + land(ptr.x, ptr.y, false) * 310);
        if (now_ !== elev) { elev = now_; tag.textContent = `▲ ${elev} m`; }
      }
    }
    if (!shown) { shown = true; host.setAttribute('data-topo', 'live'); }

    // keep to the frame budget: a coarser grid first, then a still drawing
    const cost = performance.now() - started;
    ema = ema ? ema * 0.9 + cost * 0.1 : cost;
    if (++frames > 45 && ema > 9) {
      if (tier < 2) { tier++; cell = Math.round(cell * 1.4); resize(); frames = 0; ema = 0; }
      else if (ema > 16) { frozen = true; host.setAttribute('data-topo', 'still'); step(now, true); }
    }
  };

  const loop = now => {
    raf = 0;
    if (!running) return;
    step(now);
    if (!frozen) raf = requestAnimationFrame(loop);
  };
  const sync = () => {
    const want = visible && !document.hidden && !frozen && w > 0;
    if (want && !running) { running = true; last = 0; raf = requestAnimationFrame(loop); }
    else if (!want && running) { running = false; cancelAnimationFrame(raf); raf = 0; }
  };

  const place = event => {
    const r = host.getBoundingClientRect();
    return [event.clientX - r.left, event.clientY - r.top];
  };
  const move = event => {
    const [x, y] = place(event);
    if (!ptr.live) { ptr.x = x; ptr.y = y; }
    ptr.tx = x; ptr.ty = y; ptr.live = true; ptr.tk = 0.55;
    ptr.over = !!(event.target instanceof Element && event.target.closest('a, button'));
  };
  const rest = () => { ptr.live = false; ptr.tk = 0; };
  const down = event => {
    move(event);
    rings.push({ x: ptr.tx, y: ptr.ty, born: time, front: 0, a: 0.22 });
    if (rings.length > 4) rings.shift();
  };
  const up = event => { if (event.pointerType !== 'mouse') rest(); };

  host.addEventListener('pointermove', move, { passive: true });
  host.addEventListener('pointerdown', down, { passive: true });
  host.addEventListener('pointerup', up, { passive: true });
  host.addEventListener('pointerleave', rest);
  host.addEventListener('pointercancel', rest);

  const io = new IntersectionObserver(entries => { visible = entries[entries.length - 1].isIntersecting; sync(); });
  io.observe(host);
  const ro = new ResizeObserver(() => { resize(); if (frozen && w) step(performance.now(), true); sync(); });
  ro.observe(host);
  const vis = () => sync();
  document.addEventListener('visibilitychange', vis);
  resize();

  return () => {
    running = false; cancelAnimationFrame(raf);
    io.disconnect(); ro.disconnect();
    document.removeEventListener('visibilitychange', vis);
    host.removeEventListener('pointermove', move);
    host.removeEventListener('pointerdown', down);
    host.removeEventListener('pointerup', up);
    host.removeEventListener('pointerleave', rest);
    host.removeEventListener('pointercancel', rest);
    host.removeAttribute('data-topo');
  };
}

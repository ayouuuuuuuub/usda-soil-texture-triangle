// Photographs that behave like the surface of water.
//
// Wherever the pointer (or a finger) moves across a photograph marked data-liquid, the picture is pushed
// along the pointer's path with a wet shine, and a press drops a ring into it; the ripple spreads and
// dies out within a second or two, back to the plain picture. The technique is the flow-map ripple of
// the "liquid-hover" moment in the taste skill's kit, reworked so that one WebGL context is shared by
// every photograph on the page: the canvas is laid over whichever photograph is being touched and is
// taken away again as soon as its ripple is spent, so at rest the page is plain <img> elements.
//
// Never started under prefers-reduced-motion; without WebGL, or if a shader fails, photographs stay as
// they are.

const VERT = 'attribute vec2 a_pos; varying vec2 v_uv; void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }';
// the flow map: a 2-channel vector field stored around 0.5 in 8 bits; each step it diffuses, decays,
// drains a small dead zone (so an 8-bit residue never freezes a warp in the picture) and takes the
// pointer's velocity under a gaussian brush, plus an outward ring when the picture is pressed
const FLOW = `precision mediump float; varying vec2 v_uv;
uniform sampler2D u_prev; uniform vec2 u_pointer; uniform vec2 u_vel; uniform float u_drop; uniform float u_decay; uniform float u_drain; uniform float u_radius; uniform vec2 u_texel; uniform float u_aspect;
void main() {
  vec4 c = texture2D(u_prev, v_uv);
  vec4 n = texture2D(u_prev, v_uv + vec2(u_texel.x, 0.0)) + texture2D(u_prev, v_uv - vec2(u_texel.x, 0.0)) + texture2D(u_prev, v_uv + vec2(0.0, u_texel.y)) + texture2D(u_prev, v_uv - vec2(0.0, u_texel.y));
  vec2 enc = mix(c.xy, n.xy * 0.25, 0.42);
  vec2 fl = (enc - 0.5) * 2.0 * u_decay;
  fl = sign(fl) * max(abs(fl) - vec2(u_drain), vec2(0.0));
  vec2 d = (v_uv - u_pointer) * vec2(u_aspect, 1.0);
  float g = exp(-dot(d, d) / (u_radius * u_radius));
  fl += u_vel * g;
  fl += normalize(d + vec2(0.00001)) * u_drop * g * (1.0 - g) * 4.0;
  fl = clamp(fl, -1.0, 1.0);
  gl_FragColor = vec4(fl * 0.5 + 0.5, 0.0, 1.0);
}`;
// the picture, displaced by the flow, with a hair of colour split along the push and a wet shine
const DRAW = `precision mediump float; varying vec2 v_uv;
uniform sampler2D u_img; uniform sampler2D u_flow; uniform vec2 u_cover; uniform float u_amp; uniform vec2 u_ftex;
vec2 flow(vec2 p) { vec2 f = (texture2D(u_flow, p).xy - 0.5) * 2.0; return sign(f) * max(abs(f) - vec2(1.5 / 255.0), vec2(0.0)); }
void main() {
  vec2 fl = flow(v_uv);
  float m = length(fl);
  float sx = length(flow(v_uv + vec2(u_ftex.x, 0.0))) - length(flow(v_uv - vec2(u_ftex.x, 0.0)));
  float sy = length(flow(v_uv + vec2(0.0, u_ftex.y))) - length(flow(v_uv - vec2(0.0, u_ftex.y)));
  float shine = clamp((sy - sx) * 2.5, -0.12, 0.28);
  vec2 uv = (v_uv - 0.5) * u_cover + 0.5;
  vec2 o = fl * u_amp;
  vec3 col;
  col.r = texture2D(u_img, uv - o * 1.01).r;
  col.g = texture2D(u_img, uv - o).g;
  col.b = texture2D(u_img, uv - o * 0.99).b;
  col += shine + smoothstep(0.03, 0.5, m) * 0.06;
  gl_FragColor = vec4(col, 1.0);
}`;
const FS = 128;      // the flow map's side
const AMP = 0.11;    // how far the picture is pushed
const RADIUS = 0.15; // the brush
const DECAY = 0.985; // per 16.7 ms of wall time: a ripple lives a second or two

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function mountLiquid(root) {
  let canvas = null, gl = null, progFlow = null, progDraw = null, tex = null, fbo = [];
  let host = null, img = null, raf = 0, dead = false, energy = 0, ping = 0, lastT = 0, idle = 0, drop = 0;
  const pt = { x: 0.5, y: 0.5, vx: 0, vy: 0, has: false, el: null };
  const U = {};

  const compile = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  };
  const program = (frag, names) => {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(p, 0, 'a_pos'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link');
    for (const n of names) U[n] = gl.getUniformLocation(p, n);
    return p;
  };
  const target = () => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, FS, FS, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { t, f };
  };
  const clear = () => {
    gl.clearColor(0.5, 0.5, 0, 1);
    for (const { f } of fbo) { gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.clear(gl.COLOR_BUFFER_BIT); }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  const free = () => {
    clearTimeout(idle);
    if (raf) cancelAnimationFrame(raf);
    raf = 0; energy = 0; host = null; img = null;
    if (!canvas) return;
    try { gl.getExtension('WEBGL_lose_context')?.loseContext(); } catch { /* already gone */ }
    canvas.remove(); canvas = gl = tex = null; fbo = [];
  };
  const fail = () => { free(); dead = true; };

  // one context for the whole page, made on the first touch of a photograph
  const ensure = () => {
    if (canvas) return true;
    if (dead) return false;
    canvas = document.createElement('canvas');
    canvas.className = 'pf-liquid';
    canvas.setAttribute('aria-hidden', 'true');
    const attrs = { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' };
    gl = canvas.getContext('webgl', attrs) || canvas.getContext('experimental-webgl', attrs);
    if (!gl) { canvas = null; dead = true; return false; }
    try {
      progFlow = program(FLOW, ['u_prev', 'u_pointer', 'u_vel', 'u_drop', 'u_decay', 'u_drain', 'u_radius', 'u_texel', 'u_aspect']);
      progDraw = program(DRAW, ['u_img', 'u_flow', 'u_cover', 'u_amp', 'u_ftex']);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      tex = gl.createTexture();
      fbo = [target(), target()];
    } catch (error) { console.warn('liquid:', error.message); fail(); return false; }
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); free(); }, { once: true });
    return true;
  };

  const size = () => {
    const w = host.clientWidth, h = host.clientHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(1.2e6 / Math.max(1, w * h)));
    canvas.width = Math.max(2, Math.round(w * scale)); canvas.height = Math.max(2, Math.round(h * scale));
  };

  // lay the canvas over this photograph and give it the photograph as its texture
  const attach = next => {
    const picture = next.querySelector('img');
    if (!picture || !picture.complete || !picture.naturalWidth || !ensure()) return false;
    try {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, picture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (gl.getError() !== gl.NO_ERROR) throw new Error('texture');
    } catch (error) { console.warn('liquid:', error.message); fail(); return false; }
    host = next; img = picture;
    picture.after(canvas);
    size(); clear();
    energy = 0; lastT = 0;
    clearTimeout(idle);
    return true;
  };
  // the ripple is spent: the plain photograph again, and the context is let go after a quiet while
  const detach = () => {
    if (canvas) canvas.remove();
    host = null; img = null; energy = 0;
    clearTimeout(idle);
    idle = setTimeout(free, 12000);
  };

  const draw = () => {
    const ca = canvas.width / canvas.height, ia = img.naturalWidth / img.naturalHeight;
    const now = performance.now(), frames = lastT ? clamp((now - lastT) / 16.67, 0.25, 6) : 1;
    lastT = now;
    const decay = Math.pow(DECAY, frames), drain = Math.min(0.04, frames / 255);
    gl.useProgram(progFlow);
    gl.viewport(0, 0, FS, FS);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[1 - ping].f);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fbo[ping].t);
    gl.uniform1i(U.u_prev, 0);
    gl.uniform2f(U.u_pointer, pt.x, pt.y);
    gl.uniform2f(U.u_vel, pt.vx, pt.vy);
    gl.uniform1f(U.u_drop, drop);
    gl.uniform1f(U.u_decay, decay);
    gl.uniform1f(U.u_drain, drain);
    gl.uniform1f(U.u_radius, RADIUS);
    gl.uniform2f(U.u_texel, 1 / FS, 1 / FS);
    gl.uniform1f(U.u_aspect, ca);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    ping = 1 - ping;
    gl.useProgram(progDraw);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, fbo[ping].t);
    gl.uniform1i(U.u_img, 0);
    gl.uniform1i(U.u_flow, 1);
    gl.uniform2f(U.u_cover, ia > ca ? ca / ia : 1, ia > ca ? 1 : ia / ca);
    gl.uniform1f(U.u_amp, AMP);
    gl.uniform2f(U.u_ftex, 1 / FS, 1 / FS);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // the strongest flow the map can still hold, so the loop stops only once the map is really empty
    energy = Math.min(1, Math.max(0, energy * decay - drain) + Math.hypot(pt.vx, pt.vy) + drop);
    pt.vx *= 0.55; pt.vy *= 0.55; drop = 0;
    if (Math.abs(pt.vx) + Math.abs(pt.vy) < 0.0005) pt.vx = pt.vy = 0; // so a spent ripple really ends the loop
  };
  const loop = () => {
    raf = 0;
    if (!gl || !host || document.hidden) return;
    draw();
    if (energy > 0) raf = requestAnimationFrame(loop);
    else detach();
  };
  const wake = () => { if (!raf && gl && host) raf = requestAnimationFrame(loop); };

  const find = event => (event.target instanceof Element ? event.target.closest('[data-liquid]') : null);
  const aim = (event, pressed) => {
    const next = find(event);
    if (!next) { pt.has = false; return; }
    const r = next.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width, y = 1 - (event.clientY - r.top) / r.height;
    if (pt.has && pt.el === next) { pt.vx = clamp(pt.vx + (x - pt.x) * 4, -1, 1); pt.vy = clamp(pt.vy + (y - pt.y) * 4, -1, 1); }
    else { pt.vx = pt.vy = 0; }
    pt.x = x; pt.y = y; pt.has = true; pt.el = next;
    if (pressed) drop = 0.9;
    // the canvas is only laid over the photograph once there is a push to show
    if (!pressed && Math.hypot(pt.vx, pt.vy) < 0.004) return;
    if (next !== host && !attach(next)) return;
    wake();
  };
  const move = event => aim(event, false);
  const down = event => aim(event, true);
  const leave = () => { pt.has = false; };
  const resized = () => { if (host && canvas) size(); };

  root.addEventListener('pointermove', move, { passive: true });
  root.addEventListener('pointerdown', down, { passive: true });
  root.addEventListener('pointerleave', leave);
  root.addEventListener('pointercancel', leave);
  window.addEventListener('resize', resized);

  return () => {
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointerleave', leave);
    root.removeEventListener('pointercancel', leave);
    window.removeEventListener('resize', resized);
    free();
  };
}

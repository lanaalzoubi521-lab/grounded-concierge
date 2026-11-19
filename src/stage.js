// Turns a 2D profile into a 3D object and lights it like a studio shot. Uses THREE (r149, global).
import { GLAZES } from './catalog.js';

const texCache = {};
function glazeTexture(key) {
  if (texCache[key]) return texCache[key];
  const g = GLAZES[key], c = document.createElement('canvas'); c.width = 1024; c.height = 1024;
  const x = c.getContext('2d');
  x.fillStyle = g.color; x.fillRect(0, 0, 1024, 1024);
  // soft tonal variation, like glaze breaking over the throwing lines
  for (let i = 0; i < 1024; i += 2) { x.fillStyle = `rgba(0,0,0,${0.008 + 0.012 * Math.sin(i * 0.05) ** 2})`; x.fillRect(0, i, 1024, 1); }
  let s = key.length * 97;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const n = Math.floor(20000 * g.speckle);
  for (let i = 0; i < n; i++) { x.fillStyle = `rgba(${r() < 0.93 ? '40,30,25' : '255,250,240'},${0.18 + r() * 0.4})`; const d = 0.4 + r() * 1.0; x.beginPath(); x.arc(r() * 1024, r() * 1024, d, 0, 7); x.fill(); }
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.wrapS = THREE.RepeatWrapping; t.anisotropy = 4;
  return (texCache[key] = t);
}

export function geometryFor(p) {
  const S = 0.1, wall = 0.55, base = 0.7;
  const pts = p.profile.map(([r, y]) => new THREE.Vector2(r * S, y * S));
  const curve = new THREE.SplineCurve(pts);
  const outer = curve.getSpacedPoints(80);
  const top = outer[outer.length - 1];
  const rim = [new THREE.Vector2(top.x - Math.min(wall * S, p.h * S * 0.12) * 0.5, top.y + 0.012)];
  const t = Math.min(wall * S, p.h * S * 0.12);
  const inner = [];
  for (let i = outer.length - 1; i >= 0; i--) {
    const a = outer[Math.max(0, i - 1)], b = outer[Math.min(outer.length - 1, i + 1)];
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    const v = new THREE.Vector2(outer[i].x - (dy / len) * t, outer[i].y + (dx / len) * t);
    if (v.y > Math.min(base * S, p.h * S * 0.25) && v.x > 0.01) inner.push(v);
  }
  const profile = [new THREE.Vector2(0, 0), ...outer, ...rim, ...inner, new THREE.Vector2(0, inner[inner.length - 1].y)];
  const geo = new THREE.LatheGeometry(profile, 128);
  geo.computeVertexNormals();
  return geo;
}

export function materialFor(p) {
  const g = GLAZES[p.glaze];
  const map = glazeTexture(p.glaze).clone(); map.needsUpdate = true;
  const R = Math.max(...p.profile.map(q => q[0])), C = 2 * Math.PI * R;
  let L = 0; for (let i = 1; i < p.profile.length; i++) L += Math.hypot(p.profile[i][0] - p.profile[i - 1][0], p.profile[i][1] - p.profile[i - 1][1]);
  map.wrapT = THREE.RepeatWrapping; map.repeat.set(Math.max(1, Math.round(C / 24)), Math.max(1, Math.round((L * 2.2) / 24)));
  return new THREE.MeshPhysicalMaterial({ map, roughness: g.rough, clearcoat: g.clear, clearcoatRoughness: 0.12, metalness: 0, sheen: 0.2 });
}

function studioEnv(renderer) {
  const pm = new THREE.PMREMGenerator(renderer);
  const sc = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.BoxGeometry(20, 12, 20), new THREE.MeshBasicMaterial({ color: 0x8e8b85, side: THREE.BackSide }));
  sc.add(room);
  const panel = (w, h, pos, rot, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide })); m.position.set(...pos); m.rotation.set(...rot); sc.add(m); };
  panel(8, 5, [-6, 3, 2], [0, Math.PI / 2.4, 0], 6);   // key softbox
  panel(5, 4, [6, 2, -1], [0, -Math.PI / 2.2, 0], 2.2); // fill
  panel(12, 2, [0, 5.9, 0], [Math.PI / 2, 0, 0], 3);    // top strip
  const env = pm.fromScene(sc, 0.04).texture; pm.dispose();
  return env;
}

function contactShadow() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d'), gr = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(20,16,12,.55)'); gr.addColorStop(0.45, 'rgba(20,16,12,.18)'); gr.addColorStop(1, 'rgba(20,16,12,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.002;
  return m;
}

export function createStage(canvas, { interactive = false, fit = 1, bg = null, shiftX = 0 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.physicallyCorrectLights = true;
  if (bg) renderer.setClearColor(bg, 1);
  const scene = new THREE.Scene(); scene.environment = studioEnv(renderer);
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-3, 5, 3); scene.add(key);
  const cam = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  const group = new THREE.Group(); scene.add(group);
  const shadow = contactShadow(); scene.add(shadow);
  let mesh = null, angle = 0.6, vel = 0, dragging = false, lastX = 0, raf = 0, auto = true, tilt = 0.32;

  function size() { const w = canvas.clientWidth || 600, h = canvas.clientHeight || 600; renderer.setSize(w, h, false); cam.aspect = w / h; if (shiftX) cam.setViewOffset(w, h, -w * shiftX * (document.documentElement.dir === 'rtl' ? -1 : 1), 0, w, h); else cam.clearViewOffset(); cam.updateProjectionMatrix(); }
  function frame(p) {
    const H = p.h * 0.1, W = Math.max(...p.profile.map(q => q[0])) * 0.2;
    const span = Math.max(H, W * 0.9) * 1.25 / fit;
    const dist = span / (2 * Math.tan((cam.fov * Math.PI) / 360));
    cam.position.set(0, H * 0.5 + dist * Math.sin(tilt), dist * Math.cos(tilt));
    cam.lookAt(0, H * 0.45, 0);
    shadow.scale.setScalar(W * 1.9);
  }
  function show(p) {
    if (mesh) { group.remove(mesh); mesh.geometry.dispose(); }
    mesh = new THREE.Mesh(geometryFor(p), materialFor(p)); group.add(mesh);
    size(); frame(p); render();
  }
  function render() { group.rotation.y = angle; renderer.render(scene, cam); }
  function loop() { if (!dragging) { angle += auto ? 0.0045 : 0; angle += vel; vel *= 0.94; } render(); raf = requestAnimationFrame(loop); }
  if (interactive) {
    canvas.style.touchAction = 'pan-y'; canvas.style.cursor = 'grab';
    canvas.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
    canvas.addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; angle += dx * 0.01; vel = dx * 0.002; });
    canvas.addEventListener('pointerup', () => { dragging = false; canvas.style.cursor = 'grab'; });
  }
  window.addEventListener('resize', () => { size(); render(); });
  if (window.ResizeObserver) new ResizeObserver(() => { size(); render(); }).observe(canvas);
  return {
    show, render, resize() { size(); render(); },
    play() { cancelAnimationFrame(raf); loop(); }, stop() { cancelAnimationFrame(raf); },
    setAuto(v) { auto = v; },
    snapshot(p, a = 0.6) { show(p); angle = a; render(); return canvas.toDataURL('image/png'); },
  };
}

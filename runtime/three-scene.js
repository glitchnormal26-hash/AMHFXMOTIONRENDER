/**
 * Motion Designer v3.8 — state-driven Three.js background/runtime.
 *
 * No independent clock. Call render(t) with master-timeline time.
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/OutputPass.js";

function cssColor(name, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw || fallback;
}

function makeSeeds(count) {
  const out = [];
  // Setup-time pseudo-random is allowed; render-time randomness is not.
  for (let i = 0; i < count; i++) {
    out.push({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 18,
      z: Math.random() * -32,
      speed: 0.25 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      size: 0.018 + Math.random() * 0.05
    });
  }
  return out;
}

export function createThreeScene(canvas, {
  width = 1920,
  height = 1080,
  pixelRatio = Math.min(devicePixelRatio || 1, 2)
} = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
  scene.add(camera);

  const state = {
    grid: 0,
    dust: 0.5,
    nebula: 0.6,
    stars: 0,
    tunnel: 0,
    flow: 0,
    camX: 0,
    camY: 0,
    camZ: 16,
    camRoll: 0,
    bloom: 0.85,
    shake: 0,
    heroO: 0,
    heroS: 1,
    heroX: 0,
    heroY: 0,
    heroZ: 6,
    heroRotX: 0,
    heroRotY: 0,
    heroRotZ: 0
  };

  const base = new THREE.Color(cssColor("--base", "#111318"));
  const accent = new THREE.Color(cssColor("--accent", "#8A8F98"));
  const accentLit = new THREE.Color(cssColor("--accent-lit", "#C4C8CF"));
  scene.background = base;

  const hemi = new THREE.HemisphereLight(accentLit, base, 1.35);
  scene.add(hemi);
  const key = new THREE.PointLight(accentLit, 28, 40);
  key.position.set(5, 6, 10);
  scene.add(key);
  const rim = new THREE.PointLight(accent, 18, 35);
  rim.position.set(-7, -3, 8);
  scene.add(rim);

  // Hero ornament: generic geometry, replace from the actual brief.
  const hero = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.4, 1),
    new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.32,
      roughness: 0.33,
      metalness: 0.22,
      transparent: true,
      opacity: 0
    })
  );
  scene.add(hero);

  // Grid.
  const grid = new THREE.GridHelper(40, 40, accent, accent);
  grid.rotation.x = Math.PI / 2;
  grid.position.z = -10;
  grid.material.transparent = true;
  grid.material.opacity = 0;
  scene.add(grid);

  // Deterministic dust: seeds fixed at setup; positions recomputed from state.flow.
  const seeds = makeSeeds(180);
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(seeds.length * 3);
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: accentLit,
    size: 0.055,
    transparent: true,
    opacity: 0.45,
    depthWrite: false
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // Stars: separate sparse set.
  const starSeeds = makeSeeds(70);
  const starsGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starSeeds.length * 3);
  starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starsMat = new THREE.PointsMaterial({
    color: accentLit,
    size: 0.095,
    transparent: true,
    opacity: 0,
    depthWrite: false
  });
  const stars = new THREE.Points(starsGeo, starsMat);
  scene.add(stars);

  // Nebula planes.
  const nebulaGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: i % 2 ? accentLit : accent,
      transparent: true,
      opacity: 0.05,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(18, 11), mat);
    plane.position.set((i - 1) * 5, (i % 2 ? 2 : -2), -14 - i * 4);
    plane.rotation.z = (i - 1) * 0.35;
    nebulaGroup.add(plane);
  }
  scene.add(nebulaGroup);

  // Tunnel rings.
  const tunnel = new THREE.Group();
  for (let i = 0; i < 18; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.2 + i * 0.035, 0.018, 6, 72),
      new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0,
        depthWrite: false
      })
    );
    ring.position.z = -i * 1.65;
    tunnel.add(ring);
  }
  scene.add(tunnel);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    state.bloom,
    0.55,
    0.62
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  function updatePoints(groupSeeds, array, flow, span = 32, zBase = 0) {
    for (let i = 0; i < groupSeeds.length; i++) {
      const s = groupSeeds[i];
      const z = -(((s.z * -1 + flow * s.speed) % span + span) % span) + zBase;
      array[i * 3] = s.x + Math.sin(flow * 0.01 + s.phase) * 0.25;
      array[i * 3 + 1] = s.y + Math.cos(flow * 0.012 + s.phase) * 0.18;
      array[i * 3 + 2] = z;
    }
  }

  function render(t = 0) {
    const shake = state.shake;
    const sx = shake ? Math.sin(t * 137.2) * shake : 0;
    const sy = shake ? Math.sin(t * 173.8 + 1.7) * shake : 0;

    camera.position.set(state.camX + sx, state.camY + sy, state.camZ);
    camera.rotation.z = state.camRoll;
    camera.lookAt(0, 0, 0);

    grid.material.opacity = Math.max(0, Math.min(0.36, state.grid * 0.24));
    grid.position.x = Math.sin(t * 0.21) * 0.2;
    grid.position.y = Math.cos(t * 0.17) * 0.16;

    dustMat.opacity = Math.max(0, Math.min(0.55, state.dust * 0.55));
    updatePoints(seeds, dustPos, state.flow, 34, 0);
    dustGeo.attributes.position.needsUpdate = true;

    starsMat.opacity = Math.max(0, Math.min(0.7, state.stars * 0.7));
    updatePoints(starSeeds, starPos, state.flow * 0.18, 45, 8);
    starsGeo.attributes.position.needsUpdate = true;

    nebulaGroup.children.forEach((p, i) => {
      p.material.opacity = state.nebula * (0.035 + i * 0.012);
      p.rotation.z = (i - 1) * 0.35 + Math.sin(t * (0.07 + i * 0.015)) * 0.08;
      p.scale.setScalar(1 + Math.sin(t * 0.09 + i) * 0.035);
    });

    tunnel.children.forEach((ring, i) => {
      const z = -(((i * 1.65 - state.flow * 0.035) % 29.7 + 29.7) % 29.7);
      ring.position.z = z;
      ring.material.opacity = state.tunnel * Math.max(0, 0.22 - Math.abs(z + 9) * 0.008);
      ring.rotation.z = i * 0.11 + state.flow * 0.002;
    });

    hero.position.set(state.heroX, state.heroY, state.heroZ);
    hero.scale.setScalar(state.heroS);
    hero.rotation.set(state.heroRotX, state.heroRotY, state.heroRotZ);
    hero.material.opacity = state.heroO;
    hero.visible = state.heroO > 0.001;

    bloomPass.strength = state.bloom;
    composer.render();
  }

  function resize(w = width, h = height) {
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  return {
    THREE,
    renderer,
    composer,
    bloomPass,
    scene,
    camera,
    state,
    hero,
    grid,
    dust,
    stars,
    tunnel,
    render,
    resize
  };
}

import * as THREE from 'three';

/**
 * Hero scene: deep-space field of stars + soft drifting nebula glow.
 * The orange horizon arc itself is a CSS element below this canvas so it
 * stays crisp; here we just do the cosmos behind.
 */
export function initHeroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const size = () => ({ w: canvas.clientWidth, h: canvas.clientHeight });
  let { w, h } = size();
  renderer.setSize(w, h, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);
  camera.position.set(0, 0, 10);

  /* ── Star field (close, layered) ─────────────────────────────────────── */
  const STARS = 1600;
  const sGeo = new THREE.BufferGeometry();
  const sPos = new Float32Array(STARS * 3);
  const sSize = new Float32Array(STARS);
  const sShimmer = new Float32Array(STARS);

  for (let i = 0; i < STARS; i++) {
    // box volume positioned in front of the camera, slightly biased upward
    sPos[i * 3]     = (Math.random() - 0.5) * 50;        // -25..25
    sPos[i * 3 + 1] = (Math.random() - 0.35) * 22;       // -7.7..14.3 (bias up)
    sPos[i * 3 + 2] = -8 - Math.random() * 35;           // -8..-43 (in front of camera)
    sSize[i] = Math.random() * 1.6 + 0.4;
    sShimmer[i] = Math.random() * Math.PI * 2;
  }
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  sGeo.setAttribute('aSize', new THREE.BufferAttribute(sSize, 1));
  sGeo.setAttribute('aShimmer', new THREE.BufferAttribute(sShimmer, 1));

  const sMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aShimmer;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vShimmer;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float twinkle = 0.6 + 0.4 * sin(uTime * 1.6 + aShimmer);
        gl_PointSize = aSize * uPixelRatio * (240.0 / -mv.z) * twinkle;
        vShimmer = twinkle;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vShimmer;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d);
        vec3 col = vec3(1.0, 0.97, 0.92);
        gl_FragColor = vec4(col, a * vShimmer * 0.95);
      }
    `,
  });
  const stars = new THREE.Points(sGeo, sMat);
  scene.add(stars);

  /* ── Distant background stars (more, smaller, less twinkle) ──────────── */
  const FAR = 1800;
  const fGeo = new THREE.BufferGeometry();
  const fPos = new Float32Array(FAR * 3);
  for (let i = 0; i < FAR; i++) {
    fPos[i * 3]     = (Math.random() - 0.5) * 100;
    fPos[i * 3 + 1] = (Math.random() - 0.35) * 60;
    fPos[i * 3 + 2] = -40 - Math.random() * 50;
  }
  fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
  const fMat = new THREE.PointsMaterial({
    size: 0.06,
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const farStars = new THREE.Points(fGeo, fMat);
  scene.add(farStars);

  /* ── Nebula glow (a faint orange disc placed deep behind) ────────────── */
  const nebula = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec2 p = vUv - 0.5;
          float d = length(p);
          float a = smoothstep(0.5, 0.05, d);
          a *= 0.18 + 0.05 * sin(uTime * 0.5);
          vec3 col = vec3(0.992, 0.325, 0.129);
          gl_FragColor = vec4(col, a);
        }
      `,
    }),
  );
  nebula.position.set(0, -8, -20);
  scene.add(nebula);

  /* ── Subtle drifting "comet" streaks ─────────────────────────────────── */
  const comets = [];
  for (let i = 0; i < 3; i++) {
    const g = new THREE.BufferGeometry();
    const pts = new Float32Array(2 * 3);
    g.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    const m = new THREE.LineBasicMaterial({
      color: 0xfd5321,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const line = new THREE.Line(g, m);
    line.userData = {
      t: Math.random() * 6,
      next: 4 + Math.random() * 8,
    };
    scene.add(line);
    comets.push(line);
  }

  /* ── Resize ──────────────────────────────────────────────────────────── */
  function resize() {
    const s = size();
    if (s.w === 0 || s.h === 0) return;
    w = s.w; h = s.h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  window.addEventListener('resize', resize);
  resize();

  /* ── Mouse parallax ──────────────────────────────────────────────────── */
  const mouseTarget = new THREE.Vector2(0, 0);
  const mouse = new THREE.Vector2(0, 0);
  window.addEventListener('pointermove', (e) => {
    mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.y = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  /* ── Render loop ─────────────────────────────────────────────────────── */
  const clock = new THREE.Clock();
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  function tick() {
    const t = clock.getElapsedTime();
    sMat.uniforms.uTime.value = t;
    nebula.material.uniforms.uTime.value = t;

    mouse.lerp(mouseTarget, 0.04);

    stars.rotation.y = mouse.x * 0.08 + t * 0.005;
    stars.rotation.x = -mouse.y * 0.05;
    farStars.rotation.y = mouse.x * 0.04;
    farStars.rotation.x = -mouse.y * 0.025;

    // hero parallax on scroll: drift content down with the camera
    const heroH = canvas.clientHeight || window.innerHeight;
    const scrollProg = Math.min(scrollY / heroH, 1);
    camera.position.y = scrollProg * 4;

    // comets
    comets.forEach((c) => {
      c.userData.t += 0.016;
      const pos = c.geometry.attributes.position;
      if (c.userData.t > c.userData.next) {
        c.userData.t = 0;
        c.userData.next = 6 + Math.random() * 10;
        const sx = -40 + Math.random() * 30;
        const sy = 15 + Math.random() * 12;
        const sz = -10 + Math.random() * 8;
        pos.setXYZ(0, sx, sy, sz);
        pos.setXYZ(1, sx, sy, sz);
        c.material.opacity = 0;
      } else if (c.userData.t < 1.6) {
        // animate end point
        const head = c.userData.t / 1.6;
        pos.setXYZ(
          1,
          pos.getX(0) + head * 14,
          pos.getY(0) - head * 6,
          pos.getZ(0),
        );
        c.material.opacity = Math.sin(head * Math.PI) * 0.6;
        pos.needsUpdate = true;
      } else {
        c.material.opacity = Math.max(0, c.material.opacity - 0.04);
      }
    });

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  let rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    renderer.dispose();
    sGeo.dispose();
    fGeo.dispose();
    nebula.geometry.dispose();
    nebula.material.dispose();
  };
}

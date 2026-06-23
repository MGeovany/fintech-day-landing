import * as THREE from 'three';

/**
 * "Sobre" scene - 3D fintech ecosystem.
 *
 *   ▸ Faceted icosahedron core = Honduras as the structured hub.
 *   ▸ 4 satellite nodes orbiting in different planes = the 4 stakeholder
 *     groups (Reguladores, Startups, Inversionistas, Academia).
 *   ▸ Glowing pulses travel inward along each connection = capital, data
 *     and decisions flowing toward the ecosystem center.
 *
 * Replaces the previous 2D canvas hub diagram. Pauses when offscreen.
 */
export function initEcosystemScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  /* ── Core: faceted icosahedron ────────────────────────────────────── */
  const coreGeo = new THREE.IcosahedronGeometry(1.1, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.65,
    roughness: 0.4,
    flatShading: true,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  /* ── Edges of the core, glowing orange ────────────────────────────── */
  const edgesGeo = new THREE.EdgesGeometry(coreGeo);
  const edgesMat = new THREE.LineBasicMaterial({
    color: 0x007aff,
    transparent: true,
    opacity: 0.7,
  });
  const edges = new THREE.LineSegments(edgesGeo, edgesMat);
  scene.add(edges);

  /* ── Fresnel rim glow (back-side hull trick) ──────────────────────── */
  const rimGeo = new THREE.IcosahedronGeometry(1.22, 1);
  const rimMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    vertexShader: `
      varying vec3 vN;
      varying vec3 vP;
      void main() {
        vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vP = mv.xyz;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vN;
      varying vec3 vP;
      void main() {
        vec3 view = normalize(-vP);
        float f = pow(1.0 - max(dot(view, vN), 0.0), 2.6);
        gl_FragColor = vec4(vec3(0.992, 0.325, 0.129), f * 0.55);
      }
    `,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  scene.add(rim);

  /* ── Helper: radial glow texture used as satellite halo ───────────── */
  function makeHaloTexture() {
    const s = 128;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0.0, 'rgba(200, 230, 255, 1)');
    g.addColorStop(0.25, 'rgba(0, 122, 255, 0.55)');
    g.addColorStop(1.0, 'rgba(0, 122, 255, 0)');
    x.fillStyle = g;
    x.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  const haloTex = makeHaloTexture();

  /* ── Satellites (4 stakeholder nodes orbiting at different planes) ── */
  // Positions roughly match the four corner tags in HTML so the visual
  // groups read as one continuous element.
  const STAKEHOLDERS = [
    { angle: Math.PI * 0.75, tilt:  0.55, radius: 2.45, speed: 0.18 }, // top-left  · Reguladores
    { angle: Math.PI * 0.25, tilt: -0.45, radius: 2.55, speed: 0.20 }, // top-right · Startups
    { angle: Math.PI * 1.25, tilt:  0.40, radius: 2.50, speed: 0.16 }, // bot-left  · Inversionistas
    { angle: Math.PI * 1.75, tilt: -0.55, radius: 2.55, speed: 0.22 }, // bot-right · Academia
  ];

  const satGeo = new THREE.IcosahedronGeometry(0.11, 0);
  const satMat = new THREE.MeshBasicMaterial({ color: 0xfff0e0 });
  const satellites = STAKEHOLDERS.map(() => {
    const node = new THREE.Mesh(satGeo, satMat);
    scene.add(node);

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: haloTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    halo.scale.set(0.6, 0.6, 1);
    scene.add(halo);

    return { node, halo };
  });

  /* ── Connection lines (core → satellite) ──────────────────────────── */
  const links = satellites.map(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const m = new THREE.LineBasicMaterial({
      color: 0x007aff,
      transparent: true,
      opacity: 0.22,
    });
    const line = new THREE.Line(g, m);
    scene.add(line);
    return line;
  });

  /* ── Pulses travelling from satellite back to core ────────────────── */
  const pulseGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const pulses = satellites.map((_, i) => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffb478,
      transparent: true,
      opacity: 1,
    });
    const mesh = new THREE.Mesh(pulseGeo, mat);
    scene.add(mesh);

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: haloTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.9,
    }));
    halo.scale.set(0.32, 0.32, 1);
    scene.add(halo);

    return {
      mesh,
      halo,
      t: i / STAKEHOLDERS.length, // staggered start
      speed: 0.28 + (i % 2) * 0.08,
    };
  });

  /* ── Subtle outer orbital ring ────────────────────────────────────── */
  const ringGeo = new THREE.TorusGeometry(2.75, 0.003, 6, 140);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x007aff,
    transparent: true,
    opacity: 0.18,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.2;
  scene.add(ring);

  /* ── Lighting ─────────────────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));
  const key = new THREE.DirectionalLight(0x007aff, 1.6);
  key.position.set(3.5, 2.5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x6688ff, 0.32);
  fill.position.set(-3, -2, 1);
  scene.add(fill);

  /* ── Resize ───────────────────────────────────────────────────────── */
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  window.addEventListener('resize', resize);
  resize();

  /* ── Mouse parallax (only when pointer is over the canvas) ────────── */
  let tx = 0, ty = 0, mx = 0, my = 0;
  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - 0.5;
    ty = (e.clientY - r.top) / r.height - 0.5;
  }
  function onLeave() { tx = 0; ty = 0; }
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);

  /* ── Animation loop ───────────────────────────────────────────────── */
  const clock = new THREE.Clock();
  let rafId = 0;
  let running = true;
  const tmp = new THREE.Vector3();

  function satellitePos(i, t, out) {
    const s = STAKEHOLDERS[i];
    const a = s.angle + t * s.speed;
    out.set(
      Math.cos(a) * s.radius,
      Math.sin(t * s.speed * 1.3 + i * 1.7) * s.tilt,
      Math.sin(a) * s.radius,
    );
    return out;
  }

  function tick() {
    const t = clock.getElapsedTime();
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;

    // core + edges + rim share the same orientation
    core.rotation.x = t * 0.12 + my * 0.5;
    core.rotation.y = t * 0.18 + mx * 0.7;
    edges.rotation.copy(core.rotation);
    rim.rotation.copy(core.rotation);

    // satellites orbit
    satellites.forEach((s, i) => {
      satellitePos(i, t, tmp);
      s.node.position.copy(tmp);
      s.halo.position.copy(tmp);
      s.node.rotation.x = t * 0.6;
      s.node.rotation.y = t * 0.9;
    });

    // links: update each line's second endpoint to track its satellite
    links.forEach((line, i) => {
      const p = satellites[i].node.position;
      const arr = line.geometry.attributes.position.array;
      arr[3] = p.x; arr[4] = p.y; arr[5] = p.z;
      line.geometry.attributes.position.needsUpdate = true;
    });

    // pulses: travel from satellite (u=0) toward core (u=1), fade in/out
    pulses.forEach((p, i) => {
      p.t += p.speed * 0.016;
      if (p.t > 1) p.t -= 1;
      const u = p.t;
      const target = satellites[i].node.position;
      p.mesh.position.set(target.x * (1 - u), target.y * (1 - u), target.z * (1 - u));
      p.halo.position.copy(p.mesh.position);
      const fade = Math.sin(u * Math.PI);
      p.mesh.material.opacity = fade;
      p.halo.material.opacity = fade * 0.9;
    });

    ring.rotation.z = t * 0.12;

    renderer.render(scene, camera);
    if (running) rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  /* ── Pause when offscreen ─────────────────────────────────────────── */
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!running) {
        running = true;
        clock.start();
        rafId = requestAnimationFrame(tick);
      }
    } else if (running) {
      running = false;
      cancelAnimationFrame(rafId);
    }
  }, { threshold: 0 });
  io.observe(canvas);

  return () => {
    running = false;
    cancelAnimationFrame(rafId);
    ro.disconnect();
    io.disconnect();
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerleave', onLeave);
    renderer.dispose();
    coreGeo.dispose();
    edgesGeo.dispose();
    rimGeo.dispose();
    satGeo.dispose();
    pulseGeo.dispose();
    ringGeo.dispose();
    haloTex.dispose();
    links.forEach((l) => l.geometry.dispose());
  };
}

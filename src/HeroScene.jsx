import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const projectItems = [
  { src: '/assets/wuji-project-cover.svg', label: 'WUJI / ASSET KEEPER', project: true },
  { src: '/assets/focus-plan-project-cover.svg', label: 'FOCUS PLAN / PROJECT', project: true },
  { src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=82', label: 'REFERENCE / INTERFACE' },
  { src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=82', label: 'REFERENCE / WORKSPACE' },
  { src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82', label: 'REFERENCE / SYSTEM' }
];

const accentColors = [0xd7ad59, 0x7fd1d5, 0xd994b2, 0xb6c877, 0x9da9e8];

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function createCoverTexture(texture, anisotropy) {
  if (!texture?.image) return undefined;
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 500;
  const context = canvas.getContext('2d');
  const image = texture.image;
  const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  context.fillStyle = '#0b0e0d';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  context.strokeStyle = 'rgba(235, 241, 237, .34)';
  context.lineWidth = 3;
  context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
  const coverTexture = new THREE.CanvasTexture(canvas);
  coverTexture.colorSpace = THREE.SRGBColorSpace;
  coverTexture.anisotropy = anisotropy;
  texture.dispose();
  return coverTexture;
}

function createCard(item, texture, index, compact, anisotropy) {
  const width = compact ? 0.92 : 1.16;
  const height = width / 1.44;
  const geometry = new THREE.PlaneGeometry(width, height);
  const fallback = new THREE.MeshBasicMaterial({ color: accentColors[index % accentColors.length], transparent: true, opacity: 0.84 });
  const material = texture
    ? new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1 })
    : fallback;
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = anisotropy;
  }
  const card = new THREE.Mesh(geometry, material);
  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xe7eeea, transparent: true, opacity: 0.4 })
  );
  card.add(edge);
  card.userData = { index, item, opacity: texture ? 1 : 0.7, baseY: (index % 3 - 1) * (compact ? 0.06 : 0.1) };
  return card;
}

function disposeCard(card) {
  card.geometry?.dispose();
  const materials = Array.isArray(card.material) ? card.material : [card.material];
  materials.forEach((material) => {
    material?.map?.dispose();
    material?.dispose();
  });
  card.children.forEach((child) => {
    child.geometry?.dispose();
    child.material?.dispose();
  });
}

function createTunnelGuide(compact) {
  const guide = new THREE.Group();
  const grid = new THREE.GridHelper(compact ? 6 : 7.2, compact ? 8 : 10, 0xd8b260, 0x3f5043);
  grid.rotation.x = Math.PI / 2;
  grid.position.z = -1.18;
  grid.scale.x = compact ? 0.62 : 0.78;
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  guide.add(grid);

  const railGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(compact ? -1.25 : -1.72, -3.2, -0.9),
    new THREE.Vector3(compact ? -1.25 : -1.72, 3.2, -0.9),
    new THREE.Vector3(compact ? 1.25 : 1.72, -3.2, -0.9),
    new THREE.Vector3(compact ? 1.25 : 1.72, 3.2, -0.9)
  ]);
  guide.add(new THREE.LineSegments(
    railGeometry,
    new THREE.LineBasicMaterial({ color: 0xd8b260, transparent: true, opacity: 0.26 })
  ));
  return guide;
}

export default function HeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const compact = window.matchMedia('(max-width: 680px)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      mount.dataset.sceneStatus = 'fallback';
      return undefined;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.35 : 1.75));
    renderer.domElement.className = 'hero-scene-canvas';
    renderer.domElement.setAttribute('aria-label', compact ? '项目截图横向信号带' : '项目截图信号隧道');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);
    const cluster = new THREE.Group();
    cluster.position.set(compact ? 0.25 : 1.62, compact ? -1.05 : 0.02, 0);
    cluster.scale.setScalar(compact ? 0.82 : 1);
    scene.add(cluster);
    const tunnelGuide = createTunnelGuide(compact);
    cluster.add(tunnelGuide);

    const orderedItems = shuffle(projectItems);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const cards = [];
    const loadedTextures = [];
    let disposed = false;

    function addCard(item, index, texture) {
      if (disposed) {
        texture?.dispose();
        return;
      }
      const card = createCard(item, texture, index, compact, anisotropy);
      cards[index] = card;
      cluster.add(card);
    }

    orderedItems.forEach((item, index) => {
      loader.load(item.src, (texture) => {
        const coverTexture = createCoverTexture(texture, anisotropy);
        loadedTextures.push(coverTexture);
        addCard(item, index, coverTexture);
      }, undefined, () => addCard(item, index));
    });

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    let tunnelOffset = 0;
    let tunnelTarget = 0;
    let dragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let scrollTarget = 0;
    let frame = 0;
    let visible = true;
    const clock = new THREE.Clock();

    function resize() {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    function pointerMove(event) {
      pointerTarget.x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      pointerTarget.y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      if (dragging) {
        tunnelTarget += (compact ? event.clientX - lastPointerX : event.clientY - lastPointerY) * 0.012;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
      }
    }

    function pointerDown(event) {
      dragging = true;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      renderer.domElement.setPointerCapture?.(event.pointerId);
    }

    function pointerUp(event) {
      dragging = false;
      renderer.domElement.releasePointerCapture?.(event.pointerId);
    }

    function handleScroll() {
      scrollTarget = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    }

    function renderFrame() {
      frame = 0;
      if (!visible) return;
      const elapsed = clock.getElapsedTime();
      mount.dataset.sceneStage = 'tunnel';
      pointer.lerp(pointerTarget, 0.045);
      tunnelOffset += (tunnelTarget - tunnelOffset) * 0.08;
      cluster.rotation.x += ((-pointer.y * 0.06) - cluster.rotation.x) * 0.035;
      cluster.rotation.y += ((pointer.x * 0.1) - cluster.rotation.y) * 0.035;
      cluster.position.y = (compact ? -1.05 : 0.02) + scrollTarget * 0.7;

      const spacing = compact ? 0.94 : 1.04;
      const total = orderedItems.length * spacing;
      const autoScroll = reducedMotion ? 0 : elapsed * (compact ? 0.34 : 0.42);
      cards.filter(Boolean).forEach((card, index) => {
        const rawY = index * spacing + autoScroll + tunnelOffset;
        const offset = ((rawY + total / 2) % total + total) % total - total / 2;
        const focus = Math.max(0, 1 - Math.abs(offset) / (total * 0.38));
        const depth = Math.max(0, Math.min(1, focus));
        const x = compact ? offset : Math.sin(index * 1.8 + elapsed * 0.18) * 0.14;
        const y = compact ? card.userData.baseY : offset;
        card.position.set(
          x,
          y,
          depth * 2.5 - 1.12
        );
        card.rotation.set(compact ? 0 : y * -0.035, compact ? x * -0.035 : Math.sin(index * 1.2) * 0.06, compact ? x * 0.018 : x * 0.05);
        card.scale.setScalar(0.5 + depth * 0.56);
        card.renderOrder = Math.round(depth * 100);
        if (card.material) {
          card.material.opacity = (0.16 + depth * 0.84) * card.userData.opacity;
        }
      if (card.children[0]?.material) {
        card.children[0].material.opacity = 0.12 + depth * 0.5;
        card.children[0].material.color.set(depth > 0.62 ? 0x82f0f3 : 0x60747d);
      }
      });

      renderer.render(scene, camera);
      if (!reducedMotion) frame = window.requestAnimationFrame(renderFrame);
    }

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame && !reducedMotion) renderFrame();
      if (!visible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { threshold: 0.01 });

    resizeObserver.observe(mount);
    visibilityObserver.observe(mount);
    window.addEventListener('pointermove', pointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    renderer.domElement.addEventListener('pointerdown', pointerDown);
    renderer.domElement.addEventListener('pointerup', pointerUp);
    renderer.domElement.addEventListener('pointercancel', pointerUp);
    resize();
    handleScroll();
    renderFrame();
    mount.dataset.sceneStatus = 'ready';

    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('pointermove', pointerMove);
      window.removeEventListener('scroll', handleScroll);
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointerup', pointerUp);
      renderer.domElement.removeEventListener('pointercancel', pointerUp);
      cards.filter(Boolean).forEach(disposeCard);
      tunnelGuide.traverse((object) => {
        object.geometry?.dispose();
        object.material?.dispose();
      });
      loadedTextures.forEach((texture) => texture?.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="hero-scene" ref={mountRef} aria-hidden="true">
      <img className="hero-scene-fallback" src="/assets/wuji-project-cover.svg" alt="" />
      <span className="hero-scene-axis hero-scene-axis-x" />
      <span className="hero-scene-axis hero-scene-axis-y" />
    </div>
  );
}

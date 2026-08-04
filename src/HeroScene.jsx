import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const projectItems = [
  { src: '/assets/wuji-project-cover.svg', accent: 0x2457ff },
  { src: '/assets/focus-plan-project-cover.svg', accent: 0x2457ff }
];

function createCoverTexture(texture, anisotropy) {
  if (!texture?.image) return texture;
  const width = 1200;
  const height = 760;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  const image = texture.image;
  const imageWidth = image.naturalWidth || image.width || width;
  const imageHeight = image.naturalHeight || image.height || height;
  const scale = Math.max(width / imageWidth, height / imageHeight);
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  context.fillStyle = '#eef2f7';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  const cover = new THREE.CanvasTexture(canvas);
  cover.colorSpace = THREE.SRGBColorSpace;
  cover.anisotropy = anisotropy;
  cover.needsUpdate = true;
  texture.dispose();
  return cover;
}

function createCard(item, index, texture) {
  const group = new THREE.Group();
  const geometry = new THREE.PlaneGeometry(3.18, 2.02);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: texture ? 0xffffff : 0xdfe7f3,
    transparent: true,
    opacity: 1,
    toneMapped: false
  });
  const cover = new THREE.Mesh(geometry, material);
  cover.position.z = 0.04;
  group.add(cover);

  const backing = new THREE.Mesh(
    new THREE.BoxGeometry(3.3, 2.14, 0.12),
    new THREE.MeshBasicMaterial({ color: 0xf8fbff, transparent: true, opacity: 0.96 })
  );
  backing.position.z = -0.06;
  group.add(backing);

  const border = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.34, 2.18, 0.15)),
    new THREE.LineBasicMaterial({ color: item.accent, transparent: true, opacity: 0.58 })
  );
  border.position.z = -0.04;
  group.add(border);

  const signal = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 2.2, 0.18),
    new THREE.MeshBasicMaterial({ color: item.accent, transparent: true, opacity: 0.9 })
  );
  signal.position.set(-1.69, 0, 0);
  group.add(signal);

  group.userData = { index, material, border, signal, baseY: index === 0 ? 0.02 : -0.02 };
  return group;
}

function createArcGuide(compact) {
  const points = [];
  const width = compact ? 4.4 : 7.6;
  for (let index = 0; index <= 70; index += 1) {
    const progress = index / 70;
    const x = (progress - 0.5) * width;
    const z = -Math.abs(progress - 0.5) * 1.45;
    const y = Math.sin(progress * Math.PI) * 0.13 - 1.5;
    points.push(new THREE.Vector3(x, y, z));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x2457ff, transparent: true, opacity: 0.16 });
  return new THREE.Line(geometry, material);
}

function disposeObject(object) {
  object.traverse((child) => {
    child.geometry?.dispose();
    if (Array.isArray(child.material)) child.material.forEach(material => material.dispose());
    else child.material?.dispose();
  });
}

export default function HeroScene({ activeIndex = 0, onActiveChange }) {
  const mountRef = useRef(null);
  const activeRef = useRef(activeIndex);
  const onActiveChangeRef = useRef(onActiveChange);

  useEffect(() => { activeRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => { onActiveChangeRef.current = onActiveChange; }, [onActiveChange]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const compact = window.matchMedia('(max-width: 760px)').matches;
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.7));
    renderer.domElement.className = 'hero-scene-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(compact ? 48 : 42, 1, 0.1, 100);
    camera.position.set(0, 0, compact ? 7.8 : 7.1);

    const stage = new THREE.Group();
    stage.position.set(compact ? 0 : 1.72, compact ? -1.02 : -0.02, 0);
    stage.scale.setScalar(compact ? 0.76 : 1);
    scene.add(stage);

    const guide = createArcGuide(compact);
    stage.add(guide);

    const loader = new THREE.TextureLoader();
    const anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const cards = [];
    const textures = [];
    let disposed = false;

    projectItems.forEach((item, index) => {
      loader.load(item.src, (texture) => {
        if (disposed) { texture.dispose(); return; }
        const coverTexture = createCoverTexture(texture, anisotropy);
        textures.push(coverTexture);
        const card = createCard(item, index, coverTexture);
        cards[index] = card;
        stage.add(card);
      }, undefined, () => {
        if (disposed) return;
        const card = createCard(item, index);
        cards[index] = card;
        stage.add(card);
      });
    });

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const clock = new THREE.Clock();
    let dragging = false;
    let dragStartX = 0;
    let dragTriggered = false;
    let visible = true;
    let frame = 0;

    function resize() {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function handlePointerMove(event) {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
      pointerTarget.y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
      if (!dragging || dragTriggered) return;
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > 46) {
        const next = activeRef.current === 0 ? 1 : 0;
        activeRef.current = next;
        dragTriggered = true;
        onActiveChangeRef.current?.(next);
      }
    }

    function handlePointerDown(event) {
      dragging = true;
      dragTriggered = false;
      dragStartX = event.clientX;
      renderer.domElement.setPointerCapture?.(event.pointerId);
    }

    function handlePointerUp(event) {
      dragging = false;
      renderer.domElement.releasePointerCapture?.(event.pointerId);
    }

    function renderFrame() {
      frame = 0;
      if (!visible) return;
      const elapsed = clock.getElapsedTime();
      pointer.lerp(pointerTarget, reducedMotion ? 1 : 0.055);

      const active = activeRef.current;
      cards.filter(Boolean).forEach((card, index) => {
        const selected = index === active;
        const side = selected ? 0 : active === 0 ? 1 : -1;
        const targetX = side * (compact ? 4.15 : 3.5);
        const targetY = card.userData.baseY + (selected ? 0 : 0.22);
        const targetZ = selected ? 0.72 : -1.35;
        const targetScale = selected ? 1 : compact ? 0.76 : 0.72;
        const targetRotationY = selected ? pointer.x * 0.035 : side * -0.48;
        const targetRotationX = selected ? pointer.y * -0.025 : 0.03;
        const easing = reducedMotion ? 1 : 0.075;

        card.position.x += (targetX - card.position.x) * easing;
        card.position.y += (targetY - card.position.y) * easing;
        card.position.z += (targetZ - card.position.z) * easing;
        card.rotation.y += (targetRotationY - card.rotation.y) * easing;
        card.rotation.x += (targetRotationX - card.rotation.x) * easing;
        card.rotation.z += ((side * 0.035) - card.rotation.z) * easing;
        const breath = reducedMotion || !selected ? 0 : Math.sin(elapsed * 1.15) * 0.008;
        const scale = targetScale + breath;
        card.scale.x += (scale - card.scale.x) * easing;
        card.scale.y += (scale - card.scale.y) * easing;
        card.scale.z += (scale - card.scale.z) * easing;
        card.userData.material.opacity += ((selected ? 1 : compact ? 0.16 : 0.48) - card.userData.material.opacity) * easing;
        card.userData.border.material.opacity += ((selected ? 0.72 : compact ? 0.08 : 0.2) - card.userData.border.material.opacity) * easing;
        card.userData.signal.material.opacity += ((selected ? 0.94 : compact ? 0.12 : 0.26) - card.userData.signal.material.opacity) * easing;
        card.renderOrder = selected ? 10 : 1;
      });

      stage.position.y = compact ? -1.02 : -0.02;
      stage.position.z = 0;
      guide.material.opacity = 0.16;
      camera.position.x += (((reducedMotion ? 0 : pointer.x) * 0.1) - camera.position.x) * 0.04;
      camera.position.y += (((reducedMotion ? 0 : -pointer.y) * 0.07) - camera.position.y) * 0.04;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(renderFrame);
    }

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) renderFrame();
      else if (!visible && frame) { window.cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: 0.01 });

    resizeObserver.observe(mount);
    visibilityObserver.observe(mount);
    renderer.domElement.addEventListener('pointermove', handlePointerMove, { passive: true });
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointercancel', handlePointerUp);
    resize();
    renderFrame();
    mount.dataset.sceneStatus = 'ready';

    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointercancel', handlePointerUp);
      cards.filter(Boolean).forEach(disposeObject);
      disposeObject(guide);
      textures.forEach(texture => texture?.dispose());
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

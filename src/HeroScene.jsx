import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import focusPlanDesktopImage from './assets/focus-plan-concept-desktop.png';
import focusPlanMobileImage from './assets/focus-plan-concept-mobile.png';

const projectItems = [
  { src: '/assets/wuji-business-desktop.png', label: 'WUJI / MERCHANT', aspect: 1.6, project: true },
  { src: '/assets/wuji-business-mobile.png', label: 'WUJI / ADMIN', aspect: 0.46, project: true },
  { src: '/assets/wuji-family-mobile.png', label: 'WUJI / FAMILY', aspect: 0.46, project: true },
  { src: focusPlanDesktopImage, label: 'FOCUS PLAN / WEB', aspect: 1.6, project: true },
  { src: focusPlanMobileImage, label: 'FOCUS PLAN / APP', aspect: 0.46, project: true },
  { src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=82', label: 'INTERFACE / STUDY', aspect: 1.5 },
  { src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=82', label: 'WORKSPACE / CLOUD', aspect: 1.5 },
  { src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82', label: 'SYSTEM / PRODUCT', aspect: 1.5 }
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

function ease(value) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function mix(from, to, amount) {
  return from + (to - from) * amount;
}

function setVector(target, values) {
  target.set(values[0], values[1], values[2]);
}

function createCard(item, texture, index, compact, anisotropy) {
  const portrait = item.aspect < 0.8;
  const width = (compact ? 0.72 : 1.05) * (portrait ? 0.82 : 1.2);
  const height = width / item.aspect;
  const geometry = new THREE.PlaneGeometry(width, height, 1, 1);
  const fallback = new THREE.MeshBasicMaterial({ color: accentColors[index % accentColors.length], transparent: true, opacity: 0.86 });
  const front = texture
    ? new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1 })
    : fallback;
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = anisotropy;
  }
  const mesh = new THREE.Mesh(geometry, front);
  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xe7eeea, transparent: true, opacity: 0.34 })
  );
  mesh.add(edge);
  mesh.userData = {
    index,
    item,
    portrait,
    width,
    height,
    opacity: texture ? 1 : 0.7,
    scatter: [
      (Math.random() - 0.5) * (compact ? 4.4 : 5.8),
      (Math.random() - 0.5) * (compact ? 3.9 : 4.3),
      (Math.random() - 0.5) * 2.2 - 0.5
    ],
    scatterRotation: [
      (Math.random() - 0.5) * 0.9,
      (Math.random() - 0.5) * 0.8,
      (Math.random() - 0.5) * 0.75
    ],
    baseScale: 1
  };
  return mesh;
}

function disposeCard(card) {
  card.geometry?.dispose();
  const materials = Array.isArray(card.material) ? card.material : [card.material];
  materials.forEach((material) => {
    if (material?.map) material.map.dispose();
    material?.dispose();
  });
  card.children.forEach((child) => {
    child.geometry?.dispose();
    child.material?.dispose();
  });
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
    renderer.domElement.setAttribute('aria-label', '项目截图动态展示');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);
    const cluster = new THREE.Group();
    cluster.position.set(compact ? 0.25 : 1.62, compact ? -1.02 : 0.02, 0);
    cluster.scale.setScalar(compact ? 0.73 : 1);
    scene.add(cluster);

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
      cards.push(card);
      cluster.add(card);
    }

    orderedItems.forEach((item, index) => {
      loader.load(item.src, (texture) => {
        loadedTextures.push(texture);
        addCard(item, index, texture);
      }, undefined, () => addCard(item, index));
    });

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    let dragRotation = 0;
    let dragTarget = 0;
    let dragging = false;
    let lastPointerX = 0;
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
        const movement = (event.clientX - lastPointerX) * 0.008;
        dragTarget += movement;
        lastPointerX = event.clientX;
      }
    }

    function pointerDown(event) {
      dragging = true;
      lastPointerX = event.clientX;
      renderer.domElement.setPointerCapture?.(event.pointerId);
    }

    function pointerUp(event) {
      dragging = false;
      renderer.domElement.releasePointerCapture?.(event.pointerId);
    }

    function handleScroll() {
      scrollTarget = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    }

    function galleryState(index, count) {
      const middle = (count - 1) / 2;
      const offset = index - middle;
      return { position: [offset * (compact ? 0.62 : 0.88), Math.sin(index * 1.4) * 0.1, -Math.abs(offset) * 0.17], rotation: [0, 0, offset * -0.035], scale: Math.max(0.67, 1 - Math.abs(offset) * 0.055) };
    }

    function cylinderState(index, count, elapsed) {
      const angle = (index / count) * Math.PI * 2 + (elapsed - 5.8) * 0.45 + dragRotation;
      const radius = compact ? 1.36 : 2.02;
      return {
        position: [Math.sin(angle) * radius, Math.cos(index * 1.6) * 0.14, Math.cos(angle) * radius - 0.35],
        rotation: [0, angle, Math.sin(index) * 0.035],
        scale: compact ? 0.78 : 0.92
      };
    }

    function loopState(index, count, elapsed) {
      const gap = compact ? 0.86 : 1.06;
      const total = count * gap;
      const scroll = ((elapsed - 8.5) * 0.52 + dragRotation * 0.55) % total;
      let y = index * gap - scroll;
      y = ((y + total / 2) % total + total) % total - total / 2;
      return {
        position: [compact ? 0.35 : 0.92, y, -0.2 - Math.abs(y) * 0.045],
        rotation: [0, (y > 0 ? -1 : 1) * 0.08, y * -0.025],
        scale: compact ? 0.65 : 0.76
      };
    }

    function applyState(card, index, elapsed) {
      const count = orderedItems.length;
      let state;
      let opacity = 1;
      if (reducedMotion) {
        const gallery = galleryState(index, count);
        state = gallery;
        opacity = 1;
      } else if (elapsed < 2.2) {
        const progress = ease(elapsed / 2.2);
        const middle = (count - 1) / 2;
        const stack = [((index - middle) % 3) * 0.26, (Math.floor(index / 3) - 1) * 0.3, index * 0.055];
        state = {
          position: card.userData.scatter.map((value, axis) => mix(value, stack[axis], progress)),
          rotation: card.userData.scatterRotation.map((value, axis) => mix(value, axis === 2 ? (index - middle) * 0.08 : 0, progress)),
          scale: mix(0.65, 1, progress)
        };
        opacity = mix(0.1, 1, ease(elapsed / 0.75));
      } else if (elapsed < 5.05) {
        const gallery = galleryState(index, count);
        if (elapsed < 2.95) {
          const progress = ease((elapsed - 2.2) / 0.75);
          const middle = (count - 1) / 2;
          const stack = [((index - middle) % 3) * 0.26, (Math.floor(index / 3) - 1) * 0.3, index * 0.055];
          state = {
            position: stack.map((value, axis) => mix(value, gallery.position[axis], progress)),
            rotation: [0, 0, mix((index - middle) * 0.08, gallery.rotation[2], progress)],
            scale: mix(1, gallery.scale, progress)
          };
        } else state = gallery;
      } else if (elapsed < 6.05) {
        const progress = ease((elapsed - 5.05) / 1);
        const from = galleryState(index, count);
        const to = cylinderState(index, count, 5.8);
        state = {
          position: from.position.map((value, axis) => mix(value, to.position[axis], progress)),
          rotation: from.rotation.map((value, axis) => mix(value, to.rotation[axis], progress)),
          scale: mix(from.scale, to.scale, progress)
        };
      } else if (elapsed < 8.5) state = cylinderState(index, count, elapsed);
      else if (elapsed < 9.35) {
        const progress = ease((elapsed - 8.5) / 0.85);
        const from = cylinderState(index, count, 8.5);
        const to = loopState(index, count, 9.35);
        state = {
          position: from.position.map((value, axis) => mix(value, to.position[axis], progress)),
          rotation: from.rotation.map((value, axis) => mix(value, to.rotation[axis], progress)),
          scale: mix(from.scale, to.scale, progress)
        };
      } else state = loopState(index, count, elapsed);

      setVector(card.position, state.position);
      card.rotation.set(state.rotation[0], state.rotation[1], state.rotation[2]);
      card.scale.setScalar(state.scale);
      const material = card.material;
      if (material) material.opacity = opacity * card.userData.opacity;
    }

    function renderFrame() {
      frame = 0;
      if (!visible) return;
      const elapsed = clock.getElapsedTime();
      mount.dataset.sceneStage = reducedMotion ? 'gallery' : elapsed < 2.2 ? 'aggregate' : elapsed < 5.05 ? 'gallery' : elapsed < 8.5 ? 'cylinder' : 'loop';
      pointer.lerp(pointerTarget, 0.045);
      dragRotation = mix(dragRotation, dragTarget, 0.08);
      cluster.rotation.y += ((pointer.x * 0.12) - cluster.rotation.y) * 0.035;
      cluster.rotation.x += ((-pointer.y * 0.07) - cluster.rotation.x) * 0.035;
      cluster.position.y = (compact ? -1.02 : 0.02) + scrollTarget * 0.7;
      cluster.rotation.z = scrollTarget * -0.08;
      cards.forEach((card, index) => applyState(card, index, elapsed));
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
      cards.forEach(disposeCard);
      loadedTextures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="hero-scene" ref={mountRef} aria-hidden="true">
      <img className="hero-scene-fallback" src="/assets/wuji-business-desktop.png" alt="" />
      <span className="hero-scene-axis hero-scene-axis-x" />
      <span className="hero-scene-axis hero-scene-axis-y" />
    </div>
  );
}

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import focusPlanDesktopImage from './assets/focus-plan-concept-desktop.png';
import focusPlanMobileImage from './assets/focus-plan-concept-mobile.png';

const panels = [
  { src: '/assets/wuji-business-desktop.png', size: [1.75, 1.1], position: [-1.95, 1.55, -0.9], rotation: [-0.18, 0.42, -0.08] },
  { src: focusPlanDesktopImage, size: [1.6, 1], position: [2.05, -1.55, -0.8], rotation: [0.22, -0.25, 0.12] },
  { src: '/assets/wuji-family-mobile.png', size: [0.7, 1.5], position: [-1.95, -1.2, 0.45], rotation: [0.04, 0.5, -0.14] },
  { src: focusPlanMobileImage, size: [0.66, 1.43], position: [2.05, 1.35, 0.55], rotation: [-0.12, -0.34, 0.1] },
  { src: focusPlanDesktopImage, size: [1.15, 0.72], position: [-0.1, -2.18, -0.45], rotation: [0.2, 0.58, -0.2] },
  { src: '/assets/wuji-business-desktop.png', size: [1.1, 0.69], position: [0.15, 2.18, -0.35], rotation: [-0.28, -0.52, 0.2] }
];

const shards = [
  { position: [-1.7, 1.9, 0.2], rotation: [0.5, 0.2, -0.1], color: 0xd7ad59 },
  { position: [2.1, 0.4, -0.1], rotation: [-0.25, 0.5, 0.8], color: 0x75cbd0 },
  { position: [-0.2, -2.15, 0.35], rotation: [0.4, -0.6, 0.2], color: 0xc193b2 },
  { position: [0.65, 2.75, -0.4], rotation: [0.2, 0.75, -0.35], color: 0xd7df7a }
];

function createPanel(texture, config, anisotropy) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;

  const geometry = new THREE.BoxGeometry(config.size[0], config.size[1], 0.055);
  const sideMaterial = new THREE.MeshBasicMaterial({ color: 0x252c29 });
  const faceMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, [sideMaterial, sideMaterial, sideMaterial, sideMaterial, faceMaterial, sideMaterial]);
  mesh.position.set(...config.position);
  mesh.rotation.set(...config.rotation);
  mesh.userData.basePosition = [...config.position];
  mesh.userData.baseRotation = [...config.rotation];

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xc9d0cc, transparent: true, opacity: 0.28 })
  );
  mesh.add(edges);
  return mesh;
}

function createSquareTexture(texture, anisotropy) {
  const image = texture.image;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  context.fillStyle = '#0b0e0d';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  context.strokeStyle = 'rgba(235, 241, 237, .32)';
  context.lineWidth = 3;
  context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
  const squareTexture = new THREE.CanvasTexture(canvas);
  squareTexture.colorSpace = THREE.SRGBColorSpace;
  squareTexture.anisotropy = anisotropy;
  texture.dispose();
  return squareTexture;
}

function createArchiveCube(textures) {
  const geometry = new THREE.BoxGeometry(1.9, 1.9, 1.9);
  const materials = textures.slice(0, 6).map((texture) => new THREE.MeshBasicMaterial({ map: texture }));
  const cube = new THREE.Mesh(geometry, materials);
  cube.position.set(0.08, 0.08, 0.15);
  cube.rotation.set(-0.18, 0.7, 0.08);
  cube.userData.basePosition = [0, 0, 0];
  cube.userData.baseRotation = [-0.18, 0.7, 0.08];
  cube.userData.isArchiveCube = true;

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xe3e9e5, transparent: true, opacity: 0.56 })
  );
  cube.add(edges);
  return cube;
}

function createShard(config) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    -0.62, -0.42, 0,
    0.72, -0.18, 0,
    0.06, 0.72, 0
  ], 3));
  geometry.computeVertexNormals();
  const material = new THREE.MeshBasicMaterial({
    color: config.color,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...config.position);
  mesh.rotation.set(...config.rotation);
  mesh.userData.basePosition = [...config.position];
  mesh.userData.baseRotation = [...config.rotation];
  return mesh;
}

export default function HeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 680px)').matches;
    let disposed = false;
    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      mount.dataset.sceneStatus = 'fallback';
      return undefined;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.75));
    renderer.domElement.className = 'hero-scene-canvas';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    const cluster = new THREE.Group();
    cluster.position.set(compact ? 0.55 : 1.8, compact ? -0.85 : 0.15, 0);
    cluster.scale.setScalar(compact ? 0.68 : 1);
    scene.add(cluster);

    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const meshes = [];
    const textures = [];
    const cubeTextures = [];
    const cubeSources = panels.map((panel) => panel.src);

    panels.slice(0, compact ? 2 : panels.length).forEach((config) => {
      textureLoader.load(config.src, (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        textures.push(texture);
        const mesh = createPanel(texture, config, maxAnisotropy);
        meshes.push(mesh);
        cluster.add(mesh);
        renderer.render(scene, camera);
      });
    });

    cubeSources.forEach((src) => {
      textureLoader.load(src, (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        cubeTextures.push(createSquareTexture(texture, maxAnisotropy));
        if (cubeTextures.length === cubeSources.length) {
          const cube = createArchiveCube(cubeTextures);
          meshes.push(cube);
          cluster.add(cube);
          renderer.render(scene, camera);
        }
      });
    });

    shards.slice(0, compact ? 2 : shards.length).forEach((config) => {
      const shard = createShard(config);
      meshes.push(shard);
      cluster.add(shard);
    });

    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
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

    function handlePointerMove(event) {
      if (reducedMotion || event.pointerType === 'touch') return;
      pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * 2;
    }

    function handleScroll() {
      scrollTarget = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    }

    function renderFrame() {
      frame = 0;
      if (!visible) return;

      pointer.lerp(pointerTarget, 0.045);
      cluster.rotation.y += ((pointer.x * 0.12) - cluster.rotation.y) * 0.035;
      cluster.rotation.x += ((-pointer.y * 0.07) - cluster.rotation.x) * 0.035;
      cluster.position.y = (compact ? -0.85 : 0.15) + scrollTarget * 0.7;
      cluster.rotation.z = scrollTarget * -0.08;

      if (!reducedMotion) {
        const elapsed = clock.getElapsedTime();
        meshes.forEach((mesh, index) => {
          const basePosition = mesh.userData.basePosition;
          const baseRotation = mesh.userData.baseRotation;
          mesh.position.y = basePosition[1] + Math.sin(elapsed * 0.42 + index * 0.9) * 0.045;
          if (mesh.userData.isArchiveCube) {
            mesh.rotation.x = baseRotation[0] + Math.sin(elapsed * 0.18) * 0.04;
            mesh.rotation.y = baseRotation[1] + elapsed * 0.16;
            mesh.rotation.z = baseRotation[2] + Math.sin(elapsed * 0.24) * 0.018;
          } else {
            mesh.rotation.z = baseRotation[2] + Math.sin(elapsed * 0.28 + index) * 0.012;
          }
        });
      }

      renderer.render(scene, camera);
      if (!reducedMotion) frame = window.requestAnimationFrame(renderFrame);
    }

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) renderFrame();
      if (!visible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { threshold: 0.01 });

    resizeObserver.observe(mount);
    visibilityObserver.observe(mount);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    resize();
    handleScroll();
    renderFrame();
    mount.dataset.sceneStatus = 'ready';

    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      textures.forEach((texture) => texture.dispose());
      meshes.forEach((mesh) => {
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => material?.dispose());
        mesh.children.forEach((child) => {
          child.geometry?.dispose();
          child.material?.dispose();
        });
      });
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

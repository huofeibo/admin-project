const images = [
  '/assets/wuji-business-desktop.png',
  '/assets/wuji-business-mobile.png',
  '/assets/wuji-family-mobile.png',
  '/src/assets/focus-plan-concept-desktop.png',
  '/src/assets/focus-plan-concept-mobile.png',
  'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82'
];

function fill(selector) {
  const container = document.querySelector(selector);
  if (!container) return [];
  images.forEach((src) => {
    const image = document.createElement('img');
    image.className = container.dataset.cardClass || 'demo-card';
    image.src = src;
    image.alt = '';
    image.draggable = false;
    container.appendChild(image);
  });
  return [...container.children];
}

function enableDrag(container, onDelta) {
  let lastX = 0;
  let active = false;
  container.addEventListener('pointerdown', (event) => { active = true; lastX = event.clientX; container.setPointerCapture?.(event.pointerId); });
  container.addEventListener('pointermove', (event) => { if (!active) return; onDelta(event.clientX - lastX); lastX = event.clientX; });
  container.addEventListener('pointerup', () => { active = false; });
  container.addEventListener('pointercancel', () => { active = false; });
}

function orbitDemo() {
  const container = document.querySelector('[data-orbit]');
  const cards = fill('[data-orbit]');
  if (!container || !cards.length) return;
  let rotation = 0;
  let target = 0;
  const render = () => {
    rotation += (target - rotation) * .1;
    const radius = innerWidth < 680 ? 118 : 238;
    const depth = innerWidth < 680 ? 56 : 114;
    cards.forEach((card, index) => {
      const angle = index / cards.length * Math.PI * 2 + rotation;
      const front = (Math.cos(angle) + 1) / 2;
      const focus = front * front * (3 - 2 * front);
      card.style.transform = `translate3d(calc(-50% + ${Math.sin(angle) * radius}px), calc(-50% + ${(index % 3 - 1) * 7}px), ${Math.cos(angle) * depth}px) rotateY(${-Math.sin(angle) * 28}deg) scale(${.66 + focus * .34})`;
      card.style.opacity = .4 + focus * .6;
      card.style.zIndex = Math.round(focus * 20);
    });
    requestAnimationFrame(render);
  };
  enableDrag(container, (delta) => { target += delta * .008; });
  render();
}

function prismDemo() {
  const container = document.querySelector('[data-prism]');
  const cards = fill('[data-prism]');
  if (!container || !cards.length) return;
  let rotation = 0;
  let target = 0;
  const render = () => {
    rotation += (target - rotation) * .09;
    cards.forEach((card, index) => {
      const offset = index - (cards.length - 1) / 2;
      const angle = offset * .28 + rotation;
      const x = offset * (innerWidth < 680 ? 62 : 116);
      const z = Math.cos(angle) * 150 - Math.abs(offset) * 18;
      const y = Math.sin(angle) * 25 + offset * 8;
      card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${angle * 28}deg) rotateZ(${offset * -2}deg) scale(${1 - Math.abs(offset) * .035})`;
      card.style.opacity = Math.max(.3, 1 - Math.abs(offset) * .1);
      card.style.zIndex = 20 - Math.abs(Math.round(offset));
    });
    requestAnimationFrame(render);
  };
  enableDrag(container, (delta) => { target += delta * .006; });
  render();
}

function tunnelDemo() {
  const container = document.querySelector('[data-tunnel]');
  const cards = fill('[data-tunnel]');
  if (!container || !cards.length) return;
  let progress = 0;
  let drag = 0;
  const render = () => {
    progress += .0018;
    const spacing = innerWidth < 680 ? 92 : 132;
    const total = cards.length * spacing;
    cards.forEach((card, index) => {
      let y = ((index * spacing + progress * total + drag) % total) - total / 2;
      const depth = Math.max(0, 1 - Math.abs(y) / (total / 2));
      const z = depth * 330 - 140;
      const scale = .48 + depth * .65;
      card.style.transform = `translate3d(-50%, calc(-50% + ${y}px), ${z}px) rotateX(${y * -.035}deg) scale(${scale})`;
      card.style.opacity = .1 + depth * .9;
      card.style.zIndex = Math.round(depth * 20);
    });
    requestAnimationFrame(render);
  };
  enableDrag(container, (delta) => { drag += delta * 1.2; });
  render();
}

orbitDemo();
prismDemo();
tunnelDemo();

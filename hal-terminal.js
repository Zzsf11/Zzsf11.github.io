// The portrait lens is an optional detail in the local HAL homepage theme.
(() => {
  if (new URLSearchParams(location.search).get('theme') !== 'hal') return;

  document.getElementById('publications-heading').hidden = false;
  for (const badge of document.querySelectorAll('.paper-resource img[src*="img.shields.io/github/stars/"]')) {
    const showLinkText = () => badge.replaceWith('GitHub');
    if (badge.complete && !badge.naturalWidth) showLinkText();
    else badge.addEventListener('error', showLinkText, {once: true});
  }
  const lens = document.getElementById('hal-lens');
  const canvas = lens.querySelector('canvas');
  const pen = canvas.getContext('2d');
  if (!pen) return;
  lens.hidden = false;

  // Draw the amber text once. Only the reflection and red glass move.
  const plate = document.createElement('canvas');
  plate.width = plate.height = canvas.width;
  const ink = plate.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  ink.fillStyle = '#171615';
  ink.fillRect(0, 0, size, size);
  ink.font = '6px Menlo, Consolas, monospace';
  ink.textAlign = 'center';
  ink.textBaseline = 'middle';
  const marks = '.:-+=#@';
  for (let y = 3; y < size; y += 5) {
    for (let x = 2; x < size; x += 3.5) {
      const dx = x - center, dy = y - center;
      const radius = Math.hypot(dx, dy);
      const ring = Math.exp(-((radius - 39) ** 2) / 20) + .5 * Math.exp(-((radius - 30) ** 2) / 9);
      const highlight = .54 + .42 * Math.cos(Math.atan2(dy, dx) + 2.1);
      const light = Math.min(1, ring * highlight);
      if (light < .045) continue;
      ink.fillStyle = 'rgba(241,194,122,' + (.24 + light * .76) + ')';
      ink.fillText(marks[Math.round(light * (marks.length - 1))], x, y);
    }
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true, frame = 0, last = null, phase = 0;
  let aimX = 0, aimY = 0, eyeX = 0, eyeY = 0, near = false;

  function draw() {
    pen.drawImage(plate, 0, 0);
    const x = center + eyeX, y = center + eyeY;
    const radius = 15 + Math.sin(phase * 1.3) * 1.8;
    const glow = pen.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, '#fff0a6');
    glow.addColorStop(.17, '#ffad44');
    glow.addColorStop(.36, '#ff512e');
    glow.addColorStop(.65, '#ac2c1c');
    glow.addColorStop(1, 'rgba(128,32,20,0)');
    pen.fillStyle = glow;
    pen.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    pen.fillStyle = '#fff0bb';
    pen.font = 'bold 6px Menlo, Consolas, monospace';
    pen.textAlign = 'center';
    pen.textBaseline = 'middle';
    pen.fillText('+', x, y);
  }
  function render(stamp) {
    if (last === null || stamp - last >= 40) {
      const dt = last === null ? 0 : Math.min((stamp - last) / 1000, .12);
      last = stamp;
      phase += dt;
      const follow = 1 - Math.exp(-dt * 10);
      eyeX += ((near ? aimX : 2.6 * Math.sin(phase * .65)) - eyeX) * follow;
      eyeY += ((near ? aimY : 1.7 * Math.sin(phase * .43)) - eyeY) * follow;
      draw();
    }
    frame = requestAnimationFrame(render);
  }
  function sync() {
    cancelAnimationFrame(frame);
    last = null;
    if (reduced.matches) {
      eyeX = eyeY = phase = 0;
      draw();
    } else if (visible && !document.hidden) {
      frame = requestAnimationFrame(render);
    }
  }
  function track(event) {
    if (event.pointerType === 'touch' || !visible || reduced.matches || document.hidden) return;
    const box = lens.getBoundingClientRect();
    const dx = event.clientX - box.left - box.width / 2;
    const dy = event.clientY - box.top - box.height / 2;
    const distance = Math.hypot(dx, dy);
    near = distance < 190;
    if (!near) return;
    const scale = 10 / Math.max(26, distance);
    aimX = dx * scale;
    aimY = dy * scale;
  }
  window.addEventListener('pointermove', track, {passive: true});
  document.documentElement.addEventListener('pointerleave', () => { near = false; });
  window.addEventListener('scroll', () => { near = false; }, {passive: true});
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(lens);
  draw();
  sync();
})();

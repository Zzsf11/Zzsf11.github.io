// Keep the navigation marker on the chapter that has reached the masthead.
(() => {
  if (document.documentElement.dataset.theme === 'hal') return;
  // Keep a usable repository label while the external Stars badge loads.
  for (const image of document.querySelectorAll('.paper-resource img')) {
    const showBadge = () => image.parentElement.toggleAttribute('data-badge-ready', image.naturalWidth > 0);
    image.addEventListener('load', showBadge, {once: true});
    if (image.complete) showBadge();
  }
  const header = document.querySelector('.masthead');
  const chapters = [...header.querySelectorAll('a')].map(link => ({
    link,
    heading: document.getElementById(link.hash.slice(1))
  }));
  let pending = false;
  function update() {
    const line = header.offsetHeight + 48;
    let current = chapters[0];
    for (const chapter of chapters.slice(1)) {
      if (chapter.heading.getBoundingClientRect().top <= line) current = chapter;
    }
    if (window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight) {
      current = chapters[chapters.length - 1];
    }
    for (const {link} of chapters) {
      if (link === current.link) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    pending = false;
  }
  function schedule() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  update();
})();

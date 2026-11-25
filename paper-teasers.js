// Play muted previews only while their cards are visible.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const visibleVideos = new Set();

function syncVideo(video) {
  if (visibleVideos.has(video) && !document.hidden && !reducedMotion.matches) {
    // The poster remains visible if the browser blocks autoplay.
    video.play().catch(() => {});
  } else {
    video.pause();
  }
}

const observer = new IntersectionObserver(entries => {
  for (const { target: video, isIntersecting } of entries) {
    if (isIntersecting) visibleVideos.add(video);
    else visibleVideos.delete(video);
    syncVideo(video);
  }
});

for (const video of document.querySelectorAll('.paper-teaser video')) {
  observer.observe(video);
}
document.addEventListener('visibilitychange', () => visibleVideos.forEach(syncVideo));
reducedMotion.addEventListener('change', () => visibleVideos.forEach(syncVideo));

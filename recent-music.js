// The provider also serves failures as valid SVG images with HTTP status 200.
async function loadRecentMusic() {
  const card = document.querySelector('.recent-music');
  const image = card.querySelector('img');
  const preview = document.querySelector('.music-preview');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let objectURL;
  try {
    const response = await fetch(image.dataset.cardUrl, { signal: controller.signal, credentials: 'omit' });
    if (!response.ok) return;
    const svg = await response.text();
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
    const title = doc.querySelector('.song-title')?.textContent.trim();
    if (doc.documentElement.localName !== 'svg' || !title) return;
    objectURL = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    image.src = objectURL;
    await image.decode();
    image.alt = [title, doc.querySelector('.song-artist')?.textContent.trim()].filter(Boolean).join(' — ');
    preview.hidden = true;
    card.hidden = false;
  } catch {
    // The public player stays available if the personal card cannot be loaded.
  } finally {
    clearTimeout(timeout);
    if (objectURL) URL.revokeObjectURL(objectURL);
  }
}
loadRecentMusic();

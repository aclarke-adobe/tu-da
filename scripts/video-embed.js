/*
 * Shared video embed helpers used by embed-video and cards-video.
 */

/**
 * Build an iframe src for a YouTube or Vimeo URL; null when not a known video host.
 * @param {string} href
 * @param {boolean} autoplay
 * @returns {{src: string, provider: string}|null}
 */
export function videoSource(href, autoplay = false) {
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch (e) {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');
  if (host.includes('youtube.com') || host === 'youtu.be' || host.includes('youtube-nocookie.com')) {
    let id = url.searchParams.get('v');
    if (!id && host === 'youtu.be') [, id] = url.pathname.split('/');
    if (!id) {
      const m = url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/);
      if (m) [, id] = m;
    }
    if (!id) return null;
    const params = new URLSearchParams({ rel: '0' });
    if (autoplay) {
      params.set('autoplay', '1');
      params.set('mute', '1');
    }
    return { provider: 'youtube', src: `https://www.youtube.com/embed/${encodeURIComponent(id)}?${params}` };
  }
  if (host.includes('vimeo.com')) {
    const id = url.pathname.split('/').filter(Boolean).find((p) => /^\d+$/.test(p));
    if (!id) return null;
    const suffix = autoplay ? '?autoplay=1&muted=1' : '';
    return { provider: 'vimeo', src: `https://player.vimeo.com/video/${id}${suffix}` };
  }
  return null;
}

/**
 * Create a responsive 16:9 iframe element.
 * @param {string} src
 * @param {string} title
 * @returns {HTMLIFrameElement}
 */
export function createVideoFrame(src, title = 'Embedded video') {
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope';
  return iframe;
}

/**
 * Run cb once when el first scrolls into view.
 * @param {Element} el
 * @param {Function} cb
 */
export function whenVisible(el, cb) {
  if (!('IntersectionObserver' in window)) {
    cb();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      cb();
    }
  }, { rootMargin: '200px' });
  observer.observe(el);
}

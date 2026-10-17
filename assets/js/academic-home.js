/* Optional enhancements. All academic content remains readable without JS. */
(() => {
  'use strict';
  const filters = [...document.querySelectorAll('[data-filter]')];
  const papers = [...document.querySelectorAll('[data-publication-type]')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const selected = button.dataset.filter;
    papers.forEach(paper => { paper.hidden = selected !== 'all' && paper.dataset.publicationType !== selected; });
  }));

  const links = [...document.querySelectorAll('.top-nav a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const current = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', current);
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }

  const toggle = document.querySelector('[data-walk-toggle]');
  if (!toggle) return;
  const token = document.querySelector('[data-walk-token]');
  const trail = document.querySelector('[data-walk-trail]');
  const state = document.querySelector('[data-walk-status]');
  const label = document.querySelector('[data-walk-label]');
  const icon = toggle.querySelector('.play-icon');
  const positions = [[55,117],[119,56],[127,190],[184,117],[249,56],[251,191],[310,125]];
  // A fixed illustrative walk. Every consecutive pair shares a drawn edge.
  const walk = [1,4,6,5,2,0,3,4,1,0,2,5,3,6,4,3,0];
  let step = 0;
  let timer = null;
  const tick = () => {
    const from = positions[walk[step % walk.length]];
    step = (step + 1) % walk.length;
    const to = positions[walk[step]];
    token.setAttribute('transform', `translate(${to[0]} ${to[1]})`);
    trail.setAttribute('d', `M${from[0]} ${from[1]} L${to[0]} ${to[1]}`);
    state.textContent = `Node ${walk[step] + 1}`;
  };
  const pause = () => {
    window.clearInterval(timer);
    timer = null;
    toggle.setAttribute('aria-pressed', 'false');
    label.textContent = 'Animate walk';
    icon.textContent = '▶';
  };
  toggle.addEventListener('click', () => {
    if (timer !== null) { pause(); return; }
    toggle.setAttribute('aria-pressed', 'true');
    label.textContent = 'Pause animation';
    icon.textContent = 'Ⅱ';
    tick();
    timer = window.setInterval(tick, 1150);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
})();

const root = document.documentElement;

// theme
const themeBtn = document.getElementById('theme');
const showTheme = () => { themeBtn.textContent = root.dataset.theme === 'dark' ? 'Light' : 'Dark'; };
themeBtn.addEventListener('click', () => {
  const dark = root.dataset.theme !== 'dark';
  if (dark) root.dataset.theme = 'dark'; else delete root.dataset.theme;
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  showTheme();
});
showTheme();

// pages
const views = [...document.querySelectorAll('.view')];
const links = [...document.querySelectorAll('.nav nav a')];
let jumpTo = null;

function show() {
  const view = views.find(v => '#' + v.dataset.page === location.hash) || views[0];
  views.forEach(v => { v.hidden = v !== view; });
  links.forEach(a => a.classList.toggle('on', a.hash === '#' + view.dataset.page));
  document.title = links.find(a => a.hash === '#' + view.dataset.page).textContent;
  if (jumpTo) document.getElementById(jumpTo).scrollIntoView();
  else window.scrollTo(0, 0);
  jumpTo = null;
}
addEventListener('hashchange', show);
show();

// home cards open their project
document.querySelectorAll('.card[data-to]').forEach(card => {
  card.addEventListener('click', () => { jumpTo = card.dataset.to; });
});

// reveal on scroll
const seen = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); seen.unobserve(e.target); }
}, { threshold: 0.1 });
document.querySelectorAll('.block, .work, .timeline li, .certs li').forEach(el => {
  el.classList.add('reveal');
  seen.observe(el);
});

// portfolio filter
const filters = document.getElementById('filters');
filters.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  filters.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === btn));
  document.querySelectorAll('.work').forEach(w => {
    w.hidden = btn.dataset.filter !== 'all' && w.dataset.group !== btn.dataset.filter;
  });
});

// screenshot viewer
const viewer = document.getElementById('viewer');
document.querySelectorAll('.gallery figure').forEach(fig => {
  fig.addEventListener('click', () => {
    viewer.querySelector('img').src = fig.querySelector('img').src;
    viewer.querySelector('p').textContent = fig.querySelector('figcaption').textContent;
    viewer.showModal();
  });
});
viewer.addEventListener('click', () => viewer.close());

// card tilt, mouse only
if (matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.classList.add('tilting');
      card.style.setProperty('--ry', (x - 0.5) * 8 + 'deg');
      card.style.setProperty('--rx', (0.5 - y) * 8 + 'deg');
      card.style.setProperty('--gx', x * 100 + '%');
      card.style.setProperty('--gy', y * 100 + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilting');
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
}

/* script.js */

// ===========================
// LOADER
// ===========================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('done');
    document.querySelectorAll('.name-line').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 900 + (i * 150));
    });
  }, 1400);
});

// ===========================
// CUSTOM CURSOR
// ===========================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (window.matchMedia('(pointer: fine)').matches && cursor && follower) {
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  const followCursor = () => {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(followCursor);
  };
  followCursor();

  document.querySelectorAll('a, button, .cert-img-wrap').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      follower.style.width = '50px';
      follower.style.height = '50px';
      follower.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.width = '30px';
      follower.style.height = '30px';
      follower.style.opacity = '0.6';
    });
  });
}

// ===========================
// NAV — scroll class
// ===========================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===========================
// HAMBURGER / MOBILE MENU
// ===========================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===========================
// SCROLL REVEAL
// ===========================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ===========================
// PHOTO SLIDER
// ===========================
const sliderState = {};

function slidePhoto(id, direction) {
  const slider = document.getElementById(id);
  if (!slider) return;
  const slides = slider.querySelectorAll('.photo-slide');
  if (!sliderState[id]) sliderState[id] = 0;
  sliderState[id] += direction;
  if (sliderState[id] < 0) sliderState[id] = slides.length - 1;
  if (sliderState[id] >= slides.length) sliderState[id] = 0;
  slider.style.transform = `translateX(-${sliderState[id] * 100}%)`;
}

document.querySelectorAll('.pcard').forEach(card => {
  let timer;
  const sliderId = card.querySelector('.photo-slider')?.id;
  if (!sliderId) return;
  card.addEventListener('mouseenter', () => {
    timer = setInterval(() => slidePhoto(sliderId, 1), 2500);
  });
  card.addEventListener('mouseleave', () => clearInterval(timer));
});

// ===========================
// SMOOTH ACTIVE NAV
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--blue)' : '';
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

// ===========================
// LIGHTBOX
// ===========================
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxBd   = document.getElementById('lightbox-backdrop');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  // Delay clearing src to avoid flash
  setTimeout(() => { lightboxImg.src = ''; }, 400);
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBd.addEventListener('click', closeLightbox);

// Close on ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});
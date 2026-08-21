// ── CASE STUDY PAGE JS ────────────────────────────────

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Fade in elements on scroll
const fadeEls = document.querySelectorAll('.cs-two-col, .cs-overview__inner, .cs-stats, .cs-results__intro');

fadeEls.forEach(el => el.classList.add('cs-fade'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => fadeObserver.observe(el));

// Nav scroll behaviour
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile menu
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = !mobileMenu.hidden;
    mobileMenu.hidden = isOpen;
    hamburger.setAttribute('aria-expanded', !isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.hidden = true;
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

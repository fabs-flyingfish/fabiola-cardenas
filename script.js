if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  setCurrentYear();
  initNavScroll();
  initGrainCanvas();
  initFadeUp();
  initNavActiveState();
  initSmoothAnchorScroll();
  initMobileMenu();
});

// ── PRELOADER ─────────────────────────────────────────

const preloader = document.getElementById('preloader');
const preloaderCount = document.getElementById('preloader-count');
const clipRect = document.getElementById('preloader-clip-rect');
const totalHeight = 235.503;

let startTime = null;
const duration = 2500;

function animatePreloader(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  const progress = Math.min(elapsed / duration, 1);

  // Ease out cubic
  const eased = 1 - Math.pow(1 - progress, 3);

  // Update percentage counter
  const percent = Math.round(eased * 100);
  if (preloaderCount) preloaderCount.textContent = percent + '%';

  // Update clip rect — grows from bottom to top
  // y moves up, height increases
  const fillHeight = eased * totalHeight;
  const fillY = totalHeight - fillHeight;
  if (clipRect) {
    clipRect.setAttribute('y', fillY);
    clipRect.setAttribute('height', fillHeight);
  }

  if (progress < 1) {
    requestAnimationFrame(animatePreloader);
  } else {
    // Complete — fade out preloader
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('hidden');
        triggerHeroAnimation();
        preloader.addEventListener('transitionend', () => {
          preloader.style.display = 'none';
        }, { once: true });
      }
    }, 300);
  }
}

requestAnimationFrame(animatePreloader);

/* Hero entrance — staggered fade/slide in after preloader */
function triggerHeroAnimation() {
  const heroHeadline = document.querySelector('.hero-headline');
  const heroSubline = document.querySelector('.hero-subline');
  const heroBtns = document.querySelector('.hero-btns');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  [heroHeadline, heroSubline, heroBtns, scrollIndicator].forEach(el => {
    if (el) el.classList.add('animate');
  });
}

// ── HERO FLOATING BLOCKS ──────────────────────────────

const mosaicContainer = document.querySelector('.hero-mosaic');

if (mosaicContainer) {

  // Define 7 blocks — position, size, image or colour, and parallax speed
  const blocks = [
    {
      src: 'images/Fabs.png',
      width: 180,
      height: 220,
      top: 8,
      left: 4,
      speed: 0.03
    },
    {
      src: 'biffa/images/carousel-card.png',
      width: 220,
      height: 160,
      top: 12,
      right: 6,
      speed: 0.05
    },
    {
      src: 'honda/images/carousel-card.png',
      width: 200,
      height: 150,
      bottom: 15,
      left: 6,
      speed: 0.04
    },
    {
      src: 'ee/images/carousel-card.png',
      width: 180,
      height: 140,
      bottom: 10,
      right: 5,
      speed: 0.06
    },
    {
      src: 'toyota/images/carousel-card.png',
      width: 160,
      height: 130,
      top: 55,
      left: 2,
      speed: 0.025
    },
    {
      src: 'images/Fabs.png',
      width: 140,
      height: 170,
      top: 45,
      right: 3,
      speed: 0.045
    },
    {
      colour: '#39FF14',
      width: 80,
      height: 80,
      top: 25,
      right: 18,
      speed: 0.07
    }
  ];

  // Create and position each block
  const blockEls = blocks.map(block => {
    const el = document.createElement('div');
    el.className = 'mosaic-block';
    el.style.width = block.width + 'px';
    el.style.height = block.height + 'px';

    // Position
    if (block.top !== undefined) el.style.top = block.top + '%';
    if (block.bottom !== undefined) el.style.bottom = block.bottom + '%';
    if (block.left !== undefined) el.style.left = block.left + '%';
    if (block.right !== undefined) el.style.right = block.right + '%';

    if (block.colour) {
      el.classList.add('mosaic-block--colour');
      el.style.background = block.colour;
    } else {
      el.style.background = '#e0e0e0';
      const img = document.createElement('img');
      img.src = block.src;
      img.alt = '';
      el.appendChild(img);
    }

    mosaicContainer.appendChild(el);
    return { el, speed: block.speed, currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
  });

  // Mouse parallax
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (e.clientY > rect.bottom) return;

    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    blockEls.forEach(b => {
      b.targetX = mouseX * -40 * b.speed * 30;
      b.targetY = mouseY * -40 * b.speed * 30;
    });
  });

  // Give each block a unique idle float cycle
  blockEls.forEach((b, i) => {
    b.idleAngle = Math.random() * Math.PI * 2; // random start phase
    b.idleSpeed = 0.003 + Math.random() * 0.002; // slightly different speed per block
    b.idleRange = 6 + Math.random() * 6; // how far it drifts
  });

  function animateBlocks(timestamp) {
    blockEls.forEach(b => {
      // Lerp toward mouse target
      b.currentX += (b.targetX - b.currentX) * 0.06;
      b.currentY += (b.targetY - b.currentY) * 0.06;

      // Add idle float on top — sine wave per block
      b.idleAngle += b.idleSpeed;
      const idleX = Math.sin(b.idleAngle) * b.idleRange;
      const idleY = Math.cos(b.idleAngle * 0.7) * b.idleRange;

      b.el.style.transform = `translate(${b.currentX + idleX}px, ${b.currentY + idleY}px)`;
    });
    requestAnimationFrame(animateBlocks);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(ts => animateBlocks(ts));
  }
}

/* Custom cursor */
const darkSectionIds = ['#work', '#about', '#contact', '#footer', '#contact-modal'];
const darkSectionClasses = ['cs-hero', 'cs-section--dark', 'cs-results', 'cs-next'];
const lightSectionIds = ['#hero', '#writing'];
const lightSectionClasses = ['cs-overview', 'cs-section'];

function updateCursorTheme(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return;

  // Walk up the DOM to find the nearest section or known dark container
  let node = el;
  let isDark = false;

  while (node && node !== document.body) {
    const id = node.id ? '#' + node.id : '';

    if (darkSectionIds.includes(id)) {
      isDark = true;
      break;
    }
    if (lightSectionIds.includes(id)) {
      isDark = false;
      break;
    }

    // Check class names for case study sections
    if (darkSectionClasses.some(cls => node.classList.contains(cls))) {
      isDark = true;
      break;
    }
    if (lightSectionClasses.some(cls => node.classList.contains(cls))) {
      isDark = false;
      break;
    }

    // Fallback: computed background luminance
    const bg = window.getComputedStyle(node).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      const match = bg.match(/\d+/g);
      if (match) {
        const [r, g, b] = match.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        isDark = luminance < 0.4;
        break;
      }
    }

    node = node.parentElement;
  }

  const cursorEl = document.getElementById('cursor');
  if (cursorEl) {
    cursorEl.classList.toggle('cursor-dark', isDark);
  }
}

function initCursor() {
  const cursor = document.getElementById('cursor');
  const lerpFactor = 0.12;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let renderX = targetX;
  let renderY = targetY;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    updateCursorTheme(e.clientX, e.clientY);
  });

  function render() {
    renderX += (targetX - renderX) * lerpFactor;
    renderY += (targetY - renderY) * lerpFactor;

    cursor.style.transform = `translate(calc(${renderX}px - 50%), calc(${renderY}px - 50%))`;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  const hoverSelector = 'a, button, [role="button"]';

  document.addEventListener('mouseenter', (e) => {
    if (e.target.closest && e.target.closest(hoverSelector)) {
      document.body.classList.add('cursor-hover');
    }
  }, true);

  document.addEventListener('mouseleave', (e) => {
    if (e.target.closest && e.target.closest(hoverSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  }, true);

  document.querySelectorAll('.accordion-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-view');
    });
    item.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-view');
    });
  });
}

/* Footer year */
function setCurrentYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* Nav scroll behaviour */
function initNavScroll() {
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

/* Grain canvas */
function initGrainCanvas() {
  const canvas = document.getElementById('grain-canvas');
  const ctx = canvas.getContext('2d');
  let frameCount = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawGrain() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const shade = Math.random() * 255;
      data[i] = shade;
      data[i + 1] = shade;
      data[i + 2] = shade;
      data[i + 3] = 30 + Math.random() * 30;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function loop() {
    if (frameCount % 3 === 0) {
      drawGrain();
    }
    frameCount++;
    requestAnimationFrame(loop);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  requestAnimationFrame(loop);
}

// ── WORK SECTION — STICKY STACK ──────────────────────

const workSection = document.getElementById('work');
const accordion = document.getElementById('work-accordion');
const accordionItems = document.querySelectorAll('.accordion-item');
const progressCurrent = document.querySelector('.progress-current');
const workProgress = document.querySelector('.work-progress');
const workLabel = document.querySelector('.work-label');
const itemCount = accordionItems.length;

// Set CSS variable for item count so accordion height is correct
accordion.style.setProperty('--item-count', itemCount);
accordion.style.height = `calc(${itemCount} * 100vh)`;

// Set background images from data-img attributes
accordionItems.forEach(item => {
  const img = item.getAttribute('data-img');
  if (img) {
    item.querySelector('.accordion-bg').style.backgroundImage = `url('${img}')`;
  }
});

function updateWorkSection() {
  const workTop = workSection.getBoundingClientRect().top;
  const workBottom = workSection.getBoundingClientRect().bottom;
  const windowH = window.innerHeight;

  // Is the work section currently in view
  const inView = workTop < windowH && workBottom > 0;

  // Show/hide label and progress
  if (workLabel) workLabel.classList.toggle('visible', inView);
  if (workProgress) workProgress.classList.toggle('visible', inView);

  if (!inView) return;

  // Calculate which item should be active based on how far we've scrolled into the section
  const scrolledIntoSection = Math.max(0, -workTop);
  const activeIndex = Math.min(
    itemCount - 1,
    Math.floor(scrolledIntoSection / windowH)
  );

  // Update active states
  accordionItems.forEach((item, index) => {
    item.classList.toggle('active', index === activeIndex);
  });

  // Update progress counter
  if (progressCurrent) {
    progressCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
  }
}

window.addEventListener('scroll', updateWorkSection, { passive: true });
updateWorkSection();

// ── ABOUT SECTION ─────────────────────────────────────

const aboutSkills = document.querySelectorAll('.about-skill');
const aboutPhotoWrap = document.querySelector('.about-photo-wrap');
const aboutPhotoGlare = document.querySelector('.about-photo-glare');

// Scroll-driven title fill + block fade in
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  aboutSkills.forEach(skill => {
    skill.style.opacity = '1';
    skill.style.transform = 'translateY(0)';
    const titleEl = skill.querySelector('.about-skill__title');
    if (titleEl) titleEl.style.backgroundPosition = '0% 100%';
  });
} else {
  // Initial state — visible, not fully invisible, before any scroll
  aboutSkills.forEach(skill => {
    skill.style.opacity = '0.8';
    skill.style.transform = 'translateY(16px)';
  });

  function updateAboutSkillFill() {
    aboutSkills.forEach(skill => {
      const rect = skill.getBoundingClientRect();

      // Block fade in/out based on top-edge threshold
      if (rect.top < window.innerHeight * 0.875) {
        skill.style.opacity = '1';
        skill.style.transform = 'translateY(0)';
      } else {
        skill.style.opacity = '0.8';
        skill.style.transform = 'translateY(16px)';
      }

      // Title fill progress
      const titleEl = skill.querySelector('.about-skill__title');
      if (titleEl) {
        const titleRect = titleEl.getBoundingClientRect();

        // Start filling when title is at 75% from top of viewport
        // Complete fill when title reaches 25% from top of viewport
        const startY = window.innerHeight * 0.75;
        const endY = window.innerHeight * 0.25;

        const progress = Math.min(1, Math.max(0, (startY - titleRect.top) / (startY - endY)));

        // background-position: 0% 0% = all grey (top half of gradient)
        // background-position: 0% 100% = all green (bottom half of gradient)
        titleEl.style.backgroundPosition = `0% ${progress * 100}%`;
      }
    });
  }

  window.addEventListener('scroll', updateAboutSkillFill, { passive: true });
  window.addEventListener('resize', updateAboutSkillFill);
  updateAboutSkillFill();
}

// 3D tilt effect on photo
if (aboutPhotoWrap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  aboutPhotoWrap.addEventListener('mousemove', (e) => {
    const rect = aboutPhotoWrap.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const relY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    aboutPhotoWrap.style.transition = 'transform 100ms ease';
    aboutPhotoWrap.style.transform = `perspective(800px) rotateY(${relX * 10}deg) rotateX(${relY * -10}deg) scale(1.02)`;

    if (aboutPhotoGlare) {
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      aboutPhotoGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15), transparent 65%)`;
      aboutPhotoGlare.style.opacity = '1';
    }
  });

  aboutPhotoWrap.addEventListener('mouseleave', () => {
    aboutPhotoWrap.style.transition = 'transform 600ms ease';
    aboutPhotoWrap.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
    if (aboutPhotoGlare) aboutPhotoGlare.style.opacity = '0';
  });
}

// ── WRITING SECTION — FADE IN ON SCROLL ──────────────
const articleRows = document.querySelectorAll('.article-row');

const articleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.2 });

articleRows.forEach((row, i) => {
  row.style.opacity = '0';
  row.style.transform = 'translateY(20px)';
  row.style.transition = `opacity 500ms ease ${i * 100}ms, transform 500ms ease ${i * 100}ms`;
  articleObserver.observe(row);
});

// ── SCROLL FADE-IN (about / contact / footer) ────────
function initFadeUp() {
  const items = document.querySelectorAll('.fade-up');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    items.forEach(item => item.classList.add('in-view'));
    return;
  }

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => fadeObserver.observe(item));
}

// ── NAV ACTIVE STATE ──────────────────────────────────
function initNavActiveState() {
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const navSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0.5) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: [0.5] });

  sections.forEach(section => navSectionObserver.observe(section));
}

// ── SMOOTH ANCHOR SCROLL (accounts for fixed nav height) ──
function initSmoothAnchorScroll() {
  const navHeight = 72;
  const links = document.querySelectorAll('.nav-links a[href^="#"], #mobile-menu a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}

// ── MOBILE NAV ────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!hamburger || !menu) return;

  function openMenu() {
    menu.hidden = false;
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ── CONTACT MODAL ─────────────────────────────────────

const contactModal = document.getElementById('contact-modal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const modalForm = document.querySelector('.modal-form');
const modalSuccess = document.querySelector('.modal-success');

function openModal() {
  contactModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  // Focus the first input after transition
  setTimeout(() => {
    const firstInput = contactModal.querySelector('input:not([type="hidden"])');
    if (firstInput) firstInput.focus();
  }, 400);
}

function closeModal() {
  contactModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

// Open modal on any element with data-open-modal
document.querySelectorAll('[data-open-modal]').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

// Close on X button
if (modalClose) modalClose.addEventListener('click', closeModal);

// Close on overlay click
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !contactModal.hasAttribute('hidden')) {
    closeModal();
  }
});

// Handle Netlify form submission
if (modalForm) {
  modalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(modalForm);
    const submitBtn = modalForm.querySelector('.modal-submit');

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        modalForm.setAttribute('hidden', '');
        modalSuccess.removeAttribute('hidden');
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      submitBtn.textContent = 'Send it';
      submitBtn.disabled = false;
      alert('Something went wrong. Please try emailing me directly at hifabiolacardenas@gmail.com');
    }
  });
}

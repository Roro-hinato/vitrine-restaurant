/* ============================================================
   LE BEFFROI — Brasserie traditionnelle, Bellefontaine
   Script
   ------------------------------------------------------------
   1. Nav qui change d'état au scroll
   2. Menu hamburger sur mobile
   3. Onglets de la carte (entrées / plats / desserts / boissons)
   4. Reveal au scroll via IntersectionObserver
   5. Lightbox galerie (ouverture, navigation, clavier, swipe)
   6. Parallax (hero, about, menu blob)
   ============================================================ */

(() => {
  // ---------- 1. Nav scrolled state ----------
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- 2. Mobile burger ----------
  const burger = document.getElementById('burger');
  burger.addEventListener('click', () => nav.classList.toggle('is-open'));
  document.querySelectorAll('.nav__menu a, .nav__cta').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('is-open'));
  });

  // ---------- 3. Menu tabs ----------
  const tabs = document.querySelectorAll('.menu__tab');
  const panels = document.querySelectorAll('.menu__panel');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('is-active'));
    panels.forEach(p => p.classList.remove('is-active'));
    t.classList.add('is-active');
    document.getElementById(t.dataset.target).classList.add('is-active');
  }));

  // ---------- 4. Reveal on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- 5. Lightbox galerie ----------
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbCap    = document.getElementById('lbCap');
  const lbCount  = document.getElementById('lbCount');
  const lbClose  = document.getElementById('lbClose');
  const lbPrev   = document.getElementById('lbPrev');
  const lbNext   = document.getElementById('lbNext');

  // Build a list of gallery images + their captions
  const figures = Array.from(document.querySelectorAll('.gallery__item'));
  const slides  = figures.map(fig => ({
    src: fig.querySelector('img').src,
    alt: fig.querySelector('img').alt || '',
    cap: fig.querySelector('.cap')?.textContent.trim() || ''
  }));
  let current = 0;

  const show = (i) => {
    current = (i + slides.length) % slides.length;
    const s = slides[current];
    lbImg.src = s.src;
    lbImg.alt = s.alt;
    lbCap.textContent = s.cap;
    lbCount.textContent = `${current + 1} / ${slides.length}`;
  };

  const open = (i) => {
    show(i);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
  };

  // Open on click
  figures.forEach((fig, i) => {
    fig.addEventListener('click', () => open(i));
  });

  // Close: X button + click on backdrop (but not on stage/buttons)
  lbClose.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Prev / Next
  lbPrev.addEventListener('click', () => show(current - 1));
  lbNext.addEventListener('click', () => show(current + 1));

  // Keyboard: Esc / arrows
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Touch: swipe left/right to navigate
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // ---------- 6. Parallax (hero, about, menu blob) ----------
  // Skip entirely if user prefers reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    const heroMedia  = document.querySelector('.hero__media');
    const aboutMedia = document.querySelector('.about__media');
    const menuSection = document.querySelector('.menu');

    // Compute a 0→1 progress as the element travels through the viewport
    const progressOf = (el) => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
    };

    const update = () => {
      const y = window.scrollY;

      // Hero: background drifts at ~50% of scroll speed
      if (heroMedia) {
        heroMedia.style.transform = `translate3d(0, ${y * 0.5}px, 0)`;
      }

      // About image: floats from +40px to -40px as it passes through viewport
      if (aboutMedia) {
        const p = progressOf(aboutMedia);
        const ty = (0.5 - p) * 80;
        aboutMedia.style.transform = `translate3d(0, ${ty}px, 0)`;
      }

      // Menu decorative blob: drifts downward up to 180px
      if (menuSection) {
        const p = progressOf(menuSection);
        menuSection.style.setProperty('--blob-y', `${p * 180}px`);
      }
    };

    // rAF throttling
    let ticking = false;
    const onScrollOrResize = () => {
      if (!ticking) {
        requestAnimationFrame(() => { update(); ticking = false; });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    update();
  }
})();

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
   7. Compteurs animés (section About)
   8. Statut ouvert/fermé live (calculé selon les horaires)
   9. Modale de réservation (formulaire + validation + état succès)
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

  // ---------- 7. Compteurs animés (about features) ----------
  const features = document.getElementById('aboutFeatures');
  if (features) {
    const animateNum = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const from   = parseInt(el.dataset.from || '0', 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const startedAt = performance.now();
      // ease-out cubic
      const ease = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const elapsed = now - startedAt;
        const t = Math.min(1, elapsed / duration);
        const value = Math.round(from + (target - from) * ease(t));
        el.textContent = `${prefix}${value}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.num').forEach(animateNum);
          counterIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counterIO.observe(features);
  }

  // ---------- 8. Statut ouvert/fermé (live) ----------
  // Schedule keyed by JS day (0=Sunday … 6=Saturday)
  // Each entry is an array of [openMinute, closeMinute] service windows
  const SCHEDULE = {
    1: [[12*60, 14*60]],                           // Lundi: 12h-14h
    2: [],                                          // Mardi: fermé
    3: [],                                          // Mercredi: fermé
    4: [[12*60, 15*60], [19*60, 22*60]],           // Jeudi
    5: [[12*60, 15*60], [19*60, 22*60]],           // Vendredi
    6: [[12*60, 15*60], [19*60, 22*60]],           // Samedi
    0: [[12*60, 15*60], [19*60, 22*60]],           // Dimanche
  };
  const DAY_NAMES_SHORT = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  const fmtTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2,'0')}`;
  };

  const computeStatus = (now = new Date()) => {
    const day = now.getDay();
    const minsNow = now.getHours() * 60 + now.getMinutes();
    const todays = SCHEDULE[day] || [];

    // Currently open?
    for (const [open, close] of todays) {
      if (minsNow >= open && minsNow < close) {
        return { open: true, label: 'Ouvert', detail: `Ferme à ${fmtTime(close)}` };
      }
    }
    // Opens later today?
    for (const [open] of todays) {
      if (minsNow < open) {
        return { open: false, label: 'Fermé', detail: `Ouvre à ${fmtTime(open)}` };
      }
    }
    // Find next open day (search up to 7 days ahead)
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      const slots = SCHEDULE[d];
      if (slots && slots.length) {
        const [open] = slots[0];
        const dayLabel = i === 1 ? 'demain' : DAY_NAMES_SHORT[d];
        return { open: false, label: 'Fermé', detail: `Ouvre ${dayLabel} à ${fmtTime(open)}` };
      }
    }
    return { open: false, label: 'Fermé', detail: '' };
  };

  const renderStatus = (el, s) => {
    if (!el) return;
    el.classList.toggle('is-open', s.open);
    el.classList.toggle('is-closed', !s.open);
    const text = el.querySelector('.status__text');
    if (text) text.innerHTML = `<strong>${s.label}</strong>${s.detail ? ' · ' + s.detail : ''}`;
  };

  const heroStatus    = document.getElementById('heroStatus');
  const contactStatus = document.getElementById('contactStatus');
  const updateAllStatus = () => {
    const s = computeStatus();
    renderStatus(heroStatus, s);
    renderStatus(contactStatus, s);
  };
  updateAllStatus();
  // Refresh every minute so status updates live without reload
  setInterval(updateAllStatus, 60 * 1000);

  // ---------- 9. Modale de réservation ----------
  const booking      = document.getElementById('booking');
  const bookForm     = document.getElementById('bookForm');
  const bookSuccess  = document.getElementById('bookSuccess');
  const bookClose    = document.getElementById('bookClose');
  const bookSuccClose= document.getElementById('bookSuccessClose');
  const bookDate     = document.getElementById('bookDate');

  const openBooking = () => {
    // Default the date to tomorrow, restrict to next 90 days
    if (bookDate && !bookDate.value) {
      const d = new Date(); d.setDate(d.getDate() + 1);
      const max = new Date(); max.setDate(max.getDate() + 90);
      const iso = (x) => x.toISOString().slice(0, 10);
      bookDate.min = iso(new Date());
      bookDate.max = iso(max);
      bookDate.value = iso(d);
    }
    booking.classList.add('is-open');
    booking.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
  };
  const closeBooking = () => {
    booking.classList.remove('is-open');
    booking.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
  };

  // All "Réserver" buttons
  document.querySelectorAll('[data-open-booking]').forEach(btn => {
    btn.addEventListener('click', openBooking);
  });
  bookClose.addEventListener('click', closeBooking);
  booking.addEventListener('click', (e) => { if (e.target === booking) closeBooking(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && booking.classList.contains('is-open')) closeBooking();
  });

  // Submit handler — validates required fields and shows success state
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    bookForm.querySelectorAll('[required]').forEach(input => {
      const field = input.closest('.booking__field');
      if (!input.value.trim() || (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value))) {
        field?.classList.add('is-invalid');
        ok = false;
      } else {
        field?.classList.remove('is-invalid');
      }
    });
    if (!ok) return;
    // Fake submission — in a real app we'd POST to a backend here
    bookForm.classList.add('is-hidden');
    bookSuccess.classList.add('is-shown');
    bookSuccess.setAttribute('aria-hidden', 'false');
  });

  // Clear validation as user types
  bookForm.addEventListener('input', (e) => {
    e.target.closest('.booking__field')?.classList.remove('is-invalid');
  });

  // Reset modal on close-after-success
  bookSuccClose.addEventListener('click', () => {
    closeBooking();
    setTimeout(() => {
      bookForm.reset();
      bookForm.classList.remove('is-hidden');
      bookSuccess.classList.remove('is-shown');
      bookSuccess.setAttribute('aria-hidden', 'true');
      bookDate.value = '';
    }, 400);
  });
})();

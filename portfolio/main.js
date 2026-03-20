/* ============================================================
   MEGHA V — MAIN.JS
   Sparkle cursor · Page transitions · Scroll reveals · Nav
   ============================================================ */

(function () {
  /* ── CURSOR ── */
  const dot    = document.getElementById('cursor-dot');
  const ring   = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loopRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loopRing);
  })();

  const hoverTargets = 'a, button, .glass, .prev-card, .proj-card, .cert-card, .lead-card, .skill-card, .ach-card, .filter-btn, .tl-card, input, textarea, select';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
  });

  /* ── SPARKLE ENGINE ── */
  const SPARKLE_COLORS = ['#0ff4c6', '#a855f7', '#fb7185', '#38bdf8', '#fbbf24', '#ffffff'];
  const SPARKLE_SHAPES = ['✦', '✧', '⋆', '★', '·', '✸', '✺'];
  let lastSparkle = 0;
  let sparkleCount = 0;

  function createSparkle(x, y) {
    if (sparkleCount > 40) return; // throttle max live sparkles

    const now = Date.now();
    if (now - lastSparkle < 30) return; // max ~33fps
    lastSparkle = now;

    // Random type: dot or star character
    const useChar = Math.random() > 0.4;

    if (useChar) {
      const el = document.createElement('div');
      el.className = 'sparkle-star';
      el.textContent = SPARKLE_SHAPES[Math.floor(Math.random() * SPARKLE_SHAPES.length)];
      const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
      const dx = (Math.random() - 0.5) * 60;
      const dy = -(20 + Math.random() * 50);
      const size = 8 + Math.random() * 12;
      el.style.cssText = `
        left:${x + (Math.random()-0.5)*20}px;
        top:${y + (Math.random()-0.5)*20}px;
        color:${color};
        font-size:${size}px;
        text-shadow:0 0 6px ${color};
        --dx:${dx}px;
        --dy:${dy}px;
        animation-duration:${0.6 + Math.random()*0.5}s;
      `;
      document.body.appendChild(el);
      sparkleCount++;
      el.addEventListener('animationend', () => { el.remove(); sparkleCount--; });
    } else {
      const el = document.createElement('div');
      el.className = 'sparkle';
      const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
      const size = 3 + Math.random() * 6;
      el.style.cssText = `
        left:${x + (Math.random()-0.5)*24}px;
        top:${y + (Math.random()-0.5)*24}px;
        width:${size}px; height:${size}px;
        background:${color};
        box-shadow:0 0 ${size*2}px ${color};
        animation-duration:${0.5 + Math.random()*0.4}s;
      `;
      document.body.appendChild(el);
      sparkleCount++;
      el.addEventListener('animationend', () => { el.remove(); sparkleCount--; });
    }
  }

  // Burst multiple sparkles per move
  document.addEventListener('mousemove', e => {
    // Only spawn ~30% of moves for performance
    if (Math.random() > 0.35) return;
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) createSparkle(e.clientX, e.clientY);
  });

  // Extra burst on click
  document.addEventListener('click', e => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => createSparkle(e.clientX, e.clientY), i * 40);
    }
  });

  /* ── SCROLL PROGRESS ── */
  const prog = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    if (prog) prog.style.width = pct + '%';
  }, { passive: true });

  /* ── NAV COMPACT ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('compact', window.scrollY > 60);
  }, { passive: true });

  /* ── PAGE COVER (entry animation) ── */
  // The cover animates out on load (see CSS: pageIn keyframe)
  // Nothing extra needed — CSS handles entry

  /* ── PAGE TRANSITIONS (exit) ── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http') || link.target === '_blank') return;

    link.addEventListener('click', e => {
      e.preventDefault();
      const dest = link.href;

      // Create exit cover
      const cover = document.createElement('div');
      cover.className = 'page-cover out';
      document.body.appendChild(cover);

      setTimeout(() => { window.location.href = dest; }, 480);
    });
  });

  /* ── REVEAL ON SCROLL ── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.rv, .rv-left, .rv-right').forEach(el => revealObs.observe(el));

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── ACTIVE NAV LINK ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const linkPage = a.getAttribute('href');
    if (linkPage === page) a.classList.add('active');
  });

})();

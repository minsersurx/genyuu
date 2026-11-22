(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  const progressFill = document.createElement('span');
  progress.append(progressFill);
  document.body.append(progress);

  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', '回到页面卷首');
  backToTop.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
  backToTop.addEventListener('click', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
  document.body.append(backToTop);

  const updateScrollAids = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progressFill.style.transform = `scaleX(${amount})`;
    backToTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.65);
  };

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
    updateScrollAids();
  };
  let scrollFrame = 0;
  let revealPassedItems = () => {};
  const scheduleScrollUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      updateHeader();
      revealPassedItems();
    });
  };
  updateHeader();
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate, { passive: true });

  if (toggle && nav) {
    const setMenuOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isOpen);
      if (!isOpen) nav.querySelector('a')?.focus();
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      setMenuOpen(false);
    }));
    document.addEventListener('pointerdown', (event) => {
      if (nav.classList.contains('is-open') && header && !header.contains(event.target)) {
        const clickTarget = event.target instanceof Element ? event.target : null;
        const clickedControl = clickTarget?.closest('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        setMenuOpen(false);
        if (!clickedControl) window.requestAnimationFrame(() => toggle.focus({ preventScroll: true }));
      }
    });
    document.addEventListener('focusin', (event) => {
      if (nav.classList.contains('is-open') && header && !header.contains(event.target)) {
        setMenuOpen(false);
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenuOpen(false);
        toggle.focus();
      }
    });
    if (header) header.classList.add('nav-ready');
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) setMenuOpen(false);
    }, { passive: true });
  }

  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.classList.remove('will-reveal');
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '120px 0px' });
    reveals.forEach((item) => {
      if (item.getBoundingClientRect().top >= window.innerHeight) {
        item.classList.add('will-reveal');
        observer.observe(item);
      }
    });
    revealPassedItems = () => {
      reveals.forEach((item) => {
        if (item.classList.contains('will-reveal') && item.getBoundingClientRect().bottom < 0) {
          item.classList.add('is-visible');
          item.classList.remove('will-reveal');
          observer.unobserve(item);
        }
      });
    };
  }
})();

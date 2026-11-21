(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (toggle && nav) {
    const setMenuOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isOpen);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      setMenuOpen(false);
    }));
    document.addEventListener('click', (event) => {
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
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0 });
    let revealFrame = 0;
    const revealPassedItems = () => {
      if (revealFrame) return;
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = 0;
        reveals.forEach((item) => {
          if (item.classList.contains('will-reveal') && item.getBoundingClientRect().top <= window.innerHeight) {
            item.classList.add('is-visible');
            observer.unobserve(item);
          }
        });
      });
    };
    reveals.forEach((item) => {
      if (item.getBoundingClientRect().top >= window.innerHeight) {
        item.classList.add('will-reveal');
        observer.observe(item);
      }
    });
    window.addEventListener('scroll', revealPassedItems, { passive: true });
    window.addEventListener('resize', revealPassedItems, { passive: true });
    revealPassedItems();
  }
})();

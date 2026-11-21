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
  backToTop.textContent = '↑';
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
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateScrollAids, { passive: true });

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
    document.addEventListener('click', (event) => {
      if (nav.classList.contains('is-open') && header && !header.contains(event.target)) {
        setMenuOpen(false);
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

  if (header) {
    const records = [
      { title: '帝国全史', collection: '开国与沿革', href: '/chronicle.html', keywords: '神朝 乱世 天统 建国 统一 编年 诸侯 封国 沿革 议事席', featured: true },
      { title: '天统宪章', collection: '国本典章', href: '/laws.html', keywords: '帝制 王权 皇帝 魔王 主宰 中央 分职 会议 法律 修订 宪章 政典', featured: true },
      { title: '中央与地方', collection: '帝国机构', href: '/institutions.html', keywords: '中枢 朝廷 省区 市县 诸侯 封国 归制 官署 机构 地图 疆域', featured: true },
      { title: '帝国人物志', collection: '人物档案', href: '/characters.html', keywords: '幽汐 幽冥 玄冥 冬久 凌夜 墨尘 神冥 皇帝 魔王 太祖', featured: true },
      { title: '玄都受命，玄幽立国', collection: '开国实录', href: '/events/founding.html', keywords: '太祖 幽冥 建国 改元 天统元年 神朝 立国' },
      { title: '断龙岭之战', collection: '建国战事', href: '/events/duanlongling.html', keywords: '山隘 神冥 大捷 战事 断龙岭' },
      { title: '葬影原决战', collection: '天统五年', href: '/events/zangyingyuan.html', keywords: '神影 一统 统一 余势 葬影原' },
      { title: '州县议事席试办', collection: '幽汐御极七年', href: '/events/yuxi-hearing.html', keywords: '幽汐 河工 学校 仓储 地方 议事 试办 听取意见' }
    ];
    const searchToggle = document.createElement('button');
    searchToggle.className = 'archive-search-toggle';
    searchToggle.type = 'button';
    searchToggle.setAttribute('aria-label', '打开档案速查');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchToggle.setAttribute('aria-controls', 'archive-search-panel');
    const searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    searchIcon.setAttribute('viewBox', '0 0 24 24');
    searchIcon.setAttribute('aria-hidden', 'true');
    searchIcon.innerHTML = '<circle cx="10.8" cy="10.8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m15.5 15.5 4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>';
    const searchLabel = document.createElement('span');
    searchLabel.textContent = '速查';
    searchToggle.append(searchIcon, searchLabel);

    const searchPanel = document.createElement('section');
    searchPanel.className = 'archive-search-panel';
    searchPanel.id = 'archive-search-panel';
    searchPanel.setAttribute('aria-label', '档案速查');
    searchPanel.hidden = true;
    const searchCaption = document.createElement('label');
    searchCaption.className = 'archive-search-caption';
    searchCaption.htmlFor = 'archive-search-input';
    searchCaption.textContent = '档案速查';
    const searchInput = document.createElement('input');
    searchInput.className = 'archive-search-input';
    searchInput.id = 'archive-search-input';
    searchInput.type = 'search';
    searchInput.placeholder = '搜索人物、宪章或事件';
    searchInput.autocomplete = 'off';
    searchInput.maxLength = 50;
    const searchStatus = document.createElement('p');
    searchStatus.className = 'archive-search-status';
    searchStatus.setAttribute('aria-live', 'polite');
    const searchResults = document.createElement('ul');
    searchResults.className = 'archive-search-results';
    searchPanel.append(searchCaption, searchInput, searchStatus, searchResults);
    header.append(searchToggle, searchPanel);

    const renderResults = () => {
      const query = searchInput.value.trim().toLocaleLowerCase();
      const matches = (query
        ? records.filter((record) => `${record.title} ${record.collection} ${record.keywords}`.toLocaleLowerCase().includes(query))
        : records.filter((record) => record.featured)
      ).slice(0, 6);
      searchResults.replaceChildren();
      searchStatus.textContent = query
        ? (matches.length ? `找到 ${matches.length} 份相关档案` : '没有找到相关档案')
        : '常用档案';
      if (!matches.length) {
        const empty = document.createElement('li');
        empty.className = 'archive-search-empty';
        empty.textContent = '可试试“开国”“幽汐”或“宪章”。';
        searchResults.append(empty);
        return;
      }
      matches.forEach((record) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = record.href;
        const title = document.createElement('span');
        title.className = 'archive-search-result-title';
        title.textContent = record.title;
        const collection = document.createElement('small');
        collection.textContent = record.collection;
        link.append(title, collection);
        item.append(link);
        searchResults.append(item);
      });
    };
    const setSearchOpen = (open) => {
      searchPanel.hidden = !open;
      searchToggle.setAttribute('aria-expanded', String(open));
      if (open) {
        if (nav?.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          toggle?.setAttribute('aria-expanded', 'false');
          toggle?.setAttribute('aria-label', '打开导航');
        }
        renderResults();
        requestAnimationFrame(() => searchInput.focus());
      }
    };
    searchToggle.addEventListener('click', () => setSearchOpen(searchPanel.hidden));
    searchInput.addEventListener('input', renderResults);
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        const firstResult = searchResults.querySelector('a');
        if (firstResult) {
          event.preventDefault();
          firstResult.focus();
        }
      }
    });
    document.addEventListener('pointerdown', (event) => {
      if (!searchPanel.hidden && !header.contains(event.target)) setSearchOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (searchPanel.hidden) setSearchOpen(true);
        else searchInput.focus();
      }
      if (event.key === 'Escape' && !searchPanel.hidden) {
        setSearchOpen(false);
        searchToggle.focus();
      }
    });
    searchResults.addEventListener('click', (event) => {
      if (event.target.closest('a')) setSearchOpen(false);
    });
    header.classList.add('archive-search-ready');
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
    reveals.forEach((item) => {
      if (item.getBoundingClientRect().top >= window.innerHeight) {
        item.classList.add('will-reveal');
        observer.observe(item);
      }
    });
  }
})();

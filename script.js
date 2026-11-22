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
      if (open) {
        const searchPanel = header?.querySelector('.archive-search-panel');
        if (searchPanel && !searchPanel.hidden) {
          searchPanel.hidden = true;
          header.querySelector('.archive-search-toggle')?.setAttribute('aria-expanded', 'false');
          header.querySelector('.archive-search-toggle')?.setAttribute('aria-label', '打开档案速查');
        }
      }
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

  if (header) {
    const records = [
      { title: '帝国全史', collection: '开国与沿革', href: '/chronicle.html', keywords: '神朝 乱世 天统 建国 统一 编年 诸侯 封国 沿革 议事席', featured: true },
      { title: '天统宪章', collection: '国本典章', href: '/laws.html', keywords: '帝制 王权 皇帝 魔王 主宰 中央 分职 会议 法律 修订 宪章 政典', featured: true },
      { title: '中央与地方', collection: '帝国机构', href: '/institutions.html', keywords: '中枢 朝廷 省区 市县 诸侯 封国 归制 官署 机构 地图 疆域', featured: true },
      { title: '帝国人物志', collection: '人物档案', href: '/characters.html', keywords: '幽汐 幽冥 玄冥 冬久 凌夜 墨尘 神冥 皇帝 魔王 太祖', featured: true },
      { title: '开国实录', collection: '帝国全史 · 卷一', href: '/chronicle.html#founding-record', keywords: '幽冥 冬久 神朝 建国 断龙岭 玄都' },
      { title: '天统沿革', collection: '帝国全史 · 卷二', href: '/chronicle.html#chronicle-timeline', keywords: '编年 纪年 诸侯 封国 幽汐' },
      { title: '建国宪章条文', collection: '天统宪章 · 开国底案', href: '/laws.html#constitution-draft', keywords: '第一条 第二条 皇帝 魔王 主宰 投票 地方 封国' },
      { title: '宪章修订沿革', collection: '天统宪章 · 历次修订', href: '/laws.html#constitution-amendments', keywords: '修宪 职分 诸侯 封国 议事席 幽汐' },
      { title: '中央诸司', collection: '帝国机构 · 中枢', href: '/institutions.html#central-offices', keywords: '内政府 将军府 吏部府 立法院 外交部 官署' },
      { title: '地方政制', collection: '帝国机构 · 地方', href: '/institutions.html#local-system', keywords: '省区 市县 诸侯 封国 议事席' },
      { title: '疆域舆图', collection: '帝国机构 · 舆图档案', href: '/institutions.html#territory-archive', keywords: '东亚 疆界 区划 地图 北原' },
      { title: '幽汐', collection: '当今执政人物档案', href: '/characters.html#youxi', keywords: '皇帝 魔王 即位 御极七年 议事席' },
      { title: '太祖幽冥', collection: '开国人物档案', href: '/characters.html#youming', keywords: '皇帝 开国 神朝 玄都 天统元年' },
      { title: '玄冥', collection: '开国人物档案', href: '/characters.html#xuanming', keywords: '摄政 太祖 军政' },
      { title: '冬久', collection: '前朝人物档案', href: '/characters.html#dongjiu', keywords: '宰相 恩师 幽冥' },
      { title: '神冥', collection: '开国人物档案', href: '/characters.html#shenming', keywords: '断龙岭 神影 葬影原' },
      { title: '凌夜', collection: '开国人物档案', href: '/characters.html#lingye', keywords: '玄幽卫 监察 律令 办案' },
      { title: '墨尘', collection: '开国人物档案', href: '/characters.html#mochen', keywords: '灵政院 学府 取士 教育 官吏' },
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
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fa-solid fa-magnifying-glass';
    searchIcon.setAttribute('aria-hidden', 'true');
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

    const appendQueryHighlight = (element, value, query) => {
      const start = query ? value.toLocaleLowerCase().indexOf(query) : -1;
      if (start < 0) {
        element.textContent = value;
        return;
      }
      element.append(document.createTextNode(value.slice(0, start)));
      const match = document.createElement('mark');
      match.textContent = value.slice(start, start + query.length);
      element.append(match, document.createTextNode(value.slice(start + query.length)));
    };

    const renderResults = () => {
      const query = searchInput.value.trim().toLocaleLowerCase();
      const matches = (query
        ? records
          .map((record, index) => {
            const title = record.title.toLocaleLowerCase();
            const collection = record.collection.toLocaleLowerCase();
            const keywords = record.keywords.toLocaleLowerCase();
            const score = title.includes(query) ? 3 : collection.includes(query) ? 2 : keywords.includes(query) ? 1 : 0;
            return { record, index, score };
          })
          .filter((match) => match.score > 0)
          .sort((a, b) => b.score - a.score || a.index - b.index)
          .map((match) => match.record)
        : records.filter((record) => record.featured)
      );
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
        appendQueryHighlight(title, record.title, query);
        const collection = document.createElement('small');
        appendQueryHighlight(collection, record.collection, query);
        link.append(title, collection);
        item.append(link);
        searchResults.append(item);
      });
    };
    const setSearchOpen = (open) => {
      searchPanel.hidden = !open;
      searchToggle.setAttribute('aria-expanded', String(open));
      searchToggle.setAttribute('aria-label', open ? '关闭档案速查' : '打开档案速查');
      if (open) {
        if (nav?.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          toggle?.setAttribute('aria-expanded', 'false');
          toggle?.setAttribute('aria-label', '打开导航');
        }
        renderResults();
        searchInput.focus();
      }
    };
    searchToggle.addEventListener('click', () => setSearchOpen(searchPanel.hidden));
    searchInput.addEventListener('input', renderResults);
    const getResultLinks = () => Array.from(searchResults.querySelectorAll('a'));
    searchInput.addEventListener('keydown', (event) => {
      const links = getResultLinks();
      if (!links.length) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        links[0].focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        links[links.length - 1].focus();
      }
    });
    searchResults.addEventListener('keydown', (event) => {
      const activeLink = event.target.closest('a');
      if (!activeLink) return;
      const links = getResultLinks();
      const index = links.indexOf(activeLink);
      let targetIndex = -1;
      if (event.key === 'ArrowDown' && index < links.length - 1) targetIndex = index + 1;
      if (event.key === 'ArrowUp') targetIndex = index > 0 ? index - 1 : -2;
      if (event.key === 'Home') targetIndex = 0;
      if (event.key === 'End') targetIndex = links.length - 1;
      if (targetIndex === -2) {
        event.preventDefault();
        searchInput.focus();
      } else if (targetIndex >= 0) {
        event.preventDefault();
        links[targetIndex].focus();
      }
    });
    document.addEventListener('pointerdown', (event) => {
      if (!searchPanel.hidden && !searchPanel.contains(event.target) && !searchToggle.contains(event.target)) setSearchOpen(false);
    });
    document.addEventListener('focusin', (event) => {
      if (!searchPanel.hidden && !searchPanel.contains(event.target) && !searchToggle.contains(event.target)) setSearchOpen(false);
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

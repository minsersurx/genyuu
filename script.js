document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const preloaderLogo = document.getElementById('preloader-logo');
    const logoPlaceholder = document.querySelector('.logo-icon-placeholder');
    const menuIconWrapper = document.getElementById('mobile-menu-icon');
    const navMenu = document.getElementById('nav-menu');
    const heroCover = document.getElementById('hero');
    const scrollArrow = document.getElementById('scrollArrow');
    const exploreBtn = document.getElementById('explore-btn');
    const navLinks = document.querySelectorAll('.nav-links a');
    const logoIcon = document.getElementById('logo-icon');
    const codexItems = document.querySelectorAll('.codex-item');
    const oathMsg = document.getElementById('oath-message');
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const langModal = document.getElementById('lang-modal');
    const pageTitle = document.getElementById('page-title');

    // 已修改：繁体中文emoji改为🇭🇰
    const flagMap = {
        zh: '🇨🇳', 'zh-tw': '🇭🇰', ja: '🇯🇵', ko: '🇰🇷', en: '🇺🇸'
    };
    const titleMap = {
        zh: '玄幽帝国 | Genyuu Empire',
        'zh-tw': '玄幽帝國 | Genyuu Empire',
        ja: '玄幽帝国 | Genyuu Empire',
        ko: '현유제국 | Genyuu Empire',
        en: 'Genyuu Empire'
    };
    const langCodeMap = {
        zh: 'zh-CN', 'zh-tw': 'zh-TW', ja: 'ja', ko: 'ko', en: 'en'
    };
    let currentLang = 'en';

    // -------- 预加载与Logo飞入动画（已添加空值保护，彻底解决卡死问题） --------
    function startLogoTransition() {
        // 空值检查：如果关键元素不存在，直接隐藏预加载器，防止页面卡死
        if (!logoPlaceholder || !preloaderLogo || !preloader) {
            preloader.style.display = 'none';
            return;
        }

        // 停止旋转动画
        preloaderLogo.style.animation = 'none';
        // 强制重绘
        preloaderLogo.offsetHeight;
        
        // 获取当前Logo在屏幕上的位置
        const logoRect = preloaderLogo.getBoundingClientRect();
        // 获取目标位置（导航栏logo占位符的位置）
        const targetRect = logoPlaceholder.getBoundingClientRect();
        
        // 计算需要移动的距离
        const dx = targetRect.left + targetRect.width/2 - (logoRect.left + logoRect.width/2);
        const dy = targetRect.top + targetRect.height/2 - (logoRect.top + logoRect.height/2);
        
        // 设置过渡，移动并缩放（如果需要缩小）
        preloaderLogo.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
        // 目标位置 + 尺寸适配（导航栏Logo图标大小为30px，预加载Logo为60px，需要缩小一半）
        const scale = targetRect.width / logoRect.width;
        preloaderLogo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        
        // 同时淡出背景和文字
        preloader.classList.add('fade-out-bg');
        
        // 监听过渡结束
        preloaderLogo.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'transform') {
                preloaderLogo.removeEventListener('transitionend', handler);
                // 将Logo图片插入导航栏占位符
                const logoImg = document.createElement('img');
                logoImg.src = 'logo.svg';
                logoImg.alt = '玄幽帝国';
                logoImg.className = 'logo-img';
                logoPlaceholder.appendChild(logoImg);
                // 移除预加载遮罩
                preloader.style.display = 'none';
                // 语言选择模态根据情况显示（后面逻辑也会处理）
            }
        });
    }
    // 页面完全加载后启动过渡
    window.addEventListener('load', () => {
        // 延迟600ms让用户看清旋转动画，然后开始过渡
        setTimeout(startLogoTransition, 600);
    });

    // -------- 粒子动画 --------
    let particles = [];
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeCanvas); resizeCanvas();
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.8; this.speedX = (Math.random() - 0.5) * 0.25;
            this.speedY = (Math.random() - 0.5) * 0.15 - 0.15; this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() { this.x += this.speedX; this.y += this.speedY; if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) { this.reset(); this.y = canvas.height; } }
        draw() {
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.shadowColor = '#f1c40f'; ctx.shadowBlur = 3; ctx.fill(); ctx.shadowBlur = 0;
        }
    }
    for (let i = 0; i < 30; i++) particles.push(new Particle());
    (function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); })();

    // 从 URL 参数获取语言
    function getLangFromURL() {
        const params = new URLSearchParams(window.location.search);
        const lang = params.get('lang');
        return lang && flagMap[lang] ? lang : null;
    }
    // 更新浏览器 URL 参数
    function updateURL(lang) {
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url.toString());
    }
    // 语言切换核心
    function switchLanguage(lang, updateUrl = true) {
        const elements = document.querySelectorAll('.lang-text');
        elements.forEach(el => el.classList.add('fade-out'));
        setTimeout(() => {
            currentLang = lang;
            const attrMap = { zh: 'data-zh', 'zh-tw': 'data-zh-tw', ja: 'data-ja', ko: 'data-ko', en: 'data-en' };
            const attr = attrMap[lang];
            elements.forEach(el => { if (el.hasAttribute(attr)) el.textContent = el.getAttribute(attr); });
            elements.forEach(el => el.classList.remove('fade-out'));
            langToggleBtn.textContent = flagMap[lang];
            document.title = titleMap[lang];
            document.documentElement.lang = langCodeMap[lang];
            updateOathMessage();
            langDropdown.classList.remove('show');
            localStorage.setItem('genyuu-lang', lang);
            if (updateUrl) updateURL(lang);
        }, 300);
    }
    // 页面初始化语言
    const urlLang = getLangFromURL();
    const storedLang = localStorage.getItem('genyuu-lang');
    if (urlLang) {
        switchLanguage(urlLang, false);
        langModal.style.display = 'none';
    } else if (storedLang && flagMap[storedLang]) {
        switchLanguage(storedLang, true);
        langModal.style.display = 'none';
    } else {
        langModal.style.display = 'flex';
    }
    // 语言选择模态
    langModal.querySelectorAll('.lang-options li').forEach(li => {
        li.addEventListener('click', () => {
            const lang = li.dataset.lang;
            switchLanguage(lang, true);
            langModal.style.display = 'none';
        });
    });
    // 语言下拉菜单
    langToggleBtn.addEventListener('click', (e) => { e.stopPropagation(); langDropdown.classList.toggle('show'); });
    document.addEventListener('click', () => langDropdown.classList.remove('show'));
    langDropdown.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            switchLanguage(li.dataset.lang, true);
        });
    });
    // 长按Logo涟漪
    let pressTimer;
    function startPress(e) { e.preventDefault(); pressTimer = setTimeout(() => { const ripple = document.createElement('div'); ripple.className = 'ripple-effect'; document.body.appendChild(ripple); ripple.addEventListener('animationend', () => ripple.remove()); playChime(); }, 800); }
    function cancelPress() { clearTimeout(pressTimer); }
    logoIcon.addEventListener('mousedown', startPress); logoIcon.addEventListener('touchstart', startPress, {passive: false});
    logoIcon.addEventListener('mouseup', cancelPress); logoIcon.addEventListener('mouseleave', cancelPress);
    logoIcon.addEventListener('touchend', cancelPress); logoIcon.addEventListener('touchcancel', cancelPress);
    function playChime() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator(); const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(380, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 1.2);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
            osc.start(); osc.stop(ctx.currentTime + 1.5);
        } catch(e){}
    }
    // 移动菜单
    menuIconWrapper.addEventListener('click', () => navMenu.classList.toggle('active'));
    document.addEventListener('click', (e) => { if (!navMenu.contains(e.target) && !menuIconWrapper.contains(e.target)) navMenu.classList.remove('active'); });
    // 封面滑动控制
    let isCoverVisible = true, isAnimating = false;
    function hideCover(cb) {
        if (!isCoverVisible || isAnimating) { if (cb) cb(); return; }
        isAnimating = true; window.scrollTo(0, 0);
        heroCover.classList.add('slide-up');
        setTimeout(() => { document.body.classList.add('unlocked'); isCoverVisible = false; isAnimating = false; if (cb) cb(); }, 900);
    }
    function showCover() {
        if (isCoverVisible || isAnimating) return;
        isAnimating = true; document.body.classList.remove('unlocked'); window.scrollTo(0, 0);
        heroCover.classList.remove('slide-up');
        setTimeout(() => { isCoverVisible = true; isAnimating = false; }, 900);
    }
    scrollArrow.addEventListener('click', () => hideCover());
    exploreBtn.addEventListener('click', () => hideCover());
    function scrollToSection(el) { const h = 60; const pos = el.getBoundingClientRect().top + window.scrollY - h; window.scrollTo({ top: pos, behavior: 'smooth' }); }
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); navMenu.classList.remove('active');
            if (link.id === 'nav-home') showCover();
            else { const id = link.getAttribute('href').substring(1); const sec = document.getElementById(id); if (sec) hideCover(() => scrollToSection(sec)); }
        });
    });
    window.addEventListener('wheel', (e) => { if (isCoverVisible || isAnimating) e.preventDefault(); if (isCoverVisible && e.deltaY > 0) hideCover(); else if (!isCoverVisible && e.deltaY < 0 && window.scrollY <= 0) showCover(); }, {passive: false});
    let startY;
    window.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }, {passive: false});
    window.addEventListener('touchmove', (e) => {
        if (isCoverVisible || isAnimating) e.preventDefault();
        const d = startY - e.touches[0].clientY;
        if (isCoverVisible && d > 50) hideCover(); else if (!isCoverVisible && d < -50 && window.scrollY <= 0) showCover();
    }, {passive: false});
    // 滚动揭示
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }); }, {threshold: 0.12});
    reveals.forEach(el => observer.observe(el));
    // 法典互动
    let activated = new Set();
    codexItems.forEach(item => {
        item.addEventListener('click', () => {
            const art = item.dataset.article;
            if (!activated.has(art)) { activated.add(art); item.classList.add('activated'); }
            if (activated.size === 3) { oathMsg.classList.add('show'); updateOathMessage(); }
        });
    });
    function updateOathMessage() {
        const messages = {
            zh: '⚖️ 誓约成立 · 神魔平等 ⚖️',
            'zh-tw': '⚖️ 誓約成立 · 神魔平等 ⚖️',
            ja: '⚖️ 誓約成立 · 神魔平等 ⚖️',
            ko: '⚖️ 서약 성립 · 신마평등 ⚖️',
            en: '⚖️ Vow Established · Equality for All ⚖️'
        };
        oathMsg.textContent = messages[currentLang] || messages.en;
    }
});

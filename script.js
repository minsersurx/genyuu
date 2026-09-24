document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const preloaderLogo = document.getElementById('preloader-logo');
    const logoPlaceholder = document.querySelector('.logo-icon-placeholder');
    const menuIconWrapper = document.getElementById('mobile-menu-icon');
    const navMenu = document.getElementById('nav-menu');
    const heroCover = document.getElementById('hero');
    const scrollArrow = document.getElementById('scrollArrow');
    const exploreBtn = document.getElementById('explore-btn');
    const navLinks = document.querySelectorAll('.nav-links a, .footer-links a');
    const logoIcon = document.getElementById('logo-icon');
    const codexItems = document.querySelectorAll('.codex-item');
    const oathMsg = document.getElementById('oath-message');
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const langModal = document.getElementById('lang-modal');
    const metaDesc = document.querySelector('meta[name="description"]');
    const metaOgDesc = document.querySelector('meta[property="og:description"]');

    const flagMap = {
        zh: '🇨🇳', 'zh-tw': '🇭🇰', ja: '🇯🇵', en: '🇺🇸'
    };
    const titleMap = {
        zh: '玄幽帝国 | Genyuu Empire',
        'zh-tw': '玄幽帝國 | Genyuu Empire',
        ja: '玄幽帝国 | Genyuu Empire',
        en: 'Genyuu Empire'
    };
    const langCodeMap = {
        zh: 'zh-CN', 'zh-tw': 'zh-TW', ja: 'ja', en: 'en'
    };
    // 用于外部搜索引擎预览的多语言描述，会随语言切换自动更新
    const descMap = {
        zh: '玄幽帝国官方秘录：太祖幽冥炼影焰、颁天统律法、一统天下的开国史诗，神魔同辉，玄幽永存。',
        'zh-tw': '玄幽帝國官方秘錄：太祖幽冥煉影焰、頒天統律法、一統天下的開國史詩，神魔同輝，玄幽永存。',
        ja: '玄幽帝国の公式記録：太祖幽冥が影炎を練り、天統律法を布いて天下を統一した建国叙事詩。神魔共に輝き、玄幽永遠なれ。',
        en: 'Genyuu Empire | 玄幽帝国 — the official chronicle of Emperor You Ming: forging Shadow Flame, issuing the Tian Tong Laws, and unifying the realm. Gods and Demons in Harmony, Eternal Genyuu.'
    };
    let currentLang = 'zh';

    // -------- 通用点击滑动涟漪特效（按钮、卡片等交互元素） --------
    const rippleSelector = '.primary-btn, .section-more, .back-home, .character-card, .faction-card, .codex-item';
    document.addEventListener('click', (e) => {
        const target = e.target.closest(rippleSelector);
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'click-ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        target.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });

    // -------- 预加载与Logo飞入动画（空值保护，避免子页面无该元素时报错） --------
    function startLogoTransition() {
        if (!preloader) return;
        if (!logoPlaceholder || !preloaderLogo) {
            preloader.style.display = 'none';
            return;
        }
        preloaderLogo.style.animation = 'none';
        preloaderLogo.offsetHeight; // 强制重绘

        const logoRect = preloaderLogo.getBoundingClientRect();
        const targetRect = logoPlaceholder.getBoundingClientRect();
        const dx = targetRect.left + targetRect.width / 2 - (logoRect.left + logoRect.width / 2);
        const dy = targetRect.top + targetRect.height / 2 - (logoRect.top + logoRect.height / 2);

        preloaderLogo.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
        const scale = targetRect.width / logoRect.width;
        preloaderLogo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        preloader.classList.add('fade-out-bg');

        preloaderLogo.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'transform') {
                preloaderLogo.removeEventListener('transitionend', handler);
                const logoImg = document.createElement('img');
                logoImg.src = 'logo.svg';
                logoImg.alt = '玄幽帝国';
                logoImg.className = 'logo-img';
                logoPlaceholder.appendChild(logoImg);
                preloader.style.display = 'none';
            }
        });
    }
    if (preloader) {
        window.addEventListener('load', () => setTimeout(startLogoTransition, 600));
    }

    // -------- 粒子动画（低端/移动设备与"减少动态效果"偏好下自动降级，更流畅） --------
    if (canvas && ctx) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let particles = [];
        function targetParticleCount() {
            if (prefersReducedMotion) return 0;
            return window.innerWidth < 768 ? 16 : 30;
        }
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeCanvas, 150);
        });
        resizeCanvas();
        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.8; this.speedX = (Math.random() - 0.5) * 0.25;
                this.speedY = (Math.random() - 0.5) * 0.15 - 0.15; this.opacity = Math.random() * 0.4 + 0.1;
                // 神魔同辉：粒子随机取金（神）或玉（魔）二色之一，呼应主题
                this.isJade = Math.random() < 0.35;
            }
            update() { this.x += this.speedX; this.y += this.speedY; if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) { this.reset(); this.y = canvas.height; } }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                if (this.isJade) {
                    ctx.fillStyle = `rgba(90, 150, 130, ${this.opacity})`;
                    ctx.shadowColor = '#5a9682';
                } else {
                    ctx.fillStyle = `rgba(185, 143, 61, ${this.opacity})`;
                    ctx.shadowColor = '#d9ae5f';
                }
                ctx.shadowBlur = 3; ctx.fill(); ctx.shadowBlur = 0;
            }
        }
        for (let i = 0; i < targetParticleCount(); i++) particles.push(new Particle());
        if (particles.length) {
            (function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => { p.update(); p.draw(); });
                requestAnimationFrame(animate);
            })();
        }
    }

    // -------- 语言：URL 参数 / 本地存储 / 浏览器语言自动识别 --------
    function getLangFromURL() {
        const params = new URLSearchParams(window.location.search);
        const lang = params.get('lang');
        return lang && flagMap[lang] ? lang : null;
    }
    function updateURL(lang) {
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url.toString());
    }
    // 根据浏览器/系统语言自动判断最贴近的展示语言，找不到匹配时回退为中文
    function detectBrowserLang() {
        const candidates = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'zh'];
        for (const raw of candidates) {
            const code = raw.toLowerCase();
            if (code.startsWith('zh')) {
                if (code.includes('tw') || code.includes('hk') || code.includes('hant')) return 'zh-tw';
                return 'zh';
            }
            if (code.startsWith('ja')) return 'ja';
            if (code.startsWith('en')) return 'en';
        }
        return 'zh';
    }
    function switchLanguage(lang, updateUrl = true) {
        const elements = document.querySelectorAll('.lang-text');
        elements.forEach(el => el.classList.add('fade-out'));
        setTimeout(() => {
            currentLang = lang;
            const attrMap = { zh: 'data-zh', 'zh-tw': 'data-zh-tw', ja: 'data-ja', en: 'data-en' };
            const attr = attrMap[lang];
            elements.forEach(el => { if (el.hasAttribute(attr)) el.textContent = el.getAttribute(attr); });
            elements.forEach(el => el.classList.remove('fade-out'));
            if (langToggleBtn) langToggleBtn.textContent = flagMap[lang];
            document.title = titleMap[lang];
            document.documentElement.lang = langCodeMap[lang];
            if (metaDesc) metaDesc.setAttribute('content', descMap[lang] || descMap.en);
            if (metaOgDesc) metaOgDesc.setAttribute('content', descMap[lang] || descMap.en);
            updateOathMessage();
            if (langDropdown) langDropdown.classList.remove('show');
            localStorage.setItem('genyuu-lang', lang);
            if (updateUrl) updateURL(lang);
        }, 300);
    }
    // 页面初始化语言：URL 指定 > 本地记忆 > 浏览器自动识别（不再弹出强制选择弹窗）
    const urlLang = getLangFromURL();
    const storedLang = localStorage.getItem('genyuu-lang');
    const initialLang = urlLang || (storedLang && flagMap[storedLang] ? storedLang : detectBrowserLang());
    switchLanguage(initialLang, false);
    if (langModal) langModal.style.display = 'none';

    // 语言选择模态（如页面仍保留手动选择入口则可用，默认已隐藏）
    if (langModal) {
        langModal.querySelectorAll('.lang-options li').forEach(li => {
            li.addEventListener('click', () => {
                switchLanguage(li.dataset.lang, true);
                langModal.style.display = 'none';
            });
        });
    }
    // 语言下拉菜单
    if (langToggleBtn && langDropdown) {
        langToggleBtn.addEventListener('click', (e) => { e.stopPropagation(); langDropdown.classList.toggle('show'); });
        document.addEventListener('click', () => langDropdown.classList.remove('show'));
        langDropdown.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                switchLanguage(li.dataset.lang, true);
            });
        });
    }

    // -------- 长按Logo涟漪彩蛋（仅在存在该元素的页面生效） --------
    if (logoIcon) {
        let pressTimer;
        function startPress(e) { e.preventDefault(); pressTimer = setTimeout(() => { const ripple = document.createElement('div'); ripple.className = 'ripple-effect'; document.body.appendChild(ripple); ripple.addEventListener('animationend', () => ripple.remove()); playChime(); }, 800); }
        function cancelPress() { clearTimeout(pressTimer); }
        logoIcon.addEventListener('mousedown', startPress); logoIcon.addEventListener('touchstart', startPress, { passive: false });
        logoIcon.addEventListener('mouseup', cancelPress); logoIcon.addEventListener('mouseleave', cancelPress);
        logoIcon.addEventListener('touchend', cancelPress); logoIcon.addEventListener('touchcancel', cancelPress);
    }
    function playChime() {
        try {
            const actx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = actx.createOscillator(); const gain = actx.createGain();
            osc.connect(gain); gain.connect(actx.destination);
            osc.frequency.setValueAtTime(380, actx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(280, actx.currentTime + 1.2);
            gain.gain.setValueAtTime(0.3, actx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 1.5);
            osc.start(); osc.stop(actx.currentTime + 1.5);
        } catch (e) { /* 静默失败，不影响主流程 */ }
    }

    // -------- 移动端菜单 --------
    if (menuIconWrapper && navMenu) {
        menuIconWrapper.addEventListener('click', () => navMenu.classList.toggle('active'));
        document.addEventListener('click', (e) => { if (!navMenu.contains(e.target) && !menuIconWrapper.contains(e.target)) navMenu.classList.remove('active'); });
    }

    // -------- 顶部导航栏：封面态半透明，进入正文/子页面后切换为实底，减少突兀感 --------
    const navbarEl = document.getElementById('navbar');
    if (heroCover) {
        let isCoverVisible = true, isAnimating = false;
        function hideCover(cb) {
            if (!isCoverVisible || isAnimating) { if (cb) cb(); return; }
            isAnimating = true; window.scrollTo(0, 0);
            heroCover.classList.add('slide-up');
            if (navbarEl) navbarEl.classList.add('scrolled');
            setTimeout(() => { document.body.classList.add('unlocked'); isCoverVisible = false; isAnimating = false; if (cb) cb(); }, 900);
        }
        function showCover() {
            if (isCoverVisible || isAnimating) return;
            isAnimating = true; document.body.classList.remove('unlocked'); window.scrollTo(0, 0);
            heroCover.classList.remove('slide-up');
            if (navbarEl) navbarEl.classList.remove('scrolled');
            setTimeout(() => { isCoverVisible = true; isAnimating = false; }, 900);
        }
        if (scrollArrow) scrollArrow.addEventListener('click', () => hideCover());
        if (exploreBtn) exploreBtn.addEventListener('click', () => hideCover());
        // 导航栏内的链接都是真实超链接；首页的"返回首页/封面"锚点，点击直接收起遮罩返回封面，不刷新页面
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (navMenu) navMenu.classList.remove('active');
                if (link.getAttribute('href') === '#hero') { e.preventDefault(); showCover(); window.scrollTo(0, 0); }
            });
        });
        window.addEventListener('wheel', (e) => { if (isCoverVisible || isAnimating) e.preventDefault(); if (isCoverVisible && e.deltaY > 0) hideCover(); else if (!isCoverVisible && e.deltaY < 0 && window.scrollY <= 0) showCover(); }, { passive: false });
        let startY;
        window.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }, { passive: true });
        window.addEventListener('touchmove', (e) => {
            if (isCoverVisible || isAnimating) e.preventDefault();
            const d = startY - e.touches[0].clientY;
            if (isCoverVisible && d > 50) hideCover(); else if (!isCoverVisible && d < -50 && window.scrollY <= 0) showCover();
        }, { passive: false });
    } else {
        // 子页面头部本就是实底导航（见 HTML 中的 .scrolled 类），链接均为真实超链接，
        // 这里只需要在点击后收起移动端菜单
        navLinks.forEach(link => {
            link.addEventListener('click', () => { if (navMenu) navMenu.classList.remove('active'); });
        });
    }

    // -------- 滚动揭示 --------
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }); }, { threshold: 0.12 });
        reveals.forEach(el => observer.observe(el));
    }

    // -------- 法典互动（仅首页存在时启用） --------
    if (codexItems.length && oathMsg) {
        let activated = new Set();
        codexItems.forEach(item => {
            item.addEventListener('click', () => {
                const art = item.dataset.article;
                if (!activated.has(art)) { activated.add(art); item.classList.add('activated'); }
                if (activated.size === 3) { oathMsg.classList.add('show'); updateOathMessage(); }
            });
        });
    }
    function updateOathMessage() {
        if (!oathMsg) return;
        const messages = {
            zh: '⚖️ 誓约成立 · 神魔平等 ⚖️',
            'zh-tw': '⚖️ 誓約成立 · 神魔平等 ⚖️',
            ja: '⚖️ 誓約成立 · 神魔平等 ⚖️',
            en: '⚖️ Vow Established · Equality for All ⚖️'
        };
        oathMsg.textContent = messages[currentLang] || messages.en;
    }
});

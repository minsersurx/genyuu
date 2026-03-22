const cover = document.getElementById('cover');
const scrollArrow = document.getElementById('scrollArrow');
let isCoverVisible = true; 
let isAnimating = false; // 新增：动画锁，防止在动画播放期间重复触发

// 动作：隐藏封面
function hideCover() {
	// 如果封面已经隐藏，或者正在播放动画，则不执行任何操作
	if (!isCoverVisible || isAnimating) return;
	
	isAnimating = true; // 锁上动画锁
	
	// 强制把底层滚动条归零，确保是从最顶部开始看
	window.scrollTo(0, 0);
	
	// 触发封面向上滑走的 CSS 动画
	cover.classList.add('slide-up');
	
	// 核心修复：等待 800 毫秒（与 CSS 动画时间一致）后再解锁底层滚动
	setTimeout(() => {
		document.body.classList.add('unlocked');
		isCoverVisible = false;
		isAnimating = false; // 动画播完，解开动画锁
	}, 800);
}

// 动作：显示封面
function showCover() {
	if (isCoverVisible || isAnimating) return;
	
	isAnimating = true;

	// 瞬间锁住底层滚动，防止在封盖的过程中画面乱跑
	document.body.classList.remove('unlocked');
	window.scrollTo(0, 0); 
	
	cover.classList.remove('slide-up');
	
	setTimeout(() => {
		isCoverVisible = true;
		isAnimating = false;
	}, 800);
}

// 交互 1：点击箭头滑走封面
scrollArrow.addEventListener('click', hideCover);

// 交互 2：监听鼠标滚轮
window.addEventListener('wheel', (e) => {
	// 核心修复：如果封面可见，或者正在播放动画，强制阻止浏览器的默认滚动！
	if (isCoverVisible || isAnimating) {
		e.preventDefault(); 
	}

	if (isCoverVisible && e.deltaY > 0) {
		hideCover();
	} 
	else if (!isCoverVisible && e.deltaY < 0 && window.scrollY <= 0) {
		showCover();
	}
}, { passive: false }); // 必须加上 passive: false 才能使 preventDefault() 生效

// 交互 3：手机触摸滑动兼容
let startY;
window.addEventListener('touchstart', (e) => {
	startY = e.touches[0].clientY;
}, { passive: false });

window.addEventListener('touchmove', (e) => {
	// 同样，在封面阶段阻止手机端的默认拖拽滑动
	if (isCoverVisible || isAnimating) {
		e.preventDefault(); 
	}

	let currentY = e.touches[0].clientY;
	let diffY = startY - currentY; 

	if (isCoverVisible && diffY > 50) {
		hideCover();
	} else if (!isCoverVisible && diffY < -50 && window.scrollY <= 0) {
		showCover();
	}
}, { passive: false });

// 交互 4：时间轴卡片渐显动画（保持原样）
const timelineItems = document.querySelectorAll('.timeline-item');
const observerOptions = {
	root: null,
	threshold: 0.2
};
const observer = new IntersectionObserver((entries, observer) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
			observer.unobserve(entry.target); 
		}
	});
}, observerOptions);

timelineItems.forEach(item => {
	observer.observe(item);
});
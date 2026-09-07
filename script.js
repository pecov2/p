// ページ遷移アニメーション
function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    const storageKey = 'poroniLoaderShown';

    if (!loader) {
        document.body.classList.remove('site-loading');
        return;
    }

    if (sessionStorage.getItem(storageKey) === 'true') {
        loader.remove();
        document.body.classList.remove('site-loading');
        document.body.classList.add('loader-done');
        return;
    }

    const startedAt = Date.now();
    const minDuration = 1100;

    const finish = () => {
        const remaining = Math.max(0, minDuration - (Date.now() - startedAt));

        setTimeout(() => {
            sessionStorage.setItem(storageKey, 'true');
            document.body.classList.add('loader-done');
            document.body.classList.remove('site-loading');

            setTimeout(() => {
                loader.remove();
            }, 800);
        }, remaining);
    };

    if (document.readyState === 'complete') {
        finish();
    } else {
        window.addEventListener('load', finish, { once: true });
    }
}

initPageLoader();

function initPageTransition() {
    const overlay = document.querySelector('.page-transition-overlay');

    // オーバーレイが存在しない場合は処理を終了
    if (!overlay) {
        return;
    }

    // 内部リンクにページ遷移アニメーションを適用
    const internalLinks = document.querySelectorAll('a[href$=".html"]:not(.reservation-banner)');

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // 同じページ内のアンカーリンクの場合は通常の処理
            if (href.startsWith('#')) {
                return;
            }

            // 外部リンクの場合は通常の処理
            if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }

            // 予約バナーの場合は通常の処理
            if (link.classList.contains('reservation-banner')) {
                return;
            }

            e.preventDefault();

            // オーバーレイを表示
            overlay.classList.add('active');

            // 少し遅延してからページ遷移
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });
}

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    // ページ遷移アニメーションを初期化
    initPageTransition();
    // メニューアイテムのホバーエフェクト
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const overlay = item.querySelector('.menu-item-overlay');
            if (overlay) overlay.style.opacity = '1';
        });
        item.addEventListener('mouseleave', () => {
            const overlay = item.querySelector('.menu-item-overlay');
            if (overlay) overlay.style.opacity = '0';
        });
    });

    // フォームのアニメーション
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');

        if (input && label) {
            input.addEventListener('focus', () => {
                label.classList.add('active');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.classList.remove('active');
                }
            });

            // 初期値がある場合の処理
            if (input.value) {
                label.classList.add('active');
            }
        }
    });

    // スムーズスクロール機能
    function smoothScroll(target, duration = 1000) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // より滑らかなイージング関数
        function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }

        requestAnimationFrame(animation);
    }

    // すべてのアンカーリンクにスムーズスクロールを適用
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
        });
    });

    // ヘッダーの表示/非表示
    const header = document.querySelector('header');
    if (header) {
        header.style.transform = 'translateY(0)';
    }

    // 画像の遅延読み込み
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // スクロール時のフェードインアニメーション
    const fadeElements = document.querySelectorAll('.menu-item, .info, .contact-form, .news-item, .reserve-table, .policy-content');

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        element.classList.add('fade-element');
        fadeInObserver.observe(element);
    });

    // ヒーローセクションのパララックス効果
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        hero.style.backgroundPositionY = scrollTop * 0.5 + 'px';
    });

    // フォームのラベルアニメーション
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

    formInputs.forEach(input => {
        // 初期状態で値がある場合はラベルを上に移動
        if (input.value) {
            input.parentElement.classList.add('focused');
        }

        // フォーカス時のアニメーション
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        // フォーカスが外れた時のアニメーション
        input.addEventListener('blur', function () {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // セクションタイトルのアニメーション
    const sectionTitles = document.querySelectorAll('.section-title');

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('title-animate');
                titleObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    sectionTitles.forEach(title => {
        titleObserver.observe(title);
    });

    // モバイルメニューの実装
    const mobileMenu = {
        init() {
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');
            const overlay = document.querySelector('.mobile-menu-overlay');

            if (hamburger && navLinks) {
                const closeMenu = () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    overlay?.classList.remove('active');
                };

                const openMenu = () => {
                    hamburger.classList.add('active');
                    navLinks.classList.add('active');
                    overlay?.classList.add('active');
                };

                hamburger.addEventListener('click', function () {
                    const isOpen = navLinks.classList.contains('active');
                    if (isOpen) {
                        closeMenu();
                    } else {
                        openMenu();
                    }
                });

                overlay?.addEventListener('click', closeMenu);

                navLinks.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', closeMenu);
                });
            }
        }
    };

    mobileMenu.init();

    // 時間帯に応じてbodyのクラスを切り替える
    function updateTimeOfDay() {
        // 機能を無効化
        return;

        const hour = new Date().getHours();
        const body = document.body;

        // クラスをすべて削除
        body.classList.remove('day', 'evening', 'night');

        // 時間帯に応じてクラスを追加
        if (hour >= 5 && hour < 17) {
            // 昼間: 5:00 - 16:59
            body.classList.add('day');
        } else if (hour >= 17 && hour < 19) {
            // 夕方: 17:00 - 18:59
            body.classList.add('evening');
        } else {
            // 夜: 19:00 - 4:59
            body.classList.add('night');
        }
    }

    // 時間帯の更新
    // updateTimeOfDay(); // コメントアウト

    // 1時間ごとに時間帯を更新
    // setInterval(updateTimeOfDay, 3600000); // コメントアウト

    // 一番上に戻るボタンの表示/非表示を制御
    const backToTopButton = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScroll('#home');
    });
});

function initMobileReservationToggle() {
    const heroButton = document.querySelector('.hero-reservation-link');
    const fixedButton = document.querySelector('.reservation-banner');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    if (!fixedButton) {
        return;
    }

    const setFixedVisible = visible => {
        document.body.classList.toggle('show-mobile-reservation', mobileQuery.matches && visible);
    };

    if (!heroButton) {
        setFixedVisible(true);
        mobileQuery.addEventListener('change', () => setFixedVisible(true));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        setFixedVisible(!entry.isIntersecting);
    }, {
        threshold: 0.15
    });

    observer.observe(heroButton);

    mobileQuery.addEventListener('change', () => {
        const rect = heroButton.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        setFixedVisible(!isVisible);
    });
}

// i18n切替の改善
function initFloatingSectionIndex() {
    const sections = [
        {
            el: document.querySelector('#menu'),
            en: 'MENU',
            ja: '\u30e1\u30cb\u30e5\u30fc'
        },
        {
            el: document.querySelector('.image-slider-section:not(.image-slider-section-top)'),
            en: 'MEDIA',
            ja: '\u63b2\u8f09\u30fb\u53d6\u6750\u306e\u8a18\u9332'
        },
        {
            el: document.querySelector('#access'),
            en: 'ABOUT',
            ja: '\u5e97\u8217\u60c5\u5831'
        }
    ].filter(item => item.el);

    if (!sections.length) return;

    const mask = document.createElement('div');
    mask.className = 'floating-section-content-mask';
    mask.setAttribute('aria-hidden', 'true');
    document.body.appendChild(mask);

    const index = document.createElement('div');
    index.className = 'floating-section-index';
    index.setAttribute('aria-hidden', 'true');
    index.innerHTML = `
        <span class="floating-section-index-en"></span>
        <span class="floating-section-index-ja"></span>
        <span class="floating-section-index-line"></span>
    `;
    document.body.appendChild(index);

    const enLabel = index.querySelector('.floating-section-index-en');
    const jaLabel = index.querySelector('.floating-section-index-ja');
    const revealTargets = sections.map(section => ({
        section,
        items: Array.from(section.el.querySelectorAll([
            '.menu-intro',
            '.menu-item',
            '#three-menu-container',
            '.menu-note',
            '.image-slider',
            '.about-content .info',
            '.map-container',
            '.footer-content'
        ].join(',')))
    }));
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-content-visible');
            }
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px'
    });

    revealTargets.forEach(({ items }) => {
        items.forEach((item, index) => {
            item.classList.add('floating-reveal-item');
            item.style.setProperty('--floating-reveal-delay', `${Math.min(index * 90, 360)}ms`);
            revealObserver.observe(item);
        });
    });

    let activeSection = null;
    let activeRevealTimer = null;
    let indexIsVisible = false;
    let lastScrollY = window.scrollY || window.pageYOffset || 0;

    const activateSectionContent = section => {
        window.clearTimeout(activeRevealTimer);

        revealTargets.forEach(({ items }) => {
            items.forEach(item => item.classList.remove('is-index-active'));
        });
        sections.forEach(({ el }) => el.classList.remove('is-index-active-section'));

        activeRevealTimer = window.setTimeout(() => {
            if (!indexIsVisible) return;
            section.el.classList.add('is-index-active-section');
            revealTargets
                .filter(group => group.section === section)
                .forEach(({ items }) => {
                    items.forEach(item => {
                        item.classList.add('is-index-active', 'is-content-visible');
                    });
                });
        }, 260);
    };

    const setActiveSection = section => {
        if (!section || activeSection === section) return;
        const lang = document.body.dataset.lang || 'ja';
        activeSection = section;
        enLabel.textContent = section.en;
        jaLabel.textContent = lang === 'en' ? section.en : section.ja;
        index.classList.remove('is-changing');
        requestAnimationFrame(() => index.classList.add('is-changing'));
        activateSectionContent(section);
    };

    const update = () => {
        const currentScrollY = window.scrollY || window.pageYOffset || 0;
        const isScrollingUp = currentScrollY < lastScrollY;
        document.body.classList.toggle('is-scrolling-up', isScrollingUp);
        document.body.classList.toggle('is-scrolling-down', !isScrollingUp);
        lastScrollY = currentScrollY;

        const viewportMarker = window.innerHeight * 0.34;
        let current = sections[0];

        sections.forEach(section => {
            const rect = section.el.getBoundingClientRect();
            if (rect.top <= viewportMarker && rect.bottom > viewportMarker) {
                current = section;
            }
        });

        const firstTop = sections[0].el.getBoundingClientRect().top;
        const lastBottom = sections[sections.length - 1].el.getBoundingClientRect().bottom;
        const shouldShow = firstTop <= window.innerHeight * 0.42 && lastBottom >= window.innerHeight * 0.18;

        index.classList.toggle('is-visible', shouldShow);
        mask.classList.toggle('is-visible', shouldShow);
        indexIsVisible = shouldShow;

        if (shouldShow) {
            setActiveSection(current);
        } else {
            window.clearTimeout(activeRevealTimer);
            activeSection = null;
            revealTargets.forEach(({ items }) => {
                items.forEach(item => item.classList.remove('is-index-active'));
            });
            sections.forEach(({ el }) => el.classList.remove('is-index-active-section'));
        }
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.addEventListener('poroni:langchange', () => {
        const previous = activeSection;
        activeSection = null;
        setActiveSection(previous);
    });

    update();
}

const setLang = lang => {
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-ja],[data-en]').forEach(el => {
        const content = el.getAttribute(`data-${lang}`);
        if (content) {
            if (el.matches('.menu-container .section-title, .about-inner .section-title')) {
                const label = document.createElement('span');
                label.className = 'section-title-text';
                label.textContent = content;
                el.replaceChildren(label);
                return;
            }

            // HTMLタグが含まれている場合はinnerHTMLを使用
            if (content.includes('<')) {
                el.innerHTML = content;
            } else {
                el.textContent = content;
            }
        }
    });

    // aria-label属性も言語切り替え
    const ariaElements = document.querySelectorAll('[aria-label-ja], [aria-label-en]');
    ariaElements.forEach(el => {
        const ariaContent = el.getAttribute(`aria-label-${lang}`);
        if (ariaContent) {
            el.setAttribute('aria-label', ariaContent);
        }
    });

    document.body.dataset.lang = lang;
    document.dispatchEvent(new CustomEvent('poroni:langchange'));
};

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        setLang(e.currentTarget.dataset.lang);
        document.querySelector('.hamburger')?.classList.remove('active');
        document.querySelector('.nav-links')?.classList.remove('active');
    });
});

// 初期化
setLang(document.body.dataset.lang || 'ja');

document.addEventListener('DOMContentLoaded', function () {
    initMobileReservationToggle();
    initThreeMenuSlider();
    initFloatingSectionIndex();
    initThreeSlider();
    initScrollVelocityInertia();
});

// Three.js 3Dスライダーの初期化
function initScrollVelocityInertia() {
    const targetSelector = [
        '.section-title',
        '.menu-intro p',
        '.menu-item-content h3',
        '.menu-item-description',
        '.menu-item-tax',
        '.menu-item-time',
        '.menu-note p',
        '.menu-item-price',
        '.menu-badge',
        '.info h3',
        '.info p',
        '.about-content .info p',
        '.hero-reservation-link',
        '.reservation-banner',
        '.nav-links a',
        '.footer-info p',
        '.footer-hours p',
        '.footer-bottom p'
    ].join(',');

    const wrapTargets = () => {
        document.querySelectorAll(targetSelector).forEach(target => {
            if (target.querySelector(':scope > .scroll-velocity-inner')) return;

            const wrapper = document.createElement('span');
            wrapper.className = 'scroll-velocity-inner';
            while (target.firstChild) {
                wrapper.appendChild(target.firstChild);
            }
            target.appendChild(wrapper);
        });
    };

    wrapTargets();
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', () => {
            window.setTimeout(wrapTargets, 0);
        });
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let targetVelocity = 0;
    let currentVelocity = 0;
    let isAnimating = false;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const animate = () => {
        currentVelocity += (targetVelocity - currentVelocity) * 0.18;
        targetVelocity *= 0.82;

        if (Math.abs(targetVelocity) < 0.001 && Math.abs(currentVelocity) < 0.001) {
            targetVelocity = 0;
            currentVelocity = 0;
            isAnimating = false;
        }

        root.style.setProperty('--scroll-velocity-rotate', `${currentVelocity * 2.2}deg`);
        root.style.setProperty('--scroll-velocity-skew', `${currentVelocity * -1.2}deg`);
        root.style.setProperty('--scroll-velocity-lift', `${currentVelocity * -5}px`);

        if (isAnimating) requestAnimationFrame(animate);
    };

    const kick = () => {
        if (isAnimating) return;
        isAnimating = true;
        requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', () => {
        const now = performance.now();
        const deltaY = window.scrollY - lastY;
        const deltaTime = Math.max(16, now - lastTime);
        targetVelocity = clamp(deltaY / deltaTime, -1, 1);
        lastY = window.scrollY;
        lastTime = now;
        kick();
    }, { passive: true });
}

function initMenuSlider() {
    const track = document.querySelector('.menu-grid');
    if (!track) return;

    const items = Array.from(track.querySelectorAll('.menu-item'));
    if (items.length < 2) return;

    track.classList.add('menu-slider-track');
    items.forEach((item, index) => {
        item.classList.toggle('is-active', index === 0);
    });

    const controls = document.createElement('div');
    controls.className = 'menu-slider-controls';
    controls.innerHTML = `
        <button type="button" class="menu-slider-btn menu-slider-prev" aria-label="Previous menu">
            <i class="fas fa-chevron-left" aria-hidden="true"></i>
        </button>
        <button type="button" class="menu-slider-btn menu-slider-next" aria-label="Next menu">
            <i class="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
    `;
    track.insertAdjacentElement('afterend', controls);

    let currentIndex = 0;
    let autoTimer = null;

    const setActive = index => {
        currentIndex = (index + items.length) % items.length;
        const activeItem = items[currentIndex];
        const targetLeft = activeItem.offsetLeft - track.offsetLeft - ((track.clientWidth - activeItem.clientWidth) / 2);
        track.scrollTo({
            left: targetLeft,
            behavior: 'smooth',
        });
        items.forEach((item, itemIndex) => {
            item.classList.toggle('is-active', itemIndex === currentIndex);
        });
    };

    const restartAuto = () => {
        window.clearInterval(autoTimer);
        autoTimer = window.setInterval(() => {
            setActive(currentIndex + 1);
        }, 5200);
    };

    controls.querySelector('.menu-slider-prev').addEventListener('click', () => {
        setActive(currentIndex - 1);
        restartAuto();
    });

    controls.querySelector('.menu-slider-next').addEventListener('click', () => {
        setActive(currentIndex + 1);
        restartAuto();
    });

    track.addEventListener('scroll', () => {
        const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
        let closestIndex = currentIndex;
        let closestDistance = Infinity;

        items.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;
            const distance = Math.abs(trackCenter - itemCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        currentIndex = closestIndex;
        items.forEach((item, index) => {
            item.classList.toggle('is-active', index === currentIndex);
        });
    }, { passive: true });

    track.addEventListener('pointerdown', () => window.clearInterval(autoTimer));
    track.addEventListener('pointerup', restartAuto);
    track.addEventListener('mouseenter', () => window.clearInterval(autoTimer));
    track.addEventListener('mouseleave', restartAuto);

    restartAuto();
}

function initThreeMenuSlider() {
    const fallbackGrid = document.querySelector('.menu-grid');
    if (!fallbackGrid || typeof THREE === 'undefined') return;

    const menuItems = Array.from(fallbackGrid.querySelectorAll('.menu-item'));
    if (!menuItems.length) return;

    const section = fallbackGrid.closest('.menu-section');
    const container = document.createElement('div');
    container.id = 'three-menu-container';
    fallbackGrid.insertAdjacentElement('beforebegin', container);
    section?.classList.add('has-three-menu');

    const itemsData = menuItems.map(item => {
        const lines = Array.from(item.querySelectorAll('.menu-item-time')).map(el => el.textContent.trim());
        return {
            image: item.querySelector('.menu-item-image img')?.getAttribute('src') || '',
            badge: item.querySelector('.menu-badge')?.textContent.trim() || '',
            title: item.querySelector('h3')?.textContent.trim() || '',
            price: item.querySelector('.menu-item-price')?.textContent.trim() || '',
            tax: item.querySelector('.menu-item-tax')?.textContent.trim() || '',
            description: item.querySelector('.menu-item-description')?.textContent.trim() || '',
            times: lines
        };
    });

    const scene = new THREE.Scene();
    const getAspect = () => container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(38, getAspect(), 0.1, 1000);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.classList.add('three-menu-cards-canvas');
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.92));

    const light = new THREE.DirectionalLight(0xfff4e8, 0.75);
    light.position.set(4, 8, 10);
    scene.add(light);

    let cardWidth = 0;
    let cardHeight = 0;
    let cardGap = 0;
    let maxOffset = 0;
    const cardMeshes = [];

    const getMenuLayout = () => {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || 330;
        const aspect = width / height;
        const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.position.z;
        const visibleWidth = visibleHeight * aspect;
        const isMobile = width <= 768;

        if (isMobile) {
            const mobileCardWidth = visibleWidth * 0.72;

            return {
                cardWidth: mobileCardWidth,
                cardHeight: mobileCardWidth * 0.5625,
                cardGap: mobileCardWidth + 0.75
            };
        }

        return {
            cardWidth: 7.15,
            cardHeight: 4.02,
            cardGap: 7.65
        };
    };

    const applyMenuLayout = () => {
        const layout = getMenuLayout();
        cardWidth = layout.cardWidth;
        cardHeight = layout.cardHeight;
        cardGap = layout.cardGap;
        maxOffset = Math.max(0, (itemsData.length - 1) * cardGap);
        targetOffset = Math.max(0, Math.min(maxOffset, targetOffset));
        currentOffset = Math.max(0, Math.min(maxOffset, currentOffset));

        cardMeshes.forEach(mesh => {
            mesh.geometry.dispose();
            mesh.geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
        });
    };

    const wrapText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) => {
        const chars = Array.from(text);
        const lines = [];
        let line = '';

        chars.forEach(char => {
            const testLine = line + char;
            if (ctx.measureText(testLine).width > maxWidth && line) {
                lines.push(line);
                line = char;
            } else {
                line = testLine;
            }
        });

        if (line) lines.push(line);

        lines.slice(0, maxLines).forEach((wrappedLine, index) => {
            ctx.fillText(
                index === maxLines - 1 && lines.length > maxLines ? `${wrappedLine.slice(0, -1)}...` : wrappedLine,
                x,
                y + index * lineHeight
            );
        });

        return Math.min(lines.length, maxLines) * lineHeight;
    };

    const drawRoundedRect = (ctx, x, y, width, height, radiusValue) => {
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, width, height, radiusValue);
        } else {
            ctx.moveTo(x + radiusValue, y);
            ctx.lineTo(x + width - radiusValue, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radiusValue);
            ctx.lineTo(x + width, y + height - radiusValue);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radiusValue, y + height);
            ctx.lineTo(x + radiusValue, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radiusValue);
            ctx.lineTo(x, y + radiusValue);
            ctx.quadraticCurveTo(x, y, x + radiusValue, y);
        }
        ctx.closePath();
    };

    itemsData.forEach((item, index) => {
        const canvas = document.createElement('canvas');
        const baseWidth = 1280;
        const baseHeight = 720;
        const imageWidth = 430;
        const contentX = 510;
        const contentMaxWidth = 660;
        const lineEndX = 1160;

        canvas.width = 2048;
        canvas.height = 1152;
        const ctx = canvas.getContext('2d');
        const scale2d = canvas.width / baseWidth;

        const drawCard = image => {
            ctx.setTransform(scale2d, 0, 0, scale2d, 0, 0);
            ctx.clearRect(0, 0, baseWidth, baseHeight);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.save();
            drawRoundedRect(ctx, 0, 0, baseWidth, baseHeight, 34);
            ctx.clip();

            ctx.fillStyle = '#fffaf3';
            ctx.fillRect(0, 0, baseWidth, baseHeight);

            if (image) {
                ctx.drawImage(image, 0, 0, imageWidth, baseHeight);
                const imageShade = ctx.createLinearGradient(0, 0, imageWidth, 0);
                imageShade.addColorStop(0, 'rgba(18, 10, 5, 0.04)');
                imageShade.addColorStop(1, 'rgba(18, 10, 5, 0.18)');
                ctx.fillStyle = imageShade;
                ctx.fillRect(0, 0, imageWidth, baseHeight);
            }

            ctx.fillStyle = '#211b17';
            ctx.fillRect(imageWidth, 0, baseWidth - imageWidth, baseHeight);
            ctx.fillStyle = '#fffaf3';
            ctx.fillRect(imageWidth + 16, 0, baseWidth - imageWidth - 16, baseHeight);

            ctx.fillStyle = '#683612';
            ctx.font = '700 36px "Noto Serif JP", serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            let y = 74;
            if (item.badge) {
                ctx.fillStyle = '#683612';
                drawRoundedRect(ctx, contentX, y, 166, 50, 4);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.font = '700 24px "Noto Serif JP", serif';
                ctx.fillText(item.badge, contentX + 26, y + 12);
                y += 78;
            }

            ctx.fillStyle = '#17110d';
            ctx.font = '800 58px "Noto Serif JP", serif';
            y += wrapText(ctx, item.title, contentX, y, contentMaxWidth, 68, 2) + 14;

            ctx.fillStyle = '#683612';
            ctx.font = '600 74px "Noto Serif JP", serif';
            ctx.fillText(item.price, contentX, y);
            y += 76;

            ctx.fillStyle = 'rgba(23, 17, 13, 0.84)';
            ctx.font = '500 31px "Noto Serif JP", serif';
            ctx.fillText(item.tax, contentX + 4, y);
            y += 64;

            ctx.fillStyle = 'rgba(23, 17, 13, 0.92)';
            ctx.font = '500 34px "Noto Serif JP", serif';
            y += wrapText(ctx, item.description, contentX, y, contentMaxWidth, 48, 3) + 22;

            ctx.strokeStyle = 'rgba(104, 54, 18, 0.26)';
            ctx.beginPath();
            ctx.moveTo(contentX, y);
            ctx.lineTo(lineEndX, y);
            ctx.stroke();
            y += 26;

            ctx.fillStyle = 'rgba(23, 17, 13, 0.9)';
            ctx.font = '500 30px "Noto Serif JP", serif';
            item.times.forEach(time => {
                y += wrapText(ctx, time, contentX, y, contentMaxWidth, 42, 2) + 8;
            });

            ctx.restore();
            texture.needsUpdate = true;
        };

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
        mesh.userData.index = index;
        scene.add(mesh);
        cardMeshes.push(mesh);

        const image = new Image();
        image.onload = () => drawCard(image);
        image.src = item.image;
        drawCard(null);
    });

    let currentOffset = 0;
    let targetOffset = 0;
    let isDragging = false;
    let startX = 0;
    let previousOffset = 0;
    let dragVelocity = 0;
    let lastX = 0;
    let revealProgress = 0;

    applyMenuLayout();

    const getX = event => (event.touches ? event.touches[0].clientX : event.clientX);
    const snapToNearestMenuCard = () => {
        if (!cardGap) return;
        const nearestIndex = Math.round(targetOffset / cardGap);
        targetOffset = Math.max(0, Math.min(maxOffset, nearestIndex * cardGap));
    };

    const onPointerDown = event => {
        isDragging = true;
        startX = getX(event);
        lastX = startX;
        previousOffset = targetOffset;
        dragVelocity = 0;
    };

    const onPointerMove = event => {
        if (!isDragging) return;
        const x = getX(event);
        const deltaX = x - startX;
        dragVelocity = (x - lastX) * 0.018;
        lastX = x;
        targetOffset = Math.max(0, Math.min(maxOffset, previousOffset - deltaX * 0.018));
    };

    const onPointerUp = () => {
        if (!isDragging) return;
        isDragging = false;
        targetOffset = Math.max(0, Math.min(maxOffset, targetOffset - dragVelocity * 9));
        snapToNearestMenuCard();
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    window.addEventListener('resize', () => {
        camera.aspect = getAspect();
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        applyMenuLayout();
        snapToNearestMenuCard();
    });

    function animateMenu() {
        requestAnimationFrame(animateMenu);

        const targetReveal = section?.classList.contains('is-index-active-section') ? 1 : 0;
        revealProgress += (targetReveal - revealProgress) * 0.035;
        const revealDirection = document.body.classList.contains('is-scrolling-up') ? 1 : -1;

        const offsetEase = isDragging ? 0.16 : 0.055;
        currentOffset += (targetOffset - currentOffset) * offsetEase;

        cardMeshes.forEach((mesh, index) => {
            const x = index * cardGap - currentOffset;
            const distanceFromCenter = Math.abs(x);
            const depth = Math.max(0, 1 - distanceFromCenter / (cardGap * 1.15));
            const z = -distanceFromCenter * 0.42 + depth * 0.8;
            const y = depth * 0.08 + revealDirection * (1 - revealProgress) * 0.42;
            const scale = 0.86 + depth * 0.12;
            const targetPosition = new THREE.Vector3(x, y, z);
            const targetScale = new THREE.Vector3(scale, scale, 1);

            if (!mesh.userData.hasMenuPosition) {
                mesh.position.copy(targetPosition);
                mesh.scale.copy(targetScale);
                mesh.userData.hasMenuPosition = true;
            } else {
                mesh.position.lerp(targetPosition, 0.14);
                mesh.scale.lerp(targetScale, 0.12);
            }
            mesh.rotation.set(0, 0, 0);
            mesh.material.opacity = revealProgress;
            mesh.visible = revealProgress > 0.01;
        });

        renderer.render(scene, camera);
    }

    animateMenu();
}

function initThreeMediaCards(container, section, itemsData) {
    section?.classList.add('has-three', 'has-three-media');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.classList.add('three-media-cards-canvas');
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.15));

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 0.5);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);

    const mediaItems = [
        {
            src: itemsData[0]?.src || 'images/media/media1.jpg',
            type: 'MAGAZINE',
            title: ['\u6599\u7406\u738b\u56fd'],
            date: '2026.04'
        },
        {
            src: itemsData[1]?.src || 'images/media/media2.jpg',
            type: 'MOVIE',
            title: ['\u706b\u3068\u3001\u65ec\u3068\u3001\u4eba\u3068'],
            date: '2025.11',
            isMovie: true,
            url: itemsData[1]?.selectedUrl
        },
        {
            src: itemsData[2]?.src || 'images/media/media3.jpg',
            type: 'WEB',
            title: ['\u3053\u306e\u5834\u6240\u3067\u3057\u304b', '\u5473\u308f\u3048\u306a\u3044\u3082\u306e'],
            date: '2025.08'
        },
        {
            src: itemsData[3]?.src || 'images/media/media4.jpg',
            type: 'NEWSPAPER',
            title: ['\u5730\u57df\u306e\u672a\u6765\u3092\u3001', '\u98df\u3067\u3064\u306a\u3050'],
            date: '2025.06'
        }
    ];

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const cardMeshes = [];
    let anchors = [];
    let hoveredMesh = null;
    let cardWidth = 4.5;
    let cardHeight = 2.78;
    let revealProgress = 0;

    const lerp = (from, to, amount) => from + (to - from) * amount;
    const ease = amount => amount * amount * (3 - 2 * amount);

    const roundedRect = (ctx, x, y, width, height, radius) => {
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, width, height, radius);
            return;
        }
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    };

    const drawCoverImage = (ctx, image, width, height) => {
        const imageRatio = image.naturalWidth / image.naturalHeight;
        const canvasRatio = width / height;
        let sx = 0;
        let sy = 0;
        let sw = image.naturalWidth;
        let sh = image.naturalHeight;

        if (imageRatio > canvasRatio) {
            sw = image.naturalHeight * canvasRatio;
            sx = (image.naturalWidth - sw) / 2;
        } else {
            sh = image.naturalWidth / canvasRatio;
            sy = (image.naturalHeight - sh) / 2;
        }

        ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
    };

    const drawCard = (item, image) => {
        const canvas = document.createElement('canvas');
        canvas.width = 960;
        canvas.height = 594;
        const ctx = canvas.getContext('2d');

        ctx.save();
        roundedRect(ctx, 0, 0, canvas.width, canvas.height, 28);
        ctx.clip();
        ctx.fillStyle = '#1c1510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (image) {
            ctx.filter = 'saturate(0.82) contrast(0.95) brightness(0.82)';
            drawCoverImage(ctx, image, canvas.width, canvas.height);
            ctx.filter = 'none';
        }

        const sideShade = ctx.createLinearGradient(0, 0, canvas.width, 0);
        sideShade.addColorStop(0, 'rgba(18, 11, 6, 0.68)');
        sideShade.addColorStop(0.58, 'rgba(18, 11, 6, 0.14)');
        sideShade.addColorStop(1, 'rgba(18, 11, 6, 0.28)');
        ctx.fillStyle = sideShade;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const bottomShade = ctx.createLinearGradient(0, 260, 0, canvas.height);
        bottomShade.addColorStop(0, 'rgba(0, 0, 0, 0)');
        bottomShade.addColorStop(1, 'rgba(12, 8, 5, 0.78)');
        ctx.fillStyle = bottomShade;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.38)';
        ctx.shadowBlur = 18;
        ctx.font = '600 19px Georgia, serif';
        ctx.fillText(item.type, 70, 396);

        ctx.font = '500 40px "Shippori Mincho B1", "Noto Serif JP", serif';
        item.title.forEach((line, index) => {
            ctx.fillText(line, 70, 452 + index * 48);
        });

        ctx.font = '600 18px Georgia, serif';
        ctx.fillText(item.date, 70, 544);
        ctx.font = '400 42px Georgia, serif';
        ctx.fillText('\u2192', 835, 525);

        if (item.isMovie) {
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(480, 270, 48, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.86)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(466, 242);
            ctx.lineTo(466, 298);
            ctx.lineTo(508, 270);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
            ctx.fill();
        }

        ctx.restore();

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        return texture;
    };

    const updateLayout = () => {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || 760;
        const isMobile = width <= 640;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.position.z = isMobile ? 12.4 : 10.8;
        camera.updateProjectionMatrix();

        cardWidth = isMobile ? 3.08 : 3.78;
        cardHeight = cardWidth / 1.62;
        anchors = isMobile ? [
            { x: -1.7, y: 2.02, z: -0.22, rx: 0.018, ry: -0.16, rz: 0.085, s: 0.94, order: 5 },
            { x: 1.7, y: 1.2, z: 0.02, rx: 0.018, ry: 0.16, rz: -0.07, s: 0.94, order: 9 },
            { x: -1.68, y: -1.28, z: 0.08, rx: -0.012, ry: -0.13, rz: 0.025, s: 0.94, order: 9 },
            { x: 1.68, y: -2.06, z: -0.24, rx: -0.012, ry: 0.13, rz: -0.055, s: 0.94, order: 5 }
        ] : [
            { x: -3.35, y: 1.62, z: -0.42, rx: 0.018, ry: -0.18, rz: 0.105, s: 1, order: 5 },
            { x: 3.35, y: 1.52, z: 0.02, rx: 0.018, ry: 0.18, rz: -0.08, s: 1, order: 9 },
            { x: -3.25, y: -1.5, z: 0.08, rx: -0.012, ry: -0.14, rz: 0.025, s: 1, order: 9 },
            { x: 3.25, y: -1.62, z: -0.44, rx: -0.012, ry: 0.14, rz: -0.055, s: 1, order: 5 }
        ];

        cardMeshes.forEach(mesh => {
            const anchor = anchors[mesh.userData.index];
            mesh.geometry.dispose();
            mesh.geometry = new THREE.PlaneGeometry(cardWidth, cardHeight, 10, 4);
            mesh.position.set(anchor.x, anchor.y, anchor.z);
            mesh.rotation.set(anchor.rx, anchor.ry, anchor.rz);
            mesh.scale.set(anchor.s, anchor.s, 1);
            mesh.material.opacity = 0.96;
            mesh.renderOrder = anchor.order;
        });
    };

    mediaItems.forEach((item, index) => {
        const material = new THREE.MeshStandardMaterial({
            map: drawCard(item),
            transparent: true,
            roughness: 0.5,
            metalness: 0.02,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 10, 4), material);
        mesh.userData = { index, url: item.url };
        scene.add(mesh);
        cardMeshes.push(mesh);

        const image = new Image();
        image.onload = () => {
            material.map?.dispose();
            material.map = drawCard(item, image);
            material.needsUpdate = true;
        };
        image.src = item.src;
    });

    const getAnchorAt = value => {
        const count = anchors.length;
        const wrapped = ((value % count) + count) % count;
        const base = Math.floor(wrapped);
        const next = (base + 1) % count;
        const amount = ease(wrapped - base);
        const a = anchors[base];
        const b = anchors[next];

        return {
            x: lerp(a.x, b.x, amount),
            y: lerp(a.y, b.y, amount),
            z: lerp(a.z, b.z, amount),
            rx: lerp(a.rx, b.rx, amount),
            ry: lerp(a.ry, b.ry, amount),
            rz: lerp(a.rz, b.rz, amount),
            s: lerp(a.s, b.s, amount),
            order: amount < 0.5 ? a.order : b.order
        };
    };

    const updateHover = event => {
        const rect = container.getBoundingClientRect();
        const clientX = event.clientX;
        const clientY = event.clientY;
        if (clientX === undefined || clientY === undefined) return;

        pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(cardMeshes);
        hoveredMesh = intersects.length ? intersects[0].object : null;
        container.style.cursor = hoveredMesh ? 'pointer' : 'default';
    };

    const onClick = () => {
        if (hoveredMesh?.userData.url) {
            window.open(hoveredMesh.userData.url, '_blank', 'noopener,noreferrer');
        }
    };

    container.addEventListener('mousemove', updateHover);
    container.addEventListener('click', onClick);
    container.addEventListener('mouseleave', () => {
        hoveredMesh = null;
        container.style.cursor = 'default';
    });
    window.addEventListener('resize', updateLayout);

    updateLayout();

    const animate = time => {
        requestAnimationFrame(animate);

        const targetReveal = section?.classList.contains('is-index-active-section') ? 1 : 0;
        revealProgress += (targetReveal - revealProgress) * 0.035;
        const revealDirection = document.body.classList.contains('is-scrolling-up') ? 1 : -1;

        cardMeshes.forEach((mesh, index) => {
            const anchor = getAnchorAt(index);
            const hoverScale = mesh === hoveredMesh ? 0.07 : 0;
            const drift = time * 0.00045 + index * 1.35;
            const floatY = Math.sin(drift) * 0.035;
            const floatX = Math.cos(drift * 0.8) * 0.015;
            const floatRot = Math.sin(drift * 0.7) * 0.006;
            const targetPosition = new THREE.Vector3(anchor.x + floatX, anchor.y + floatY + revealDirection * (1 - revealProgress) * 0.52, anchor.z);
            const targetScale = new THREE.Vector3(anchor.s + hoverScale, anchor.s + hoverScale, 1);

            mesh.position.lerp(targetPosition, 0.12);
            mesh.scale.lerp(targetScale, 0.12);
            mesh.rotation.x += (anchor.rx - mesh.rotation.x) * 0.12;
            mesh.rotation.y += (anchor.ry - mesh.rotation.y) * 0.12;
            mesh.rotation.z += (anchor.rz + floatRot - mesh.rotation.z) * 0.12;
            mesh.material.opacity += ((0.96 * revealProgress) - mesh.material.opacity) * 0.1;
            mesh.visible = revealProgress > 0.01;
            mesh.renderOrder = anchor.order;
        });

        renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);
}

function initThreeSlider() {
    const containers = document.querySelectorAll('.three-slider-container, #three-slider-container');
    if (!containers.length || typeof THREE === 'undefined') return;

    containers.forEach(container => {

    const section = container.closest('.image-slider-section');
    if (section) section.classList.add('has-three');

    const defaultItemsData = [
        { src: 'images/1.jpg', caption: '炭火で仕上げた季節魚' },
        { src: 'images/2.jpg', caption: '季節野菜のひと皿' },
        { src: 'images/3.jpg', caption: '余韻を楽しむ甘味' },
        { src: 'images/4.jpg', caption: '自家焙煎コーヒー' },
        { src: 'images/5.jpg', caption: '旬を映す前菜' },
        { src: 'images/6.jpg', caption: '香りを重ねる一品' },
        { src: 'images/7.jpg', caption: '古民家で過ごす時間' },
        { src: 'images/8.jpg', caption: '季節を味わう椀物' },
        { src: 'images/9.jpg', caption: '素材を生かした逸品' },
        { src: 'images/10.jpg', caption: '締めくくりのひと皿' },
        { src: 'images/11.jpg', caption: '静けさに包まれる食卓' }
    ];
    const mediaItemsData = [
        { src: 'images/media/media1.jpg', caption: 'メディア掲載 1' },
        {
            src: 'images/media/media2.jpg',
            caption: 'Audi JAPAN様',
            selectedDescription: 'Audi JAPAN様に取材していただきました。',
            selectedUrl: 'https://www.audi-sales.co.jp/special_content/gourmet_a3sb/'
        },
        { src: 'images/media/media3.jpg', caption: 'メディア掲載 3' },
        { src: 'images/media/media4.jpg', caption: 'メディア掲載 4' }
    ];
    const itemsData = container.id === 'three-slider-container' ? mediaItemsData : defaultItemsData;

    if (container.id === 'three-slider-container') {
        initThreeMediaCards(container, section, itemsData);
        return;
    }

    const scene = new THREE.Scene();

    const getAspect = () => container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, getAspect(), 0.1, 1000);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const selectedCaption = document.createElement('div');
    selectedCaption.className = 'three-slider-selected-caption';
    selectedCaption.setAttribute('aria-hidden', 'true');
    container.appendChild(selectedCaption);
    selectedCaption.addEventListener('pointerdown', event => event.stopPropagation());
    selectedCaption.addEventListener('pointerup', event => event.stopPropagation());
    selectedCaption.addEventListener('mousedown', event => event.stopPropagation());
    selectedCaption.addEventListener('mouseup', event => event.stopPropagation());
    selectedCaption.addEventListener('touchstart', event => event.stopPropagation(), { passive: true });
    selectedCaption.addEventListener('touchend', event => event.stopPropagation());
    selectedCaption.addEventListener('click', event => event.stopPropagation());

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 0.5);
    dirLight.position.set(5, 10, 12);
    scene.add(dirLight);

    const count = itemsData.length;
    let radius = 0;
    let cardWidth = 0;
    let cardHeight = 0;

    const getCarouselLayout = () => {
        const width = container.clientWidth || window.innerWidth;
        const isMobile = width <= 768;

        return {
            radius: isMobile ? 5.6 : 6.6,
            cardWidth: isMobile ? 2.8 : 3.25
        };
    };

    const applyCarouselLayout = () => {
        const layout = getCarouselLayout();
        radius = layout.radius;
        cardWidth = layout.cardWidth;
        cardHeight = cardWidth;

        cardMeshes.forEach(mesh => {
            mesh.geometry.dispose();
            mesh.geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
        });

        if (selectedDisplayMesh) {
            selectedDisplayMesh.geometry.dispose();
            selectedDisplayMesh.geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
        }
    };

    const cardsGroup = new THREE.Group();
    scene.add(cardsGroup);

    const cardMeshes = [];
    const selectedTextures = [];

    itemsData.forEach((item, index) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // 角丸クリッピング
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(0, 0, 512, 512, 40);
        } else {
            const r = 40;
            ctx.moveTo(r, 0);
            ctx.lineTo(512 - r, 0);
            ctx.quadraticCurveTo(512, 0, 512, r);
            ctx.lineTo(512, 512 - r);
            ctx.quadraticCurveTo(512, 512, 512 - r, 512);
            ctx.lineTo(r, 512);
            ctx.quadraticCurveTo(0, 512, 0, 512 - r);
            ctx.lineTo(0, r);
            ctx.quadraticCurveTo(0, 0, r, 0);
            ctx.closePath();
        }
        ctx.clip();

        ctx.fillStyle = '#1e1611';
        ctx.fillRect(0, 0, 512, 512);

        const canvasTexture = new THREE.CanvasTexture(canvas);
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshStandardMaterial({
            map: canvasTexture,
            roughness: 0.3,
            metalness: 0.05,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = {
            index,
            caption: item.caption,
            src: item.src,
            selectedDescription: item.selectedDescription,
            selectedUrl: item.selectedUrl
        };
        cardsGroup.add(mesh);
        cardMeshes.push(mesh);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = item.src;
        img.onload = () => {
            const selectedCanvas = document.createElement('canvas');
            selectedCanvas.width = 512;
            selectedCanvas.height = 512;
            const selectedCtx = selectedCanvas.getContext('2d');
            selectedCtx.beginPath();
            if (typeof selectedCtx.roundRect === 'function') {
                selectedCtx.roundRect(0, 0, 512, 512, 40);
            } else {
                const selectedRadius = 40;
                selectedCtx.moveTo(selectedRadius, 0);
                selectedCtx.lineTo(512 - selectedRadius, 0);
                selectedCtx.quadraticCurveTo(512, 0, 512, selectedRadius);
                selectedCtx.lineTo(512, 512 - selectedRadius);
                selectedCtx.quadraticCurveTo(512, 512, 512 - selectedRadius, 512);
                selectedCtx.lineTo(selectedRadius, 512);
                selectedCtx.quadraticCurveTo(0, 512, 0, 512 - selectedRadius);
                selectedCtx.lineTo(0, selectedRadius);
                selectedCtx.quadraticCurveTo(0, 0, selectedRadius, 0);
                selectedCtx.closePath();
            }
            selectedCtx.clip();
            selectedCtx.drawImage(img, 0, 0, 512, 512);
            const selectedTexture = new THREE.CanvasTexture(selectedCanvas);
            selectedTexture.needsUpdate = true;
            selectedTextures[index] = selectedTexture;

            ctx.drawImage(img, 0, 0, 512, 512);

            const grad = ctx.createLinearGradient(0, 340, 0, 512);
            grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
            grad.addColorStop(1, 'rgba(18, 11, 6, 0.88)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 320, 512, 192);

            ctx.fillStyle = '#ffffff';
            ctx.font = '500 24px "Noto Serif JP", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.caption, 256, 452);

            canvasTexture.needsUpdate = true;
        };
    });

    let selectedDisplayMesh = null;
    const selectedDisplayMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthTest: false
    });
    selectedDisplayMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), selectedDisplayMaterial);
    selectedDisplayMesh.visible = false;
    selectedDisplayMesh.renderOrder = 20;
    selectedDisplayMesh.position.set(0, 0, 1.4);
    scene.add(selectedDisplayMesh);

    const angleStep = (Math.PI * 2) / count;
    const initialRotationOffset = Math.PI / count;
    let currentRotation = initialRotationOffset;
    let targetRotation = initialRotationOffset;
    let isDragging = false;
    let startX = 0;
    let previousRotation = 0;
    let dragVelocity = 0;
    let lastX = 0;
    let hoveredMesh = null;
    let dragDistance = 0;
    let selectedIndex = null;
    let returningIndex = null;
    let selectedDisplayTarget = null;
    const selectedDisplayEase = 0.045;

    applyCarouselLayout();

    const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);
    const getY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);
    const normalizeAngle = angle => {
        const turn = Math.PI * 2;
        return ((angle + Math.PI) % turn + turn) % turn - Math.PI;
    };
    const lerpAngle = (current, target, amount) => {
        return current + normalizeAngle(target - current) * amount;
    };

    const selectMesh = index => {
        const sourceMesh = cardMeshes[index];
        selectedIndex = index;
        returningIndex = null;
        selectedDisplayTarget = 'center';
        selectedCaption.replaceChildren();
        if (sourceMesh.userData.selectedDescription) {
            const description = document.createElement('p');
            description.textContent = sourceMesh.userData.selectedDescription;
            selectedCaption.appendChild(description);
        } else {
            selectedCaption.textContent = sourceMesh.userData.caption || '';
        }
        if (sourceMesh.userData.selectedUrl) {
            const link = document.createElement('a');
            link.href = sourceMesh.userData.selectedUrl;
            link.textContent = sourceMesh.userData.selectedUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.addEventListener('pointerdown', event => event.stopPropagation());
            link.addEventListener('pointerup', event => event.stopPropagation());
            link.addEventListener('click', event => event.stopPropagation());
            selectedCaption.appendChild(link);
        }
        selectedCaption.classList.add('is-visible');
        selectedCaption.setAttribute('aria-hidden', 'false');
        selectedDisplayMaterial.map = selectedTextures[index] || sourceMesh.material.map;
        selectedDisplayMaterial.opacity = sourceMesh.material.opacity;
        selectedDisplayMaterial.needsUpdate = true;
        selectedDisplayMesh.visible = true;
        selectedDisplayMesh.position.copy(sourceMesh.position);
        selectedDisplayMesh.rotation.copy(sourceMesh.rotation);
        selectedDisplayMesh.rotation.y = normalizeAngle(selectedDisplayMesh.rotation.y);
        selectedDisplayMesh.scale.copy(sourceMesh.scale);
    };

    const clearSelectedMesh = () => {
        if (selectedIndex === null) return;
        returningIndex = selectedIndex;
        selectedIndex = null;
        selectedDisplayTarget = 'carousel';
        selectedCaption.classList.remove('is-visible');
        selectedCaption.setAttribute('aria-hidden', 'true');
    };

    const updateHoveredMesh = (e) => {
        const rect = container.getBoundingClientRect();
        const clientX = getX(e);
        const clientY = getY(e);
        if (clientX === undefined || clientY === undefined) return;

        const mouseX = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
        const mouseY = -((clientY - rect.top) / container.clientHeight) * 2 + 1;

        const hoverableMeshes = cardMeshes.filter(mesh =>
            mesh.userData.isHoverable !== false && mesh.userData.index !== selectedIndex
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
        const intersects = raycaster.intersectObjects(hoverableMeshes);

        if (intersects.length > 0) {
            hoveredMesh = intersects[0].object;
            container.style.cursor = isDragging ? 'grabbing' : 'pointer';
        } else {
            hoveredMesh = null;
            container.style.cursor = isDragging ? 'grabbing' : 'grab';
        }
    };

    const onPointerDown = (e) => {
        isDragging = true;
        startX = getX(e);
        lastX = startX;
        previousRotation = targetRotation;
        dragVelocity = 0;
        dragDistance = 0;
        updateHoveredMesh(e);
    };

    const onPointerMove = (e) => {
        if (isDragging) {
            const x = getX(e);
            if (x !== undefined) {
                const deltaX = x - startX;
                dragVelocity = (x - lastX) * 0.0025;
                dragDistance = Math.max(dragDistance, Math.abs(deltaX));
                if (dragDistance >= 8) {
                    clearSelectedMesh();
                }
                lastX = x;
                targetRotation = previousRotation + deltaX * 0.0025;
            }
        }

        updateHoveredMesh(e);
    };

    const onPointerUp = () => {
        if (isDragging) {
            isDragging = false;
            targetRotation += dragVelocity * 8;
            if (dragDistance < 8 && hoveredMesh) {
                selectMesh(hoveredMesh.userData.index);
            } else if (dragDistance < 8) {
                clearSelectedMesh();
            }
        }
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    window.addEventListener('resize', () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        applyCarouselLayout();
    });

    function animate() {
        requestAnimationFrame(animate);

        if (!isDragging) {
            targetRotation -= 0.00045; // ゆっくりとした逆回転
        }

        currentRotation += (targetRotation - currentRotation) * 0.08;

        cardMeshes.forEach((mesh, index) => {
            const angle = index * angleStep + currentRotation;

            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius - radius;
            const y = Math.sin(angle * 2) * 0.15;

            mesh.position.set(x, y, z);
            mesh.rotation.y = angle;

            const normZ = (z + radius) / radius;
            const isHoverable = normZ > 0.12;
            const isSelected = index === selectedIndex || index === returningIndex;
            mesh.userData.isHoverable = isHoverable;
            if (!isHoverable && mesh === hoveredMesh) {
                hoveredMesh = null;
            }

            const baseScale = 0.82 + normZ * 0.22;
            const hoverBoost = mesh === hoveredMesh && isHoverable ? 0.1 : 0;
            const targetScale = baseScale + hoverBoost;
            const rearCenterAmount = Math.max(0, (-Math.cos(angle) - 0.48) / 0.52);
            const centerAmount = Math.max(0, 1 - Math.abs(Math.sin(angle)) / 2.4);
            const poroniOcclusionFade = Math.min(1, rearCenterAmount * centerAmount);
            const baseOpacity = Math.max(0.35, Math.min(1.0, 0.4 + normZ * 0.6));

            mesh.visible = !isSelected;
            mesh.renderOrder = 0;
            mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);
            mesh.material.opacity = baseOpacity * (1 - poroniOcclusionFade);
            mesh.material.transparent = true;
        });

        if (selectedDisplayMesh) {
            const selectedScale = container.clientWidth <= 768 ? 1.42 : 1.34;
            const hasSelection = selectedIndex !== null;
            const returnMesh = returningIndex === null ? null : cardMeshes[returningIndex];
            const targetPosition = hasSelection
                ? new THREE.Vector3(0, 0, 1.4)
                : returnMesh?.position.clone() || selectedDisplayMesh.position.clone();
            const targetRotation = hasSelection
                ? new THREE.Euler(0, 0, 0)
                : returnMesh?.rotation || selectedDisplayMesh.rotation;
            const targetScale = hasSelection
                ? new THREE.Vector3(selectedScale, selectedScale, 1)
                : returnMesh?.scale.clone() || new THREE.Vector3(1, 1, 1);
            const targetOpacity = hasSelection
                ? 1
                : returnMesh?.material.opacity || 0;

            selectedDisplayMesh.position.lerp(targetPosition, selectedDisplayEase);
            selectedDisplayMesh.rotation.x = lerpAngle(selectedDisplayMesh.rotation.x, targetRotation.x, selectedDisplayEase);
            selectedDisplayMesh.rotation.y = lerpAngle(selectedDisplayMesh.rotation.y, targetRotation.y, selectedDisplayEase);
            selectedDisplayMesh.rotation.z = lerpAngle(selectedDisplayMesh.rotation.z, targetRotation.z, selectedDisplayEase);
            selectedDisplayMesh.scale.lerp(targetScale, selectedDisplayEase);
            selectedDisplayMaterial.opacity += (targetOpacity - selectedDisplayMaterial.opacity) * selectedDisplayEase;

            if (
                returnMesh &&
                selectedDisplayMesh.position.distanceTo(returnMesh.position) < 0.05 &&
                Math.abs(selectedDisplayMaterial.opacity - targetOpacity) < 0.04
            ) {
                returningIndex = null;
                selectedDisplayTarget = null;
            }

            selectedDisplayMesh.visible = selectedDisplayMaterial.opacity > 0.01 || targetOpacity > 0;
        }

        renderer.render(scene, camera);
    }

    animate();
    });
}

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

    if (!heroButton || !fixedButton) {
        return;
    }

    const setFixedVisible = visible => {
        document.body.classList.toggle('show-mobile-reservation', mobileQuery.matches && visible);
    };

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
const setLang = lang => {
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-ja],[data-en]').forEach(el => {
        const content = el.getAttribute(`data-${lang}`);
        if (content) {
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
    initThreeSlider();
    initScrollVelocityInertia();
});

// Three.js 3Dスライダーの初期化
function initScrollVelocityInertia() {
    const targetSelector = [
        '.section-title',
        '.menu-intro p',
        '.menu-item-content h3',
        '.menu-item-price',
        '.menu-badge',
        '.info h3',
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

    applyMenuLayout();

    const getX = event => (event.touches ? event.touches[0].clientX : event.clientX);

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
    });

    function animateMenu() {
        requestAnimationFrame(animateMenu);

        currentOffset += (targetOffset - currentOffset) * 0.09;

        cardMeshes.forEach((mesh, index) => {
            const x = index * cardGap - currentOffset;
            const distanceFromCenter = Math.abs(x);
            const depth = Math.max(0, 1 - distanceFromCenter / (cardGap * 1.15));
            const z = -distanceFromCenter * 0.42 + depth * 0.8;
            const y = depth * 0.08;
            const scale = 0.86 + depth * 0.12;

            mesh.position.set(x, y, z);
            mesh.rotation.set(0, 0, 0);
            mesh.scale.setScalar(scale);
            mesh.material.opacity = 1;
        });

        renderer.render(scene, camera);
    }

    animateMenu();
}

function initThreeSlider() {
    const containers = document.querySelectorAll('.three-slider-container, #three-slider-container');
    if (!containers.length || typeof THREE === 'undefined') return;

    containers.forEach(container => {

    const section = container.closest('.image-slider-section');
    if (section) section.classList.add('has-three');

    const itemsData = [
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

    const scene = new THREE.Scene();

    const getAspect = () => container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, getAspect(), 0.1, 1000);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

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
            radius: isMobile ? 5.6 : 9.4,
            cardWidth: isMobile ? 2.8 : 4.5
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
    };

    const cardsGroup = new THREE.Group();
    scene.add(cardsGroup);

    const cardMeshes = [];

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
        mesh.userData = { index, caption: item.caption };
        cardsGroup.add(mesh);
        cardMeshes.push(mesh);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = item.src;
        img.onload = () => {
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

    const initialRotationOffset = Math.PI / count;
    let currentRotation = initialRotationOffset;
    let targetRotation = initialRotationOffset;
    let isDragging = false;
    let startX = 0;
    let previousRotation = 0;
    let dragVelocity = 0;
    let lastX = 0;
    let hoveredMesh = null;

    applyCarouselLayout();

    const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);
    const getY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);

    const onPointerDown = (e) => {
        isDragging = true;
        startX = getX(e);
        lastX = startX;
        previousRotation = targetRotation;
        dragVelocity = 0;
    };

    const onPointerMove = (e) => {
        if (isDragging) {
            const x = getX(e);
            if (x !== undefined) {
                const deltaX = x - startX;
                dragVelocity = (x - lastX) * 0.0025;
                lastX = x;
                targetRotation = previousRotation + deltaX * 0.0025;
            }
        }

        const rect = container.getBoundingClientRect();
        const clientX = getX(e);
        const clientY = getY(e);
        if (clientX !== undefined && clientY !== undefined) {
            const mouseX = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
            const mouseY = -((clientY - rect.top) / container.clientHeight) * 2 + 1;

            const hoverableMeshes = cardMeshes.filter(mesh => mesh.userData.isHoverable !== false);
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
        }
    };

    const onPointerUp = () => {
        if (isDragging) {
            isDragging = false;
            targetRotation += dragVelocity * 8;
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

        const angleStep = (Math.PI * 2) / count;
        cardMeshes.forEach((mesh, index) => {
            const angle = index * angleStep + currentRotation;

            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius - radius;
            const y = Math.sin(angle * 2) * 0.15;

            mesh.position.set(x, y, z);
            mesh.rotation.y = angle;

            const normZ = (z + radius) / radius;
            const isHoverable = normZ > 0.12;
            mesh.userData.isHoverable = isHoverable;
            if (!isHoverable && mesh === hoveredMesh) {
                hoveredMesh = null;
            }

            const targetScale = mesh === hoveredMesh && isHoverable ? 1.12 : 0.82 + normZ * 0.22;
            const rearCenterAmount = Math.max(0, (-Math.cos(angle) - 0.48) / 0.52);
            const centerAmount = Math.max(0, 1 - Math.abs(Math.sin(angle)) / 2.4);
            const poroniOcclusionFade = Math.min(1, rearCenterAmount * centerAmount);
            const baseOpacity = Math.max(0.35, Math.min(1.0, 0.4 + normZ * 0.6));

            mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1);
            mesh.material.opacity = baseOpacity * (1 - poroniOcclusionFade);
            mesh.material.transparent = true;
        });

        renderer.render(scene, camera);
    }

    animate();
    });
}

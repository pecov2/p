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
    // スクロールアニメーション
    const scrollIndicator = document.querySelector('.scroll-indicator');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });

    // メニューアイテムのホバーエフェクト
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.querySelector('.menu-item-overlay').style.opacity = '1';
        });
        item.addEventListener('mouseleave', () => {
            item.querySelector('.menu-item-overlay').style.opacity = '0';
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
            t /= d/2;
            if (t < 1) return c/2*t*t*t + b;
            t -= 2;
            return c/2*(t*t*t + 2) + b;
        }

        requestAnimationFrame(animation);
    }

    // すべてのアンカーリンクにスムーズスクロールを適用
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
        });
    });

    // ヘッダーの表示/非表示
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

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
    
    window.addEventListener('scroll', function() {
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
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // フォーカスが外れた時のアニメーション
        input.addEventListener('blur', function() {
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
            
            if (hamburger && navLinks) {
                // クリックイベント
                hamburger.addEventListener('click', function() {
                    this.classList.toggle('active');
                    navLinks.classList.toggle('active');
                });
                
                // メニューリンクをクリックしたらメニューを閉じる
                navLinks.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', function() {
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                    });
                });
            }
        }
    };

    mobileMenu.init();

    // スクロールインジケーター
    const sections = document.querySelectorAll('section[id]');
    const scrollDots = document.querySelectorAll('.scroll-dot');

    function updateScrollIndicator() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                scrollDots[index].classList.add('active');
            } else {
                scrollDots[index].classList.remove('active');
            }
        });
    }

    // スクロールイベントの監視
    window.addEventListener('scroll', updateScrollIndicator);

    // ドットのクリックイベント
    scrollDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const sectionId = sections[index].getAttribute('id');
            smoothScroll(`#${sectionId}`);
        });
    });

    // 初期表示時のスクロール位置を更新
    updateScrollIndicator();

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

// RSSフィードの読み込みと表示
function loadNews() {
    const newsList = document.getElementById('news-list');
    if (!newsList) return;

    // ローディング表示
    newsList.innerHTML = '<div class="news-loading">ニュースを読み込み中...</div>';

    // CORSプロキシを使用してRSSフィードを取得
    const rssUrl = 'https://ameblo.jp/grande-albero/rss20.xml';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;

    fetch(proxyUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.contents) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
                const items = xmlDoc.querySelectorAll('item');
                
                if (items.length === 0) {
                    throw new Error('RSSフィードにアイテムが見つかりません');
                }
                
                let newsHTML = '';
                const maxItems = 3; // 最新3件を表示
                
                items.forEach((item, index) => {
                    if (index < maxItems) {
                        const title = item.querySelector('title')?.textContent || '';
                        const link = item.querySelector('link')?.textContent || '';
                        const pubDate = item.querySelector('pubDate')?.textContent || '';
                        const description = item.querySelector('description')?.textContent || '';
                        
                        // 日付のフォーマット
                        const date = new Date(pubDate);
                        const formattedDate = Number.isNaN(date.getTime())
                            ? ''
                            : `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
                        const excerpt = description
                            .replace(/<[^>]*>/g, '')
                            .replace(/\s+/g, ' ')
                            .trim()
                            .slice(0, 78);
                        
                        if (index === 0) {
                            newsHTML += `
                                <article class="news-item news-item-featured">
                                    <a href="${link}" target="_blank" rel="noopener noreferrer" class="news-featured-image">
                                        <span class="news-badge">NEW</span>
                                        <img src="images/1.jpg" alt="">
                                    </a>
                                    <div class="news-featured-body">
                                        <div class="news-date">${formattedDate}</div>
                                        <h3 class="news-title">
                                            <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
                                        </h3>
                                        <p class="news-excerpt">${excerpt}</p>
                                        <a href="${link}" target="_blank" rel="noopener noreferrer" class="news-detail-link">詳しく見る</a>
                                    </div>
                                </article>
                            `;
                        } else {
                            newsHTML += `
                                <article class="news-item news-item-compact">
                                    <a href="${link}" target="_blank" rel="noopener noreferrer">
                                        <time class="news-date">${formattedDate}</time>
                                        <h3 class="news-title">${title}</h3>
                                        <span class="news-arrow">→</span>
                                    </a>
                                </article>
                            `;
                        }
                    }
                });
                
                // 「もっと見る」ボタンを追加
                newsHTML += `
                    <div class="news-more">
                        <a href="https://ameblo.jp/grande-albero/" target="_blank" rel="noopener noreferrer" class="more-btn">
                            <span data-ja="もっと見る" data-en="More">もっと見る</span>
                        </a>
                    </div>
                `;
                
                newsList.innerHTML = newsHTML;
                
                // お知らせアイテムにフェードインアニメーションを適用
                applyFadeInAnimation();
            } else {
                throw new Error('RSSフィードの内容が空です');
            }
        })
        .catch(error => {
            console.error('RSS読み込みエラー:', error);
            // エラー時は「もっと見る」ボタンのみ表示
            newsList.innerHTML = `
                <div class="news-error">ニュースの読み込みに失敗しました</div>
                <div class="news-more">
                    <a href="https://ameblo.jp/grande-albero/" target="_blank" rel="noopener noreferrer" class="more-btn">
                        <span data-ja="もっと見る" data-en="More">もっと見る</span>
                    </a>
                </div>
            `;
        });
}

// フェードインアニメーションを適用する関数
function applyFadeInAnimation() {
    const fadeElements = document.querySelectorAll('.news-item, .news-more');
    
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
}

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
    });
});

// 初期化
setLang(document.body.dataset.lang || 'ja');

// ページ読み込み時にニュースを読み込む
document.addEventListener('DOMContentLoaded', function() {
    initMobileReservationToggle();
    loadNews();
}); 

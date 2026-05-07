document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('section[id]');
    const fadeElements = document.querySelectorAll('.fade-in-section');
    const backToTopBtn = document.getElementById('backToTop');
    const typewriterElement = document.getElementById('typewriter');

    let typewriterRAFId = null;
    let restartDebounceTimer = null;

    function debounce(func, wait) {
        return function (...args) {
            clearTimeout(restartDebounceTimer);
            restartDebounceTimer = setTimeout(() => func.apply(this, args), wait);
        };
    }

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (hamburger) {
                hamburger.classList.remove('active');
            }

            if (navLinksContainer) {
                navLinksContainer.classList.remove('active');
            }
        });
    });

    function handleScrollEffects() {
        if (navbar) {
            navbar.style.boxShadow = window.scrollY > 50
                ? '0 2px 10px rgba(0, 0, 0, 0.1)'
                : 'none';
        }

        if (backToTopBtn) {
            backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        }

        fadeElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;

            if (isVisible) {
                element.classList.add('is-visible');
            }
        });

        if (!sections.length || !navLinks.length) {
            return;
        }

        let currentSectionId = '';
        sections.forEach((section) => {
            if (window.scrollY >= section.offsetTop - 200) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const isHashLink = href && href.startsWith('#');
            link.classList.toggle(
                'active',
                Boolean(isHashLink && href.substring(1) === currentSectionId)
            );
        });
    }

    function typewriterCycle() {
        if (!typewriterElement) {
            return;
        }

        if (typewriterRAFId) {
            cancelAnimationFrame(typewriterRAFId);
            typewriterRAFId = null;
        }

        const texts = [
            'From SCUPI to Pitt.',
            'Information Science and Industrial Engineering.',
            'Passionate about AI development.',
            'A cat lover... Also a dog lover.',
            'A foster volunteer for HARP at Pittsburgh!'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let nextUpdateTime = 0;

        const typingSpeed = 100;
        const deletingSpeed = 50;
        const pauseDuration = 2000;

        function animate(timestamp) {
            if (!typewriterElement) {
                typewriterRAFId = null;
                return;
            }

            if (timestamp < nextUpdateTime) {
                typewriterRAFId = requestAnimationFrame(animate);
                return;
            }

            const currentText = texts[textIndex];
            let delay = typingSpeed;

            if (isDeleting) {
                typewriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex -= 1;
                delay = deletingSpeed;

                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    delay = 500;
                }
            } else {
                typewriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex += 1;

                if (charIndex === currentText.length) {
                    isDeleting = true;
                    delay = pauseDuration;
                }
            }

            nextUpdateTime = timestamp + delay;
            typewriterRAFId = requestAnimationFrame(animate);
        }

        typewriterRAFId = requestAnimationFrame(animate);
    }

    const restartTypewriter = debounce(() => {
        if (typewriterElement && !typewriterRAFId) {
            typewriterElement.textContent = '';
            typewriterCycle();
        }
    }, 150);

    if (typewriterElement) {
        window.addEventListener('load', () => {
            handleScrollEffects();

            setTimeout(() => {
                if (typewriterRAFId) {
                    cancelAnimationFrame(typewriterRAFId);
                    typewriterRAFId = null;
                }
                restartTypewriter();
            }, 500);
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                if (typewriterRAFId) {
                    cancelAnimationFrame(typewriterRAFId);
                    typewriterRAFId = null;
                }
                restartTypewriter();
            }
        });

        window.addEventListener('resize', debounce(() => {
            if (typewriterRAFId) {
                cancelAnimationFrame(typewriterRAFId);
                typewriterRAFId = null;
            }
            restartTypewriter();
        }, 250));
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function setupSnowflakeEffect() {
        const container = document.querySelector('.contact-image-container');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!container || prefersReducedMotion) {
            return;
        }

        const snowflakeChars = ['\u2744', '\u2745', '\u2746', '\u273B', '\u273C', '\u2749', '\u274A'];
        const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
        const maxSnowflakes = 18;

        let intervalId = null;
        let pointerX = null;
        let pointerY = null;

        function createSnowflake() {
            if (pointerX === null || pointerY === null) {
                return;
            }

            if (container.querySelectorAll('.snowflake').length >= maxSnowflakes) {
                return;
            }

            const rect = container.getBoundingClientRect();
            const snowflake = document.createElement('span');
            const size = 10 + Math.random() * 18;
            const duration = 4.5 + Math.random() * 2.5;
            const drift = -40 + Math.random() * 80;
            const fallDistance = Math.min(container.clientHeight || window.innerHeight, window.innerHeight) + 120;

            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
            snowflake.style.left = `${pointerX - rect.left}px`;
            snowflake.style.top = `${pointerY - rect.top}px`;
            snowflake.style.fontSize = `${size}px`;
            snowflake.style.setProperty('--snow-duration', `${duration}s`);
            snowflake.style.setProperty('--snow-drift', `${drift}px`);
            snowflake.style.setProperty('--snow-fall-distance', `${fallDistance}px`);

            container.appendChild(snowflake);
            window.setTimeout(() => snowflake.remove(), duration * 1000 + 400);
        }

        if (isCoarsePointer) {
            container.addEventListener('touchstart', (event) => {
                const touch = event.touches[0];
                pointerX = touch.clientX;
                pointerY = touch.clientY;
                createSnowflake();
            }, { passive: true });
            return;
        }

        container.addEventListener('pointermove', (event) => {
            pointerX = event.clientX;
            pointerY = event.clientY;
        });

        container.addEventListener('pointerenter', (event) => {
            pointerX = event.clientX;
            pointerY = event.clientY;

            if (!intervalId) {
                intervalId = window.setInterval(createSnowflake, 280);
            }
        });

        container.addEventListener('pointerleave', () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }

            pointerX = null;
            pointerY = null;
        });
    }

    function initWorldMap() {
        const wrapper = document.getElementById('world-map-wrapper');
        const tooltip = document.getElementById('map-tooltip');

        if (!wrapper || !tooltip || typeof am5 === 'undefined') {
            return;
        }

        const visitedCountries = {
            CN: 'Hunan, Sichuan, Zhejiang, Shanghai, Yunnan',
            JP: 'Kyoto, Hokkaido',
            US: 'Pittsburgh, San Francisco, Los Angeles, New York, New Brunswick, Philadelphia, Washington DC'
        };

        const root = am5.Root.new('world-map-wrapper');
        root.setThemes([am5themes_Animated.new(root)]);

        if (root._logo) {
            root._logo.set('forceHidden', true);
        }

        const chart = root.container.children.push(am5map.MapChart.new(root, {
            panX: 'none',
            panY: 'none',
            projection: am5map.geoMercator(),
            maxZoomLevel: 1,
            minZoomLevel: 1,
            wheelSensitivity: 0,
            paddingBottom: 20,
            paddingTop: 20,
            paddingLeft: 20,
            paddingRight: 20,
            homeGeoPoint: { longitude: 0, latitude: 20 },
            homeZoomLevel: 1
        }));

        const worldSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            exclude: ['AQ']
        }));

        worldSeries.mapPolygons.template.setAll({
            interactive: true,
            fill: am5.color(0xe0e0e0),
            stroke: am5.color(0xffffff),
            strokeWidth: 0.5
        });

        worldSeries.mapPolygons.template.states.create('hover', {
            fill: am5.color(0xd0d0d0)
        });

        worldSeries.mapPolygons.template.adapters.add('fill', (fill, target) => {
            const countryId = target.dataItem?.dataContext?.id;
            return visitedCountries[countryId] ? am5.color(0xB0E0E6) : fill;
        });

        function updateTooltipPosition(event) {
            if (!tooltip.classList.contains('visible') || !event?.point) {
                return;
            }

            tooltip.style.left = `${event.point.x}px`;
            tooltip.style.top = `${event.point.y}px`;
        }

        function showTooltip(event, content) {
            tooltip.innerHTML = `<span class="tooltip-title">${content}</span><div class="tooltip-arrow"></div>`;
            tooltip.classList.add('visible');
            updateTooltipPosition(event);
        }

        function hideTooltip() {
            tooltip.classList.remove('visible');
        }

        chart.events.on('globalpointermove', updateTooltipPosition);

        worldSeries.mapPolygons.template.events.on('pointerover', (event) => {
            const countryId = event.target.dataItem?.dataContext?.id;
            if (countryId && visitedCountries[countryId]) {
                showTooltip(event, visitedCountries[countryId]);
            }
        });

        worldSeries.mapPolygons.template.events.on('pointerout', hideTooltip);
        chart.appear(1000, 100);
    }

    handleScrollEffects();
    window.addEventListener('scroll', handleScrollEffects, { passive: true });
    setupSnowflakeEffect();
    initWorldMap();
});

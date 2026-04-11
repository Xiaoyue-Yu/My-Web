document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('section');
    const backToTopBtn = document.getElementById('backToTop');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // Scroll effects handler
    function handleScrollEffects() {
        // Navbar shadow effect
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Back to top button visibility
        if (window.scrollY > 300) {
            if (backToTopBtn) backToTopBtn.style.display = 'flex';
        } else {
            if (backToTopBtn) backToTopBtn.style.display = 'none';
        }

        // Fade-in animations
        const fadeElements = document.querySelectorAll('.fade-in-section');
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop < window.innerHeight * 0.8) && (elementBottom > 0);

            if (isVisible) {
                if (!element.classList.contains('is-visible')) {
                    element.classList.add('is-visible');
                }
            }
        });

        // Active navigation link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // Typewriter effect variables
    let typewriterRAFId = null;
    let restartDebounceTimer = null;

    // Debounce function for typewriter restart
    function debounce(func, wait) {
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(restartDebounceTimer);
            restartDebounceTimer = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // Restart typewriter effect
    const restartTypewriter = debounce(() => {
        if (!typewriterRAFId) {
            const typewriterElement = document.getElementById('typewriter');
            if (typewriterElement) {
                typewriterElement.textContent = '';
                typewriterCycle();
            }
        }
    }, 150);

    // Mobile device detection
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let isTouching = false;
    let touchStartY = 0;

    // Mobile touch events
    if (isMobileDevice) {
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
    }

    // Window load event
    window.addEventListener('load', () => {
        handleScrollEffects();

        setTimeout(() => {
            if (typewriterRAFId) {
                cancelAnimationFrame(typewriterRAFId);
                typewriterRAFId = null;
            }
            restartTypewriter();
        }, 500);

        setTimeout(() => {
            handleScrollEffects();
        }, 100);
    });

    // Visibility change event
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            if (typewriterRAFId) {
                cancelAnimationFrame(typewriterRAFId);
                typewriterRAFId = null;
            }
            restartTypewriter();
        }
    });

    // Window resize event
    window.addEventListener('resize', debounce(() => {
        if (typewriterRAFId) {
            cancelAnimationFrame(typewriterRAFId);
            typewriterRAFId = null;
        }
        restartTypewriter();
    }, 250));

    // Back to top button click event
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll event listener
    window.addEventListener('scroll', handleScrollEffects);

    // Typewriter effect function
    function typewriterCycle() {
        const typewriterElement = document.getElementById('typewriter');
        if (!typewriterElement) return;

        if (typewriterRAFId) {
            cancelAnimationFrame(typewriterRAFId);
            typewriterRAFId = null;
        }

        const texts = [
            "From SCUPI to Pitt.",
            "Industrial Engineering and Information Science.",
            "A cat lover.",
            "Also a dog lover.",
            "My actual pet is still loading..."
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let nextUpdateTime = 0;

        const typingSpeed = 100;
        const deletingSpeed = 50;
        const pauseDuration = 2000;

        function animate(timestamp) {
            if (!document.getElementById('typewriter')) {
                typewriterRAFId = null; // Clear RAF ID if element is gone
                return;
            }

            if (timestamp < nextUpdateTime) {
                typewriterRAFId = requestAnimationFrame(animate);
                return;
            }

            const currentText = texts[textIndex];
            let timeoutSpeed = typingSpeed;

            if (isDeleting) {
                typewriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                timeoutSpeed = deletingSpeed;

                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    timeoutSpeed = 500;
                }
            } else {
                typewriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentText.length) {
                    isDeleting = true;
                    timeoutSpeed = pauseDuration;
                }
            }

            nextUpdateTime = timestamp + timeoutSpeed;
            typewriterRAFId = requestAnimationFrame(animate);
        }

        typewriterRAFId = requestAnimationFrame(animate);
    }

    // Snowflake effect for contact section
    (function () {
        document.addEventListener('DOMContentLoaded', function () {
            const container = document.querySelector('.contact-image-container');
            if (!container) {
                return;
            }

            let intervalId = null;
            let mouseX = null;
            let mouseY = null;

            const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❉', '❊', '✧', '✦'];
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            function createMouseSnowflake() {
                if (mouseX === null || mouseY === null) return;
                const snow = document.createElement('span');

                const sizeClass = Math.random() < 0.3 ? 'small' :
                    Math.random() < 0.7 ? 'medium' : 'large';
                snow.className = `snowflake ${sizeClass}`;

                snow.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];

                const rect = container.getBoundingClientRect();
                snow.style.left = (mouseX - rect.left) + 'px';
                snow.style.top = (mouseY - rect.top) + 'px';

                container.appendChild(snow);
                setTimeout(() => snow.remove(), 7000);
            }

            if (isMobile) {
                container.addEventListener('touchstart', (e) => {
                    mouseX = e.touches[0].clientX;
                    mouseY = e.touches[0].clientY;
                    createMouseSnowflake();
                });
            } else {
                container.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                });

                container.addEventListener('mouseenter', () => {
                    if (intervalId) return;
                    intervalId = setInterval(createMouseSnowflake, 400);
                });

                container.addEventListener('mouseleave', () => {
                    clearInterval(intervalId);
                    intervalId = null;
                    mouseX = mouseY = null;
                });
            }
        });
    })();

    // World Map Logic (SVG-based via amCharts 5)
    function initWorldMap() {
        const wrapper = document.getElementById('world-map-wrapper');
        const tooltip = document.getElementById('map-tooltip');
        if (!wrapper || !tooltip || typeof am5 === 'undefined') return;

        // Visited countries and regions config
        const visitedConfig = {
            CN: {
                description: "Hunan, Sichuan, Zhejiang, Shanghai, Yunnan",
                geoFile: "chinaLow",
                regions: {
                    "CN-HN": { name: "Hunan", description: "Changsha" },
                    "CN-SC": { name: "Sichuan", description: "Chengdu" },
                    "CN-ZJ": { name: "Zhejiang", description: "Ningbo" },
                    "CN-SH": { name: "Shanghai", description: "Shanghai" },
                    "CN-YN": { name: "Yunnan", description: "Kunming, Lijiang, Dali" }
                }
            },
            JP: { 
                description: "Kyoto, Hokkaido",
                geoFile: "japanLow",
                regions: {
                    "JP-26": { name: "Kyoto"},
                    "JP-01": { name: "Hokkaido"},
                }
            },
            US: { 
                description: "Pittsburgh, San Francisco, Los Angeles, New York, New Brunswick, Philadelphia, Washington DC",
                geoFile: "usaLow",
                regions: {
                    "US-PA": { name: "Pennsylvania", description: "Pittsburgh" },
                    "US-CA": { name: "California", description: "San Francisco" },
                    "US-CA": { name: "California", description: "Los Angeles" },
                    "US-NY": { name: "New York", description: "New York City" },
                    "US-NJ": { name: "New Jersey", description: "New Brunswick" },
                    "US-PA": { name: "Pennsylvania", description: "Philadelphia" },
                    "US-DC": { name: "Washington DC", description: "Washington DC" }
                }
            }
        };

        const root = am5.Root.new("world-map-wrapper");
        root.setThemes([am5themes_Animated.new(root)]);
        
        // Hide amCharts logo
        if (root._logo) {
            root._logo.set("forceHidden", true);
        }

        const chart = root.container.children.push(am5map.MapChart.new(root, {
            panX: "none",
            panY: "none",
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

        // Main World Series
        const worldSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            exclude: ["AQ"]
        }));

        worldSeries.mapPolygons.template.setAll({
            interactive: true,
            fill: am5.color(0xe0e0e0),
            stroke: am5.color(0xffffff),
            strokeWidth: 0.5
        });

        worldSeries.mapPolygons.template.states.create("hover", {
            fill: am5.color(0xd0d0d0)
        });

        // Highlight visited countries
        worldSeries.mapPolygons.template.adapters.add("fill", function(fill, target) {
            if (target.dataItem && target.dataItem.dataContext) {
                if (visitedConfig[target.dataItem.dataContext.id]) {
                    return am5.color(0xB0E0E6);
                }
            }
            return fill;
        });

        // Tooltip Logic (Silky UI)
        function showTooltip(ev, title, description) {
            let content = `<span class="tooltip-title">${title}</span>`;
            if (description) {
                content += `<span class="tooltip-cities">${description}</span>`;
            }
            content += `<div class="tooltip-arrow"></div>`;
            
            tooltip.innerHTML = content;
            tooltip.classList.add('visible');
            updateTooltipPosition(ev);
        }

        function hideTooltip() {
            tooltip.classList.remove('visible');
        }

        function updateTooltipPosition(ev) {
            if (tooltip.classList.contains('visible')) {
                // Position is updated here, centering and pop-up animation handled by CSS
                tooltip.style.left = `${ev.point.x}px`;
                tooltip.style.top = `${ev.point.y}px`;
            }
        }

        chart.events.on("globalpointermove", updateTooltipPosition);

        // Events for World Series
        worldSeries.mapPolygons.template.events.on("pointerover", function(ev) {
            const id = ev.target.dataItem.dataContext.id;
            // Only show description in world view, skip country name
            if (visitedConfig[id]) {
                showTooltip(ev, visitedConfig[id].description, null);
            }
        });

        worldSeries.mapPolygons.template.events.on("pointerout", hideTooltip);

        chart.appear(1000, 100);
        wrapper.style.height = "500px";
    }

    initWorldMap();

});
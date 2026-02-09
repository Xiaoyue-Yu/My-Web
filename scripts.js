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
            if (link.getAttribute('href').substring(1) === current) {
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

});
// Main JavaScript file for Alba Austral website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainNavLinksMobile = document.querySelectorAll('.sidebar .main-nav a');

    if (mobileNavToggle && sidebar) {
        mobileNavToggle.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-open');
            const isOpen = sidebar.classList.contains('sidebar-open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen);
            if (isOpen) {
                mobileNavToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        mainNavLinksMobile.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && sidebar.classList.contains('sidebar-open')) {
                    sidebar.classList.remove('sidebar-open');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }

    // Slider functionality
    const slides = document.querySelectorAll('#home .slide, #hero .slide');
    const dotsContainer = document.querySelector('#home .slider-dots, #hero .slider-dots');
    let currentSlide = 0;
    let dots = [];
    let autoSlideInterval = null;

    // Check if we're on a project page or main page
    const isProjectPage = window.location.pathname.includes('/proyectos/');
    const isMainPage = !isProjectPage;

    function showSlide(index, withFade = false) {
        if (slides.length === 0) return;
        
        const previousSlide = document.querySelector('#home .slide.active, #hero .slide.active');
        
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                if (withFade && previousSlide && previousSlide !== slide) {
                    // Apply fade effect
                    slide.style.opacity = '0';
                    slide.classList.add('active');
                    
                    setTimeout(() => {
                        slide.style.transition = 'opacity 0.8s ease-in-out';
                        slide.style.opacity = '1';
                    }, 50);
                } else {
                    slide.classList.add('active');
                    slide.style.opacity = '1';
                }
            }
        });
        
        // Update active dot
        if (dots.length > 0) {
            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === index) {
                    dot.classList.add('active');
                }
            });
        }
        currentSlide = index;
    }

    function createDots() {
        if (!dotsContainer || slides.length === 0) return;
        
        // Clear existing dots
        dotsContainer.innerHTML = '';
        dots = [];
        
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Ir al slide ${i + 1}`);
            dot.addEventListener('click', () => {
                if (isMainPage) {
                    // Stop auto-slide temporarily when user interacts
                    clearInterval(autoSlideInterval);
                    showSlide(i, true);
                    // Restart auto-slide after 10 seconds
                    setTimeout(startAutoSlide, 10000);
                } else {
                    showSlide(i);
                }
            });
            dotsContainer.appendChild(dot);
            dots.push(dot);
        });
    }

    function startAutoSlide() {
        if (!isMainPage || slides.length <= 1) return;
        
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex, true);
        }, 5000);
    }

    // Initialize slider
    if (slides.length > 0) {
        createDots();
        showSlide(0);
        
        if (isMainPage) {
            startAutoSlide();
            
            // Pause auto-slide on hover
            const sliderElement = document.querySelector('#home .slider');
            if (sliderElement) {
                sliderElement.addEventListener('mouseenter', () => {
                    clearInterval(autoSlideInterval);
                });
                sliderElement.addEventListener('mouseleave', () => {
                    startAutoSlide();
                });
            }
        }
    }

    // Interactive Distance Map
    function initDistanceMap() {
        const distanceSections = document.querySelectorAll('#ubicacion');
        
        distanceSections.forEach(section => {
            const mapContainer = section.querySelector('.distance-map');
            if (!mapContainer) return;
            
            const points = mapContainer.querySelectorAll('.distance-point');
            
            points.forEach(point => {
                point.addEventListener('mouseenter', () => {
                    point.classList.add('active');
                    const tooltip = point.querySelector('.distance-tooltip');
                    if (tooltip) {
                        tooltip.style.opacity = '1';
                        tooltip.style.transform = 'translateY(-10px)';
                    }
                });
                
                point.addEventListener('mouseleave', () => {
                    point.classList.remove('active');
                    const tooltip = point.querySelector('.distance-tooltip');
                    if (tooltip) {
                        tooltip.style.opacity = '0';
                        tooltip.style.transform = 'translateY(0)';
                    }
                });
                
                point.addEventListener('click', () => {
                    // Add click animation
                    point.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        point.style.transform = 'scale(1)';
                    }, 150);
                });
            });
        });
    }

    // Adaptive Cursor
    function initAdaptiveCursor() {
        const cursorInner = document.querySelector('.cursor-inner');
        const cursorOuter = document.querySelector('.cursor-outer');
        
        if (!cursorInner || !cursorOuter) return;
        
        function updateCursorColor(e) {
            const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
            
            if (!elementUnderCursor) return;
            
            const computedStyle = window.getComputedStyle(elementUnderCursor);
            const backgroundColor = computedStyle.backgroundColor;
            const backgroundImage = computedStyle.backgroundImage;
            
            // Check if element has a background image or dark background
            const hasBackgroundImage = backgroundImage && backgroundImage !== 'none';
            const isLightBackground = backgroundColor === 'rgba(0, 0, 0, 0)' || 
                                    backgroundColor === 'transparent' || 
                                    backgroundColor.includes('255, 255, 255') ||
                                    backgroundColor.includes('rgb(255, 255, 255)');
            
            if (hasBackgroundImage || !isLightBackground) {
                // Dark background or image - use light cursor
                cursorInner.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                cursorOuter.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            } else {
                // Light background - use dark cursor
                cursorInner.style.backgroundColor = 'rgba(44, 62, 80, 0.8)';
                cursorOuter.style.borderColor = 'rgba(44, 62, 80, 0.3)';
            }
        }
        
        // Update cursor position and color
        window.addEventListener('mousemove', (e) => {
            cursorOuter.style.left = e.clientX + 'px';
            cursorOuter.style.top = e.clientY + 'px';
            cursorInner.style.left = e.clientX + 'px';
            cursorInner.style.top = e.clientY + 'px';
            
            updateCursorColor(e);
        });
        
        // Hover effects
        const hoverSelectors = "a:not(.main-nav a), .cursor-pointer, button:not(.main-nav button), input[type='submit'], .slider-dots .dot, .project-card .btn, .contact-form button[type='submit'], .distance-point";
        
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches(hoverSelectors)) {
                cursorInner.classList.add('cursor-hover');
                cursorOuter.classList.add('cursor-hover');
            }
        }, true);
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches(hoverSelectors)) {
                cursorInner.classList.remove('cursor-hover');
                cursorOuter.classList.remove('cursor-hover');
            }
        }, true);
        
        // Make cursors visible
        cursorInner.style.visibility = 'visible';
        cursorOuter.style.visibility = 'visible';
    }

    // Active navigation link based on scroll position (Scrollspy)
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    const sections = document.querySelectorAll('.main-content-area section[id]');

    if (navLinks.length > 0 && sections.length > 0) {
        const scrollSpyObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.4 
        };
        const scrollSpyObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.parentElement.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === entry.target.id) {
                            link.parentElement.classList.add('active');
                        }
                    });
                }
            });
        }, scrollSpyObserverOptions);
        sections.forEach(section => {
            scrollSpyObserver.observe(section);
        });
    }

    // Scroll Animations for elements
    const animatedElements = document.querySelectorAll('.scroll-animate');
    if (animatedElements.length > 0) {
        const animationObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 
        };
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); 
                }
            });
        }, animationObserverOptions);
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }

    // Project Cards Click Functionality
    function initProjectCardsClick() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
                    return;
                }
                
                const project = card.getAttribute('data-project');
                const ripple = card.querySelector('.project-card-ripple');
                
                if (ripple) {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const size = 100;
                    ripple.style.width = size + 'px';
                    ripple.style.height = size + 'px';
                    ripple.style.left = (x - size / 2) + 'px';
                    ripple.style.top = (y - size / 2) + 'px';
                    
                    ripple.classList.remove('animate');
                    
                    setTimeout(() => {
                        ripple.classList.add('animate');
                    }, 10);
                    
                    setTimeout(() => {
                        if (project === 'estero-molgue') {
                            window.location.href = 'proyectos/estero-molgue.html';
                        } else if (project === 'laguna-bonita') {
                            window.location.href = 'proyectos/laguna-bonita.html';
                        }
                    }, 200);
                }
            });
        });
    }

    // Contact Button Click Functionality
    function initContactButtonClick() {
        const contactButton = document.querySelector('.contact-form .btn');
        
        if (contactButton) {
            contactButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                const ripple = document.createElement('div');
                ripple.className = 'project-card-ripple animate';
                
                const rect = contactButton.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const size = 80;
                ripple.style.width = size + 'px';
                ripple.style.height = size + 'px';
                ripple.style.left = (x - size / 2) + 'px';
                ripple.style.top = (y - size / 2) + 'px';
                ripple.style.position = 'absolute';
                
                contactButton.style.position = 'relative';
                contactButton.style.overflow = 'hidden';
                contactButton.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
                
                console.log('Contact form submitted with ripple effect!');
            });
        }
    }

    // Initialize all functionalities
    initDistanceMap();
    initAdaptiveCursor();
    initProjectCardsClick();
    initContactButtonClick();
});

// ---------------------------------------------------- //
// --------------- Grax Specific Functions ------------ //
// ---------------------------------------------------- //

// Adapted Ripple Effect Initialization
function grax_tm_ripple_alba_austral(){
    "use strict";
    if (typeof jQuery !== 'undefined' && typeof jQuery.fn.ripples !== 'undefined') {
        try {
            // Select all slide background elements within the #home section
            jQuery('#home .slide .slide-background').each(function() {
                jQuery(this).ripples({
                    resolution: 500, // You can adjust this value
                    dropRadius: 20,  // Radius of the drop
                    perturbance: 0.03, // Strength of the ripple
                    // The plugin will use the background-image of 'this' element
                });
            });
            console.log("Ripples effect initialized on .slide-background elements.");
        } catch (e) {
            console.error("Error initializing ripples: ", e);
        }
    } else {
        console.warn('jQuery or jQuery Ripples plugin is not loaded. Ripple effect cannot be initialized.');
    }
}

// Cursor Effect (from Grax template's init.js)
function grax_tm_cursor(){
    "use strict";
    if (typeof jQuery !== 'undefined') {
        var myCursor = jQuery('.mouse-cursor');
        if(myCursor.length){
            if (jQuery("body")) { // Ensure body exists
                const e = document.querySelector(".cursor-inner"),
                    t = document.querySelector(".cursor-outer");
                
                if (!e || !t) { // Check if cursor elements exist
                    console.warn('Cursor elements (.cursor-inner or .cursor-outer) not found.');
                    return;
                }

                // let n, i = 0, // n was original y-coordinate, i is x-coordinate. Not strictly needed here.
                // o = false; // o is for throttling/locking, not directly used for simple translation
                
                window.onmousemove = function (s) {
                    // The translate(-50%, -50%) is now in CSS, so just set left/top for cursor elements
                    t.style.left = s.clientX + "px";
                    t.style.top = s.clientY + "px";
                    e.style.left = s.clientX + "px";
                    e.style.top = s.clientY + "px";
                };
                
                // Define elements that trigger cursor hover effect
                const hoverSelectors = "a:not(.main-nav a), .cursor-pointer, button:not(.main-nav button), input[type='submit'], .slider-dots .dot, .project-card .btn, .contact-form button[type='submit']";

                jQuery("body").on("mouseenter", hoverSelectors, function () {
                    if (e) e.classList.add("cursor-hover");
                    if (t) t.classList.add("cursor-hover");
                });
                
                jQuery("body").on("mouseleave", hoverSelectors, function () {
                    if (e) e.classList.remove("cursor-hover");
                    if (t) t.classList.remove("cursor-hover");
                });
                
                // Make cursors visible once initialized
                if (e) e.style.visibility = "visible";
                if (t) t.style.visibility = "visible";
            }
        }
    } else {
        console.warn('jQuery is not loaded. Magic cursor effect cannot be initialized.');
    }
};
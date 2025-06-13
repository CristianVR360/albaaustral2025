// Main JavaScript file for Alba Austral website

// Ejemplo de función (puedes borrar esto o modificarlo)
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

    // Slider functionality with Dots Navigation
    const slides = document.querySelectorAll('#home .slide, #hero .slide');
    const dotsContainer = document.querySelector('#home .slider-dots, #hero .slider-dots');
    let currentSlide = 0;
    let dots = []; // Array to store dot elements

    // Check if we're on a project page
    const isProjectPage = window.location.pathname.includes('/proyectos/');

    // Image navigation for each project (only for main page)
    const projectImages = {
        'estero-molgue': [
            'img/estero-molgue/01.jpg',
            'img/estero-molgue/10.jpg',
            'img/estero-molgue/02.jpg'
        ],
        'laguna-bonita': [
            'img/laguna-bonita/03.JPG',
            'img/laguna-bonita/08.JPG',
            'img/laguna-bonita/30.JPG'
        ]
    };

    // Current image index for each project (only for main page)
    let currentImageIndex = {
        'estero-molgue': 0,
        'laguna-bonita': 0
    };

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
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
        currentSlide = index; // Ensure currentSlide is updated
    }

    function changeProjectImage(direction) {
        // Only change images on main page, change slides on project pages
        if (isProjectPage) {
            changeSlide(direction);
            return;
        }

        const activeSlide = document.querySelector('#home .slide.active');
        if (!activeSlide) return;

        const project = activeSlide.getAttribute('data-project');
        const images = projectImages[project];
        if (!images || images.length === 0) return;

        const slideBackground = activeSlide.querySelector('.slide-background');
        if (!slideBackground) return;

        // Calculate new image index
        let newIndex = currentImageIndex[project];
        if (direction === 'next') {
            newIndex = (newIndex + 1) % images.length;
        } else if (direction === 'prev') {
            newIndex = (newIndex - 1 + images.length) % images.length;
        }

        // Update current index
        currentImageIndex[project] = newIndex;

        // Add changing class for animation
        slideBackground.classList.add('changing');

        // Change background image at the peak of the animation (50% of 800ms = 400ms)
        setTimeout(() => {
            slideBackground.style.backgroundImage = `url('${images[newIndex]}')`;
        }, 400);
        
        // Remove changing class after animation completes
        setTimeout(() => {
            slideBackground.classList.remove('changing');
        }, 800);
    }

    function changeSlide(direction) {
        // Navigate between slides on project pages
        let newIndex = currentSlide;
        if (direction === 'next') {
            newIndex = (currentSlide + 1) % slides.length;
        } else if (direction === 'prev') {
            newIndex = (currentSlide - 1 + slides.length) % slides.length;
        }
        showSlide(newIndex);
    }

    function createRippleEffect(x, y) {
        const ripple = document.querySelector('.click-ripple');
        if (!ripple) return;

        // Remove any existing animation
        ripple.classList.remove('animate');
        
        // Position the ripple at click coordinates
        const size = 100;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (x - size / 2) + 'px';
        ripple.style.top = (y - size / 2) + 'px';

        // Trigger animation
        setTimeout(() => {
            ripple.classList.add('animate');
        }, 10);

        // Remove animation class after animation completes
        setTimeout(() => {
            ripple.classList.remove('animate');
        }, 800);
    }

    function createDots() {
        if (!dotsContainer) return;
        slides.forEach((_, i) => {
            const dot = document.createElement('button'); // Using button for accessibility
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Ir al slide ${i + 1}`);
            dot.addEventListener('click', () => {
                showSlide(i);
            });
            dotsContainer.appendChild(dot);
            dots.push(dot); // Store dot reference
        });
    }

    // Initialize image navigation
    function initImageNavigation() {
        const navAreas = document.querySelectorAll('.nav-area');
        
        navAreas.forEach(area => {
            area.addEventListener('click', (e) => {
                const direction = area.getAttribute('data-direction');
                const sliderElement = document.querySelector('#home .slider, #hero .slider');
                
                if (!sliderElement) return;
                
                // Create ripple effect at click position
                createRippleEffect(e.clientX - sliderElement.getBoundingClientRect().left, 
                                 e.clientY - sliderElement.getBoundingClientRect().top);
                
                // Change image or slide depending on page type
                changeProjectImage(direction);
            });

            // Add touch support for mobile
            area.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent default touch behavior
                const direction = area.getAttribute('data-direction');
                const touch = e.touches[0];
                const sliderElement = document.querySelector('#home .slider, #hero .slider');
                
                if (!sliderElement) return;
                
                // Create ripple effect at touch position
                createRippleEffect(touch.clientX - sliderElement.getBoundingClientRect().left, 
                                 touch.clientY - sliderElement.getBoundingClientRect().top);
                
                // Change image or slide depending on page type
                changeProjectImage(direction);
            });
        });
    }

    if (slides.length > 0) {
        createDots();
        showSlide(currentSlide); // Show initial slide and set first dot active
        initImageNavigation(); // Initialize image navigation
        
        // Optional: Auto-slide (uncomment to enable)
        // let autoSlideInterval = setInterval(() => {
        //     let next = (currentSlide + 1) % slides.length;
        //     showSlide(next);
        // }, 7000);

        // Optional: Pause auto-slide on hover over slider (if auto-slide is enabled)
        // const sliderElement = document.querySelector('#home .slider, #hero .slider');
        // if (sliderElement && autoSlideInterval) { 
        //     sliderElement.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        //     sliderElement.addEventListener('mouseleave', () => {
        //         autoSlideInterval = setInterval(() => {
        //             let next = (currentSlide + 1) % slides.length;
        //             showSlide(next);
        //         }, 7000);
        //     });
        // }

    } else {
        if(dotsContainer) dotsContainer.style.display = 'none'; // Hide dots container if no slides
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

    // Initialize Grax Effects if jQuery is available
    if (typeof jQuery !== 'undefined') {
        jQuery(document).ready(function() {
            // grax_tm_ripple_alba_austral(); // Ripple effect call commented out as per user request
            grax_tm_cursor(); // Call cursor function
        });
    } else {
        console.warn('jQuery is not loaded. Ripple and Magic Cursor effects cannot be initialized.');
    }

    // Project Cards Click Functionality
    function initProjectCardsClick() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Prevent default if clicking on the button
                if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
                    return; // Let the button handle its own click
                }
                
                const project = card.getAttribute('data-project');
                const ripple = card.querySelector('.project-card-ripple');
                
                if (ripple) {
                    // Create ripple effect
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Position and size the ripple
                    const size = 100;
                    ripple.style.width = size + 'px';
                    ripple.style.height = size + 'px';
                    ripple.style.left = (x - size / 2) + 'px';
                    ripple.style.top = (y - size / 2) + 'px';
                    
                    // Remove existing animation
                    ripple.classList.remove('animate');
                    
                    // Trigger animation
                    setTimeout(() => {
                        ripple.classList.add('animate');
                    }, 10);
                    
                    // Navigate after ripple starts
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
                e.preventDefault(); // Prevent form submission for demo
                
                // Create temporary ripple element
                const ripple = document.createElement('div');
                ripple.className = 'project-card-ripple animate';
                
                const rect = contactButton.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Position and size the ripple
                const size = 80;
                ripple.style.width = size + 'px';
                ripple.style.height = size + 'px';
                ripple.style.left = (x - size / 2) + 'px';
                ripple.style.top = (y - size / 2) + 'px';
                ripple.style.position = 'absolute';
                
                // Add to button (make sure button has relative positioning)
                contactButton.style.position = 'relative';
                contactButton.style.overflow = 'hidden';
                contactButton.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
                
                // Here you would normally submit the form
                console.log('Contact form submitted with ripple effect!');
            });
        }
    }

    // Initialize all click functionalities
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
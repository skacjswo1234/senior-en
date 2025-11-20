document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 3500; // 3.5 seconds

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    setInterval(nextSlide, slideInterval);

    // Mobile Menu Logic
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.close-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-nav-overlay');

    function toggleMenu() {
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    menuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Book Slider Logic (Mobile Only)
    const bookSlider = document.querySelector('.book-slider');
    const bookSlides = document.querySelectorAll('.book-slide');
    let currentBookSlide = 0;
    const bookInterval = 2000; // 2 seconds

    function nextBookSlide() {
        if (window.innerWidth <= 768) {
            currentBookSlide = (currentBookSlide + 1) % bookSlides.length;
            bookSlider.style.transform = `translateX(-${currentBookSlide * 100}%)`;
        } else {
            bookSlider.style.transform = 'none'; // Reset on desktop
        }
    }

    setInterval(nextBookSlide, bookInterval);

    // Reset slider on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            bookSlider.style.transform = 'none';
        }
    });

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Handle staggered items inside the section
                if (entry.target.querySelectorAll('.stagger-item').length > 0) {
                    const staggerItems = entry.target.querySelectorAll('.stagger-item');
                    staggerItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 200); // 200ms delay between items
                    });
                }
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');
    revealElements.forEach(el => observer.observe(el));

    // Also observe sections that might contain stagger items but don't have reveal class themselves
    document.querySelectorAll('.content-section').forEach(section => {
        if (!section.classList.contains('reveal-up') &&
            !section.classList.contains('reveal-left') &&
            !section.classList.contains('reveal-right')) {
            observer.observe(section);
        }
    });

    // Smooth Scroll for Mobile Menu Links
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(); // Close menu
        });
    });

    // Floating Top Button Logic
    const topBtn = document.querySelector('.top-btn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            topBtn.classList.add('visible');
        } else {
            topBtn.classList.remove('visible');
        }
    });

    topBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

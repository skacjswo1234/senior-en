document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 3500; // 3.5 seconds

    // 슬라이드가 하나 이상일 때만 자동 전환
    if (slides.length > 1) {
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        setInterval(nextSlide, slideInterval);
    }

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
    let bookSliderInterval = null;

    // Initialize slider position
    function initBookSlider() {
        if (window.innerWidth <= 768) {
            currentBookSlide = 0;
            bookSlider.style.transform = `translateX(0)`;
        } else {
            bookSlider.style.transform = 'none';
        }
    }

    function nextBookSlide() {
        if (window.innerWidth <= 768 && bookSlides.length > 0) {
            currentBookSlide = (currentBookSlide + 1) % bookSlides.length;
            // 슬라이더 너비가 500%이고 각 슬라이드가 20%이므로, 컨테이너 기준으로 20%씩 이동
            const slideWidth = 100 / bookSlides.length; // 20% per slide
            bookSlider.style.transform = `translateX(-${currentBookSlide * slideWidth}%)`;
        } else {
            bookSlider.style.transform = 'none'; // Reset on desktop
        }
    }

    // Initialize and start slider
    initBookSlider();
    
    // Clear any existing interval before setting a new one
    if (bookSliderInterval) {
        clearInterval(bookSliderInterval);
    }
    bookSliderInterval = setInterval(nextBookSlide, bookInterval);

    // Reset slider on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            bookSlider.style.transform = 'none';
            if (bookSliderInterval) {
                clearInterval(bookSliderInterval);
                bookSliderInterval = null;
            }
        } else {
            initBookSlider();
            if (!bookSliderInterval) {
                bookSliderInterval = setInterval(nextBookSlide, bookInterval);
            }
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

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = '처리 중...';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    showModal('신청 완료', '신청이 완료되었습니다! 감사합니다.', true);
                    contactForm.reset();
                } else {
                    showModal('오류', data.message || '오류가 발생했습니다. 다시 시도해주세요.', false);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                showModal('오류', '오류가 발생했습니다. 다시 시도해주세요.', false);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // 모달 함수
    function showModal(title, message, isSuccess = true) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        
        // 성공/실패에 따른 스타일 적용
        const modalContent = modal.querySelector('.modal-content');
        if (isSuccess) {
            modalContent.classList.remove('modal-error');
            modalContent.classList.add('modal-success');
        } else {
            modalContent.classList.remove('modal-success');
            modalContent.classList.add('modal-error');
        }
        
        modal.style.display = 'flex';
    }

    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }

    // 모달 닫기 이벤트
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalConfirm').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
});

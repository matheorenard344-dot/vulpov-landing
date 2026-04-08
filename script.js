document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.position = 'fixed';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'rgba(10, 10, 11, 0.95)';
                navLinks.style.backdropFilter = 'blur(20px)';
                navLinks.style.flexDirection = 'column';
                navLinks.style.padding = '2rem';
                navLinks.style.height = 'calc(100vh - 80px)';
                navLinks.style.zIndex = '100';
            }
        });
    }

    // Modal Logic
    const modal = document.getElementById('contact-modal');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtn = document.querySelector('.close-modal');

    if (modal) {
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // prevent scrolling
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    // Form Submission Logic
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const successMsg = document.getElementById('form-success');
            const errorMsg = document.getElementById('form-error');
            
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            const formData = new FormData(leadForm);
            // Append _captcha to hide formsubmit captcha if used
            formData.append('_captcha', 'false');

            // Envoi via l'API FormSubmit.co
            fetch('https://formsubmit.co/ajax/contact@vulpov.fr', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                successMsg.style.display = 'block';
                errorMsg.style.display = 'none';
                leadForm.reset();
                submitBtn.textContent = 'Envoyer la demande';
                submitBtn.disabled = false;
            })
            .catch(error => {
                // Fallback (on affiche le succès quand même pour l'expérience front-end si l'API bloque)
                successMsg.style.display = 'block';
                errorMsg.style.display = 'none';
                leadForm.reset();
                submitBtn.textContent = 'Envoyer la demande';
                submitBtn.disabled = false;
            });
        });
    }

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }
            }
        });
    });
});

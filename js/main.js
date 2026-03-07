document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.querySelector('nav');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');

            // Toggle icon between bars and X
            const icon = mobileMenuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on a nav link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to reveal on scroll
    const animElements = document.querySelectorAll('.section-title, .about-text, .service-card, .project-card, .skill-tag, .achievement-card, .edu-item, .contact-info-item, .contact-form-container');

    animElements.forEach((el, index) => {
        el.classList.add('reveal');
        // Add staggering effect for grid items
        if (el.classList.contains('skill-tag') || el.classList.contains('service-card') || el.classList.contains('project-card')) {
             const delay = (index % 3) * 0.1;
             el.style.transitionDelay = `${delay}s`;
        }
        observer.observe(el);
    });

    // Contact Form Handling with Inline Validation
    const contactForm = document.querySelector('form');
    if (contactForm) {
        // Create error message containers for each field
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            group.appendChild(errorDiv);
        });

        // Helper function to show error
        function showError(fieldName, message) {
            const field = contactForm.querySelector(`[name="${fieldName}"]`);
            const formGroup = field.closest('.form-group');
            const errorDiv = formGroup.querySelector('.form-error');
            
            field.classList.add('error');
            errorDiv.textContent = message;
            errorDiv.style.display = 'flex';
        }

        // Helper function to clear error
        function clearError(fieldName) {
            const field = contactForm.querySelector(`[name="${fieldName}"]`);
            const formGroup = field.closest('.form-group');
            const errorDiv = formGroup.querySelector('.form-error');
            
            field.classList.remove('error');
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }

        // Email validation regex
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Real-time validation on input
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');

        if (nameInput) {
            nameInput.addEventListener('input', function() {
                if (this.value.trim().length > 0) {
                    clearError('name');
                }
            });
        }

        if (emailInput) {
            emailInput.addEventListener('input', function() {
                if (this.value.trim().length > 0 && isValidEmail(this.value.trim())) {
                    clearError('email');
                }
            });
        }

        if (messageInput) {
            messageInput.addEventListener('input', function() {
                if (this.value.trim().length > 0) {
                    clearError('message');
                }
            });
        }

        // Form submission with validation
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            // Clear all previous errors
            clearError('name');
            clearError('email');
            clearError('message');

            // Validate name
            if (!name) {
                showError('name', 'Please enter your name');
                isValid = false;
            } else if (name.length < 2) {
                showError('name', 'Name must be at least 2 characters');
                isValid = false;
            }

            // Validate email
            if (!email) {
                showError('email', 'Please enter your email address');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            // Validate message
            if (!message) {
                showError('message', 'Please enter your message');
                isValid = false;
            } else if (message.length < 10) {
                showError('message', 'Message must be at least 10 characters');
                isValid = false;
            }

            // If form is valid, submit
            if (isValid) {
                // Change button to show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Opening Gmail...';
                submitBtn.disabled = true;

                const subject = `Portfolio Contact from ${name}`;
                const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

                // Open Gmail compose window
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=mhmdkaram213@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(gmailUrl, '_blank');

                // Reset button after a short delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        if (icon) icon.classList.replace('fa-sun', 'fa-moon');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');

            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                if (icon) icon.classList.replace('fa-sun', 'fa-moon');
            } else {
                localStorage.setItem('theme', 'dark');
                if (icon) icon.classList.replace('fa-moon', 'fa-sun');
            }
        });
    }

    // Modal Logic for Project Features
    const modal = document.getElementById('features-modal');
    const modalTitle = document.getElementById('modal-title');
    const featuresList = document.getElementById('features-list');
    const featureButtons = document.querySelectorAll('.btn-features');
    const closeModal = document.querySelector('.close-modal');

    if (modal && featureButtons) {
        featureButtons.forEach(button => {
            button.addEventListener('click', () => {
                const project = button.getAttribute('data-project');
                const features = button.getAttribute('data-features').split(',');

                modalTitle.textContent = `${project} Features`;
                featuresList.innerHTML = '';

                features.forEach(feature => {
                    const li = document.createElement('li');
                    li.textContent = feature.trim();
                    featuresList.appendChild(li);
                });

                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        const closeFunc = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        if (closeModal) {
            closeModal.addEventListener('click', closeFunc);
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeFunc();
            }
        });
    }
});

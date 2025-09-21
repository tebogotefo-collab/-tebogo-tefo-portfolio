// Portfolio Website JavaScript
// Author: Tebogo Tefo - Senior Java Developer

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeSkillBars();
    initializeTimeline();
    initializeContactForm();
    initializeScrollEffects();
    initializeTypingAnimation();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Initial call

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger skill bar animations when skills section is visible
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }

                // Trigger timeline animations
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.style.animationDelay = '0s';
                    entry.target.style.animationPlayState = 'running';
                }
            }
        });
    }, observerOptions);

    // Observe sections for fade-in animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Observe skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.classList.add('fade-in');
        observer.observe(category);
    });
}

// Skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.classList.add('animated');
        }, index * 100);
    });
}

// Timeline functionality
function initializeTimeline() {
    const showMoreBtn = document.getElementById('show-more-btn');
    const timelineExtended = document.getElementById('timeline-extended');

    if (showMoreBtn && timelineExtended) {
        showMoreBtn.addEventListener('click', function() {
            if (timelineExtended.classList.contains('show')) {
                timelineExtended.classList.remove('show');
                showMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Show Earlier Experience';
            } else {
                timelineExtended.classList.add('show');
                showMoreBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';

                // Animate the new timeline items
                const hiddenItems = timelineExtended.querySelectorAll('.timeline-item');
                hiddenItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }
}

// Initialize EmailJS
function initializeEmailJS() {
    // Initialize EmailJS with your public key
    // You'll need to replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('_sUG4_FJB9jLN2qGh');
}

// Contact form functionality
function initializeContactForm() {
    // Initialize EmailJS
    initializeEmailJS();

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Prepare template parameters for EmailJS
            const templateParams = {
                from_name: formObject.name,
                from_email: formObject.email,
                company: formObject.company || 'Not specified',
                message: formObject.message,
                to_email: 'tebogo.tefo@mathotech.dev',
                website_url: window.location.href
            };

            // Send email using EmailJS
            emailjs.send('service_1ylhpkn', 'template_portfolio', templateParams)
                .then(function(response) {
                    console.log('Email sent successfully:', response);

                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // Reset form
                    contactForm.reset();

                    // Show success message
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                })
                .catch(function(error) {
                    console.error('Email sending failed:', error);

                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // Show error message
                    showNotification('Email sending failed. Using fallback method.', 'info');

                    // Fallback to mailto
                    const subject = `Portfolio Contact from ${formObject.name}`;
                    const body = `Name: ${formObject.name}\nEmail: ${formObject.email}\nCompany: ${formObject.company || 'Not specified'}\n\nMessage:\n${formObject.message}`;
                    const mailtoLink = `mailto:tebogo.tefo@mathotech.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                    setTimeout(() => {
                        window.location.href = mailtoLink;
                    }, 1000);
                });
        });
    }
}

// Scroll effects
function initializeScrollEffects() {
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            const aboutSection = document.getElementById('about');

            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');

        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Typing animation
function initializeTypingAnimation() {
    const codeDisplay = document.getElementById('code-display');
    const cursor = document.getElementById('typing-cursor');

    if (!codeDisplay || !cursor) return;

    const codeLines = [
        '@Component',
        '@Service',
        'public class TebogoTefo {',
        '',
        '\u00A0\u00A0\u00A0\u00A0private final int experienceYears = 20;',
        '\u00A0\u00A0\u00A0\u00A0private final String expertise = "Java Enterprise";',
        '\u00A0\u00A0\u00A0\u00A0private final List<String> technologies = Arrays.asList(',
        '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"Spring Boot", "Microservices",',
        '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"AWS", "Docker", "Kubernetes"',
        '\u00A0\u00A0\u00A0\u00A0);',
        '',
        '\u00A0\u00A0\u00A0\u00A0@Autowired',
        '\u00A0\u00A0\u00A0\u00A0private PassionForCoding passion;',
        '',
        '\u00A0\u00A0\u00A0\u00A0public String deliverResults() {',
        '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0return "Enterprise-grade solutions";',
        '\u00A0\u00A0\u00A0\u00A0}',
        '}'
    ];

    // Clear existing static code lines (except cursor)
    const existingLines = codeDisplay.querySelectorAll('.code-line');
    existingLines.forEach(line => line.remove());

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 430;

    if (prefersReducedMotion) {
        // Show all lines immediately without animation
        codeLines.forEach(line => {
            const lineElement = document.createElement('div');
            lineElement.className = 'code-line';
            lineElement.textContent = line;
            codeDisplay.insertBefore(lineElement, cursor);
        });
        return;
    }

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let currentLineElement = null;

    function typeLine() {
        if (currentLineIndex >= codeLines.length) {
            // Animation complete
            return;
        }

        const currentLine = codeLines[currentLineIndex];

        // Create new line element if starting a new line
        if (currentCharIndex === 0) {
            currentLineElement = document.createElement('div');
            currentLineElement.className = 'code-line';
            codeDisplay.insertBefore(currentLineElement, cursor);
        }

        // Add next character
        if (currentCharIndex < currentLine.length) {
            currentLineElement.textContent = currentLine.substring(0, currentCharIndex + 1);
            currentCharIndex++;

            // Random typing speed between 30-80ms for realistic effect
            const delay = Math.random() * 50 + 30;
            setTimeout(typeLine, delay);
        } else {
            // Line complete, move to next line
            currentLineIndex++;
            currentCharIndex = 0;

            // Pause between lines (200-400ms)
            const lineDelay = Math.random() * 200 + 200;
            setTimeout(typeLine, lineDelay);
        }
    }

    // Start typing animation after a delay
    setTimeout(typeLine, 1000);
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#10b981' : '#3b82f6',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        maxWidth: '400px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out'
    });

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }
    }, 5000);
}

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add ripple effect to buttons
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .btn {
        position: relative;
        overflow: hidden;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        opacity: 0.7;
        transition: opacity 0.2s;
    }

    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounced scroll handler
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll handlers
const debouncedScrollHandler = debounce(() => {
    // Any heavy scroll operations can be placed here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add some CSS for loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }

    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    body:not(.loaded)::after {
        content: '';
        position: fixed;
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        margin: -25px 0 0 -25px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #2563eb;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 10000;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    body.loaded::before,
    body.loaded::after {
        display: none;
    }
`;
document.head.appendChild(loadingStyle);
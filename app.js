// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navList = document.getElementById('nav-list');

navToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Header scroll effect
const header = document.getElementById('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// QR Code generation
function generateQRPattern(canvas, problemType) {
    const ctx = canvas.getContext('2d');
    const size = 80;
    const moduleSize = 4;
    const modules = size / moduleSize;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Generate pattern based on problem type
    ctx.fillStyle = '#0a0a0a';
    const patterns = {
        trash: [1,1,1,1,1,0,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        parking: [1,0,1,0,1,1,0,1,1,0,1,0,1,1,1,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0],
        trade: [0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,1,1],
        roads: [1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,0,0,0,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1]
    };
    
    const pattern = patterns[problemType] || patterns.trash;
    
    for (let i = 0; i < modules; i++) {
        for (let j = 0; j < modules; j++) {
            const index = (i * modules + j) % pattern.length;
            if (pattern[index]) {
                ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
            }
        }
    }
    
    // Add corner markers
    const markerPositions = [[0,0], [modules-7,0], [0,modules-7]];
    markerPositions.forEach(([x, y]) => {
        // Outer square
        ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect((x+1) * moduleSize, (y+1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect((x+2) * moduleSize, (y+2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    });
}

// Initialize QR codes
function initializeQRCodes() {
    const qrCanvases = document.querySelectorAll('.qr-canvas');
    qrCanvases.forEach(canvas => {
        const problemType = canvas.getAttribute('data-problem');
        generateQRPattern(canvas, problemType);
        
        canvas.addEventListener('click', () => {
            const problems = {
                trash: 'Разбросанный мусор',
                parking: 'Хаотичная парковка', 
                trade: 'Нелегальная торговля (возможно)',
                roads: 'Разбитая дорога и ямы'
            };
            
            const descriptions = {
                trash: 'Несанкционированные свалки мусора в жилых дворах и общественных местах. Требуется организация регулярной уборки и установка дополнительных контейнеров.',
                parking: 'Автомобили паркуются на тротуарах, газонах и детских площадках, создавая препятствия для пешеходов и портя городскую среду.',
                trade: 'Стихийные торговые точки без соответствующих разрешений создают антисанитарные условия и нарушают архитектурный облик района.',
                roads: 'Разбитое асфальтовое покрытие, ямы и трещины на дорогах создают опасность для транспорта и пешеходов.'
            };
            
            alert(`${problems[problemType]}\n\n${descriptions[problemType]}\n\nДля получения подробной информации отсканируйте QR-код или свяжитесь с нами: grouptime@mail.ru`);
        });
    });
}

// CTA Button handlers
function initializeCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta__card button');
    
    ctaButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const actions = [
                () => {
                    window.open('mailto:grouptime@mail.ru?subject=Сообщение о проблеме в МО Ланское&body=Опишите проблему, укажите адрес и приложите фотографии если возможно.', '_blank');
                },
                () => {
                    const text = encodeURIComponent('Присоединяйтесь к кампании "Твой Ланской – Сделай чище!" #ЧистыйЛанской #ГруппаВремени');
                    const url = encodeURIComponent('https://www.grouptime.ru');
                    window.open(`https://vk.com/share.php?url=${url}&title=${text}`, '_blank');
                },
                () => {
                    window.open('mailto:grouptime@mail.ru?subject=Хочу стать волонтёром&body=Здравствуйте! Я хочу присоединиться к команде волонтёров GROUP TIME.', '_blank');
                }
            ];
            
            actions[index]();
        });
    });
}

// Enhanced stats counter animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-card__number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                
                if (text.includes('70,100+')) {
                    animateNumber(target, 0, 70100, 2000, '+');
                }
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString('ru-RU') + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Elements to animate on scroll
const animatedElements = document.querySelectorAll(`
    .audience__item,
    .channels__item,
    .effects__box,
    .problems__item,
    .slogan__text,
    .effects__image,
    .stat-card,
    .cta__card,
    .about-lanskoy__description
`);

animatedElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll indicator click
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const sloganSection = document.getElementById('slogan');
        if (sloganSection) {
            const offsetTop = sloganSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
}

// Parallax effect for decorative elements
function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.decoration, .effects__wave, .problems__arrow');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform += ` translateY(${yPos}px)`;
    });
}

// Throttled parallax for better performance
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
        setTimeout(() => {
            ticking = false;
        }, 16); // ~60fps
    }
}

window.addEventListener('scroll', requestTick);

// Enhanced hashtag interactions
function initializeHashtags() {
    const hashtags = document.querySelectorAll('.hashtag');
    
    hashtags.forEach(hashtag => {
        hashtag.addEventListener('click', () => {
            const text = hashtag.textContent;
            const searchUrl = `https://vk.com/search?c%5Bq%5D=${encodeURIComponent(text)}&c%5Bsection%5D=auto`;
            window.open(searchUrl, '_blank');
        });
        
        hashtag.style.cursor = 'pointer';
        hashtag.title = `Найти в ВКонтакте: ${hashtag.textContent}`;
    });
}

// Call initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeHashtags();
});

// Enhanced hover effects
const hoverElements = document.querySelectorAll(`
    .audience__item,
    .channels__item,
    .problems__item
`);

hoverElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Enhanced parallax for new elements
function updateEnhancedParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.decoration, .effects__wave, .problems__arrow');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.3;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
    
    // Parallax for About Lanskoy section
    const aboutSection = document.querySelector('.about-lanskoy');
    if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            const statCards = aboutSection.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
                const delay = index * 100;
                const progress = Math.max(0, (window.innerHeight - rect.top) / window.innerHeight);
                card.style.transform = `translateY(${(1 - progress) * 30}px)`;
                card.style.opacity = Math.min(1, progress + 0.2);
            });
        }
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    updateActiveNavLink();
    
    // Initialize new features
    initializeQRCodes();
    initializeCTAButtons();
    animateStats();
    
    // Add loading animation class removal
    document.body.classList.add('loaded');
    
    // Start any initial animations
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease-out';
    }
    
    // Enhanced scroll effects
    let enhancedTicking = false;
    
    function requestEnhancedTick() {
        if (!enhancedTicking) {
            requestAnimationFrame(updateEnhancedParallax);
            enhancedTicking = true;
            setTimeout(() => {
                enhancedTicking = false;
            }, 16);
        }
    }
    
    window.addEventListener('scroll', requestEnhancedTick, { passive: true });
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .stat-card {
        animation: slideInLeft 0.6s ease-out forwards;
    }
    
    .stat-card:nth-child(even) {
        animation: slideInRight 0.6s ease-out forwards;
    }
    
    .cta__card {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .cta__card:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .cta__card:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);

// Performance optimization: Passive event listeners
if ('passive' in document.createElement('div')) {
    window.removeEventListener('scroll', updateActiveNavLink);
    window.removeEventListener('scroll', requestTick);
    
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navList.classList.contains('active')) {
        navList.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.focus();
    }
});

// Add focus styles for keyboard navigation
const focusableElements = document.querySelectorAll(`
    a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])
`);

focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        this.classList.add('keyboard-focus');
    });
    
    element.addEventListener('blur', function() {
        this.classList.remove('keyboard-focus');
    });
});